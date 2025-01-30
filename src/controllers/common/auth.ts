import jwt from 'jsonwebtoken';
import { IUser, IMutationResponse, ISignIn, MyContext, UpdateIUser } from '../../utils/types';
import User from '../../models/user';
import { authMiddleware } from '../../middlewares/common/auth';


export const mSignUp = async (_: any, { userData }: { userData: IUser }): Promise<IMutationResponse> => {

    const user = await User.findUserByEmail(userData.email);

    if (user) {
        return { success: false, message: 'User Exists.', data: null };
    }

    const hashedPassword = await User.hashedPassword(userData.password);

    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    return newUser
        ? { success: true, message: 'User SignedUp.', data: newUser }
        : { success: false, message: 'User not SignedUp.', data: null };
}


export const mSignIn = async (_: any, { userData }: { userData: ISignIn }): Promise<IMutationResponse> => {

    const user = await User.findUserByEmail(userData.email);

    if (!user) {
        return { success: false, message: 'User not Exists.', data: null };
    }

    const passwordMatched = await user.isPasswordMatched(userData.password);
    if (!passwordMatched) {
        return { success: false, message: 'Password not matched.', data: null };
    }

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        return { success: false, message: 'JWT_SECRET token missing.', data: null };
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
}


export const mSignOut = authMiddleware(async (_: any, __: any, context: MyContext): Promise<IMutationResponse> => {

    const updatedUserData = await User.findByIdAndUpdate(
        context.userId,
        {
            $set: { token: '' }
        },
        { new: true }
    );

    return { success: true, message: 'User SignedOut.', data: updatedUserData };
});


export const mUpdateProfile = authMiddleware(async (_: any, { userData }: { userData: UpdateIUser }, contextValue: MyContext): Promise<IMutationResponse> => {

    const updatedUserData = await User.findByIdAndUpdate(
        contextValue.userId,
        {
            $set: { ...userData }
        },
        { new: true }
    );

    return { success: true, message: 'User Profile updated.', data: updatedUserData };
});


export const mResetPassword = authMiddleware(async (_: any, { newPassword }: { newPassword: string }, context: MyContext): Promise<IMutationResponse> => {

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


export const mDeleteAccount = authMiddleware(async (_: any, __: any, context: MyContext): Promise<IMutationResponse> => {

    const deletedUserData = await User.findByIdAndDelete(context.userId);

    return { success: true, message: 'User account deleted.', data: deletedUserData };
});