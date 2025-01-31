import jwt from 'jsonwebtoken';
import { IUser, IMutationResponse, ISignIn, MyContext, UpdateIUser } from '../../utils/types';
import User from '../../models/user';
import { compose, authMiddleware, ErrorHandling } from '../../middlewares/common';


export const mSignUp = compose(ErrorHandling)(async (_: any, { userData }: { userData: IUser }): Promise<IMutationResponse> => {

    const user = await User.findUserByEmail(userData.email);

    if (user) {
        throw new Error('User Exists.');
    }

    const hashedPassword = await User.hashedPassword(userData.password);

    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    return newUser
        ? { success: true, message: 'User SignedUp.', data: newUser }
        : { success: false, message: 'User not SignedUp.', data: null };
});


export const mSignIn = compose(ErrorHandling)(async (_: any, { userData }: { userData: ISignIn }): Promise<IMutationResponse> => {

    const user = await User.findUserByEmail(userData.email);

    if (!user) {
        throw new Error('User not Exists.');
    }

    const passwordMatched = await user.isPasswordMatched(userData.password);
    if (!passwordMatched) {
        throw new Error('Password not matched.');
    }

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        throw new Error('JWT_SECRET token missing.');
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role
    }, jwt_secret, { expiresIn: '55m' });

    const updatedUserData = await User.findByIdAndUpdate(
        user._id,
        {
            $set: { token: token }
        },
        { new: true }
    );

    return { success: true, message: 'User SignedIn.', data: updatedUserData };
});


export const mSignOut = compose(ErrorHandling, authMiddleware)(async (_: any, __: any, context: MyContext): Promise<IMutationResponse> => {

    const updatedUserData = await User.findByIdAndUpdate(
        context.userId,
        {
            $set: { token: '' }
        },
        { new: true }
    );

    return { success: true, message: 'User SignedOut.', data: updatedUserData };
});


export const mUpdateProfile = compose(ErrorHandling, authMiddleware)(async (_: any, { userData }: { userData: UpdateIUser }, contextValue: MyContext): Promise<IMutationResponse> => {

    const updatedUserData = await User.findByIdAndUpdate(
        contextValue.userId,
        {
            $set: { ...userData }
        },
        { new: true }
    );

    return { success: true, message: 'User Profile updated.', data: updatedUserData };
});


export const mResetPassword = compose(ErrorHandling, authMiddleware)(async (_: any, { newPassword }: { newPassword: string }, context: MyContext): Promise<IMutationResponse> => {

    const newhashedPassword = await User.hashedPassword(newPassword);

    const updatedUserData = await User.findByIdAndUpdate(
        context.userId,
        {
            $set: {
                password: newhashedPassword,
                token: ''
            }
        },
        { new: true }
    );

    return { success: true, message: 'User Password Reset.', data: updatedUserData };
});


export const mDeleteAccount = compose(ErrorHandling, authMiddleware)(async (_: any, __: any, context: MyContext): Promise<IMutationResponse> => {

    const deletedUserData = await User.findByIdAndDelete(context.userId);

    return { success: true, message: 'User account deleted.', data: deletedUserData };
});