import mongoose from 'mongoose';
import { UserDocument } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';
import { BlogDocument } from '../models/blog';


// User Types
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


// Blog Types
export interface IBlog {
    creater_id: mongoose.Types.ObjectId;
    title: string;
    image: { public_id: string; url: string };
    tags: string[],
    description: string;
    likes: { userId: mongoose.Types.ObjectId }[];
    comments: { userId: mongoose.Types.ObjectId, comment: string }[];
    status: string;
}

export interface BlogResponse {
    success: boolean;
    message: string;
    data: BlogDocument[] | BlogDocument | null
}

export interface LikedBlogResponse {
    success: boolean;
    message: string;
}