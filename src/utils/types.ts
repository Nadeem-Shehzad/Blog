import mongoose from 'mongoose';
import { UserDocument } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';
import { BlogDocument } from '../models/blog';
import { IBookMarkBlog } from '../models/bookmark';
import { ILikedBlog } from '../models/likedBlog';
import { IComment } from '../models/comment';


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

export interface UpdateIUser {
    username: string;
    email: string;
    password: string;
    image: string;
    bio: string;
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

export interface PaginatedUsers{
    users: IUser[];
    total: number;
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

export interface PaginatedBlogs {
    blogs: IBlog[];
    total: number;
}

export interface PaginatedLikedBlogs {
    blogs: ILikedBlog[];
    total: number;
}

export interface PaginatedBookMarkedBlogs {
    blogs: IBookMarkBlog[];
    total: number;
}

export interface BlogResponse {
    success: boolean;
    message: string;
    data: BlogDocument[] | BlogDocument | null
}

export interface LikedBlogResponse {
    success: boolean;
    message: string;
    data: ILikedBlog[] | ILikedBlog | null
}


export interface Notification {
    blogId:string;
    authorId: string;
    likedBy: string;
    message: string;
}

export interface CommentBlogResponse {
    success: boolean;
    message: string;
    data: IComment | null
}

export interface M_BookmarkResponse {
    success: boolean;
    message: string;
    data: IBookMarkBlog[] | IBookMarkBlog | null
}

export interface FollowUser {
    username: string;
    email: string;
    role: string
}

export interface FollowUserResponse {
    success: boolean;
    message: string;
    data: FollowUser[] | null
}

export interface AuthorData {
    username: string;
    email: string;
    bio: string;
    followers: FollowUser[] | null
}

export interface AuthorProfileResponse {
    success: boolean;
    message: string;
    author: AuthorData | null;
    blogs: BlogDocument[] | null;
}

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}