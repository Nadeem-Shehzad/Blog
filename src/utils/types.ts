import { UserDocument } from '../models/user'

export interface IUser {
    username: string;
    email: string;
    password: string;
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


export interface ISignInResponse {
    success: boolean;
    message: string;
    token: string | null;
}