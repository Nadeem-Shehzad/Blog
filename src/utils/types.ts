import { UserDocument } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';


export interface IUser {
    username: string;
    email: string;
    password: string;
    image: string;
    isBlocked: boolean;
    bio: string;
    role: string;
    following: [];
    followers: [];
    token: string;
}


export interface IQueryResponse {
    success: boolean;
    message: string;
    data: UserDocument[] | null
}


export interface IMutationResponse {
    success: boolean;
    message: string;
    data: UserDocument | null
}


export interface ISignIn {
    email: string;
    password: string;
}

export interface MyContext {
    userId?: string;
    email?: string;
    role?: string;
}

export interface CustomJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
}