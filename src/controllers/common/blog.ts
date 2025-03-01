import {
    BlogResponse, AuthorProfileResponse,
    PaginatedBlogs, PaginatedUsers
} from '../../utils/types';
import Blog from '../../models/blog';
import User from '../../models/user';
import { compose, ErrorHandling } from '../../middlewares/common';
import mongoose from 'mongoose';

import { getRedisClient } from '../../redis/redis';
const redis = getRedisClient();


export const qGetBlogs = compose(ErrorHandling)(async (_: any, { page, limit }: { page: number, limit: number }): Promise<PaginatedBlogs> => {

    const key: string = `qGetBlogs:${page}:${limit}`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const blogs = await Blog.find({ status: { $ne: 'draft' } }).skip((page - 1) * limit).limit(limit);
    const total = blogs.length;

    await redis.set(key, JSON.stringify({ blogs, total }), 'EX', 3600);

    return { blogs: blogs, total: total };
});


export const qGetBlog = compose(ErrorHandling)(async (_: any, { blogId }: { blogId: string }): Promise<BlogResponse> => {

    const key: string = `qGetBlog:${blogId}`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await Blog.findById(blogId);
    if (!data) {
        return { success: false, message: 'Blog not Exist!', data: null };
    }

    await redis.set(key, JSON.stringify({ data }), 'EX', 3600);

    return { success: true, message: 'Blog', data: data };
});


export const qGetAuthorProfile = compose(ErrorHandling)(async (_: any, { authorId }: { authorId: string }): Promise<AuthorProfileResponse> => {
    const author = await User.findById(authorId);
    if (!author) {
        throw new Error(`Author not Found!`);
    }

    if (author.role !== 'Author') {
        throw new Error('Not Author!');
    }

    const blogs = await Blog.find({ creater_id: authorId });

    return { success: true, message: 'Author Data', author: author, blogs: blogs };
});


export const qGetBlogsByAuthor = compose(ErrorHandling)(async (_: any, { authorId, page, limit }: { authorId: string, page: number, limit: number }): Promise<PaginatedBlogs> => {

    const key: string = `qGetBlogsByAuthor:${authorId}:${page}:${limit}`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const author = await User.findById(authorId);
    if (!author) {
        throw new Error(`Author not Found!`);
    }

    if (author.role !== 'Author') {
        throw new Error('Not Author!');
    }

    const blogs = await Blog.find({ creater_id: authorId }).skip((page - 1) * limit).limit(limit);
    const total = blogs.length;

    await redis.set(key, JSON.stringify({ blogs, total }), 'EX', 3600);

    return { blogs, total };
});


export const qGetAllAuthors = compose(ErrorHandling)(async (_: any, { page, limit }: { page: number, limit: number }): Promise<PaginatedUsers> => {
    
    const key: string = `qGetAllAuthors:${page}:${limit}`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    
    const users = await User.find({ role: { $nin: ['Admin', 'Reader'] } }).select('-password -token').skip((page - 1) * limit).limit(limit);
    const total = users.length;

    await redis.set(key, JSON.stringify({ users, total }), 'EX', 3600);

    return { users, total };
});


export const searchBlogByTag = compose(ErrorHandling)(async (_: any, { searchTags }: { searchTags: string[] }): Promise<BlogResponse> => {

    const blogs = await Blog.find({
        $or: [
            { tags: { $all: searchTags } },  // Exact match for all tags
            { tags: { $in: searchTags.map(tag => new RegExp(tag, 'i')) } } // Partial match
        ]
    });
    return { success: true, message: 'Blogs', data: blogs };
});


export const searchBlogByTitle = compose(ErrorHandling)(async (_: any, { title }: { title: string }): Promise<BlogResponse> => {

    const blogs = await Blog.find({
        title: { $regex: title, $options: 'i' }
    });
    return { success: true, message: 'Blogs', data: blogs };
});


export const getMostLikedBlogsByAuthor = compose(ErrorHandling)(async (_: any, { authorId }: { authorId: string }): Promise<BlogResponse> => {

    const key: string = `getMostLikedBlogsByAuthor:${authorId}`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await Blog.aggregate([
        { $match: { creater_id: new mongoose.Types.ObjectId(authorId) } },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } }
    ]);

    await redis.set(key, JSON.stringify({ data }), 'EX', 3600);   

    return { success: true, message: 'Authors most Liked Blogs ...', data: data };
});


export const getMostLikedBlogs = compose(ErrorHandling)(async (): Promise<BlogResponse> => {

    const key: string = `getMostLikedBlogs`;

    const cachedData = await redis.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await Blog.aggregate([
        {
            $addFields: { likesCount: { $size: "$likes" } } // Count likes array length dynamically
        },
        {
            $sort: { likesCount: -1 } // Sort by likes count (descending)
        }
    ]);

    await redis.set(key, JSON.stringify({ data }), 'EX', 3600);

    return { success: true, message: 'Blogs', data: data };
});