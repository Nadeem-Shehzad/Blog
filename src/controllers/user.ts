import jwt from 'jsonwebtoken';
import { IUser, IMutationResponse, ISignIn, MyContext, IQueryResponse } from '../utils/types';
import User from '../models/user';


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


export const mSignOut = async (_: any, __: any, contextValue: MyContext): Promise<IMutationResponse> => {

    const { userId } = contextValue;
    if (!userId) {
        return { success: false, message: 'You must logged in!.', data: null };
    }

    const updatedUserData = await User.findByIdAndUpdate(
        userId,
        {
            $set: { token: '' }
        },
        { new: true }
    );

    return { success: true, message: 'User SignedOut.', data: updatedUserData };
}


export const qGetReaders = async (_: any, __: any, contextValue: MyContext): Promise<IQueryResponse> => {

    const { userId } = contextValue;
    if (!userId) {
        return { success: false, message: 'You must logged in!.', data: null };
    }

    const { role } = contextValue;
    if (role?.toString() !== 'Admin') {
        return { success: false, message: 'Access denied!.', data: null };
    }

    try {
        const users = await User.find({ role: { $nin: ['Admin', 'Author'] } });
        return { success: true, message: 'User Data', data: users };

    } catch (error) {
        return { success: true, message: 'Data fetching Error!', data: null }
    }
}