import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser, IMutationResponse, ISignIn, ISignInResponse } from '../utils/types';
import User from '../models/user';


export const mSignUp = async (_: any, { userData }: { userData: IUser }): Promise<IMutationResponse> => {

    const user = await User.findOne({ email: userData.email });

    if (user) {
        return { success: false, message: 'User Exists.', data: null };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    return newUser
        ? { success: true, message: 'User SignedUp.', data: newUser }
        : { success: false, message: 'User not SignedUp.', data: null };
}


export const mSignIn = async (_: any, { userData }: { userData: ISignIn }): Promise<ISignInResponse> => {

    const user = await User.findOne({ email: userData.email });

    if (!user) {
        return { success: false, message: 'User not Exists.', token: null };
    }

    const passwordMatched = await bcrypt.compare(userData.password, user.password);
    if (!passwordMatched) {
        return { success: false, message: 'Password not matched.', token: null };
    }

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        return { success: false, message: 'JWT_SECRET missing.', token: null };
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email
    }, jwt_secret, { expiresIn: '55m' });

    return { success: true, message: 'User SignedIn.', token: token }
}


export const qGetUsers = async (): Promise<IUser[]> => {

    const users: IUser[] = await User.find({}); 
    return users;
}