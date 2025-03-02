import jwt from 'jsonwebtoken';
import { IUser, IMutationResponse, ISignIn, MyContext, UpdateIUser, MailOptions } from '../../utils/types';
import User from '../../models/user';
import { compose, authMiddleware, ErrorHandling } from '../../middlewares/common';
import Randomstring from 'randomstring';
import nodemailer from 'nodemailer';


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

    if (user.isBlocked) {
        throw new Error('Your account has been blocked by the admin.');
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


export const mDeleteAccount = compose(ErrorHandling, authMiddleware)(async (_: any, __: any, context: MyContext): Promise<IMutationResponse> => {

    const deletedUserData = await User.findByIdAndDelete(context.userId);

    return { success: true, message: 'User account deleted.', data: deletedUserData };
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


export const mForgotPassword = compose(ErrorHandling)(async (_: any, { email }: { email: string }): Promise<IMutationResponse> => {

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('This email does not exist...');
    }

    const randomString = Randomstring.generate();
    //console.log(randomString);

    await User.updateOne({ email: email }, { $set: { token: randomString } });

    sendResetPasswordMail(user.username, user.email, randomString);
    return { success: true, message: 'Please check your mail inbox. and reset your password', data: null };
});


export const mResetPasswordByEmail = compose(ErrorHandling)(async (_: any, { token, newPassword }: { token: string, newPassword: string }): Promise<IMutationResponse> => {

    const user = await User.findOne({ token: token });

    if (user) {
        const newPasswordHashed = await User.hashedPassword(newPassword);
        const userData = await User.findByIdAndUpdate(
            user.id,
            {
                $set: {
                    password: newPasswordHashed,
                    token: ''
                }
            },
            { new: true }
        );

        return { success: true, message: 'User Password Reset.', data: null };

    } else {
        return { success: false, message: 'User Password not Reset.', data: null };
    }
});


const sendResetPasswordMail = async (name: string, email: string, token: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST as string,
            port: Number(process.env.HOST_PORT) || 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.MAIL_USER as string,
                pass: process.env.MAIL_PASSWORD as string,
            },
        } as nodemailer.TransportOptions);

        const mailOptions: MailOptions = {
            from: process.env.MAIL_USER as string,
            to: email,
            subject: 'Password Reset',
            html: `<p>Hi ${name},</p>
                   <p>Click the link below to reset your password:</p>
                   <a href="http://localhost:4000/api/auth/reset-password?token=${token}">Reset Password</a>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail has been sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};