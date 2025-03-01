import { IBlog, BlogResponse, MyContext, FollowUserResponse, PaginatedBlogs } from '../../utils/types';
import Blog from '../../models/blog';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling, IsBlogExists } from '../../middlewares/common';
import { getSocketInstance } from '../../utils/socketInstance';

import { getRedisClient } from '../../redis/redis';
const redis = getRedisClient();


export const qGetDraftedBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { page, limit }: { page: number, limit: number }, context: MyContext): Promise<PaginatedBlogs> => {

        const authorId = context.userId;
        const key: string = `qGetDraftedBlogs:${authorId}:${page}:${limit}`;

        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const blogs = await Blog.find({ $and: [{ status: 'draft' }, { creater_id: context.userId }] }).skip((page - 1) * limit).limit(limit);
        const total = blogs.length;    

        await redis.set(key, JSON.stringify({ blogs, total }), 'EX', 3600);

        return { blogs, total };
    });


export const qGetMyBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { page, limit }: { page: number, limit: number }, context: MyContext): Promise<PaginatedBlogs> => {

        const authorId = context.userId;
        const key: string = `qGetMyBlogs:${authorId}:${page}:${limit}`;

        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const blogs = await Blog.find({ $and: [{ status: 'published' }, { creater_id: context.userId }] }).skip((page - 1) * limit).limit(limit);
        const total = blogs.length;    

        await redis.set(key, JSON.stringify({ blogs, total }), 'EX', 3600);

        return { blogs, total };
    });


export const qGetMyFollowers = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, __: any, context: MyContext): Promise<FollowUserResponse> => {

        const authorId = context.userId;
        const key: string = `qGetMyFollowers:${authorId}`;

        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const data = await User.findById(context.userId).populate('followers', 'username email').lean();

        await redis.set(key, JSON.stringify({ data }), 'EX', 3600);

        return { success: true, message: 'All Followers', data: data?.followers || [] };
    });



export const mCreateBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogData }: { blogData: IBlog }, context: MyContext): Promise<BlogResponse> => {

        if (!context.userId) {
            throw new Error("User not authenticated!");
        }

        const { title, description, image, tags, status } = blogData;

        const finalStatus = status || "draft";

        const newBlog = await Blog.create({
            creater_id: context.userId,
            title: title,
            description: description,
            image: {
                public_id: image.public_id,
                url: image.url
            },
            tags: tags || [],
            status: finalStatus
        });

        const io = getSocketInstance();

        // Notify all readers in the author's room
        io.to(context.userId.toString()).emit("notification", {
            type: "blog",
            message: `New blog published: ${title}!`,
        });

        return { success: true, message: `Blog ${finalStatus === "published" ? "published" : "saved as draft"}`, data: newBlog };

    });


export const mUpdateBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogId, blogData }: { blogId: string, blogData: IBlog }, context: MyContext): Promise<BlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== context.userId) {
            return { success: false, message: 'Access Denied!', data: null };
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    ...blogData
                }
            },
            { new: true }
        );

        return { success: true, message: 'Blog Updated.', data: updatedBlog };
    });


export const mDeleteBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<BlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== context.userId) {
            return { success: false, message: 'Access Denied!', data: null };
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        return { success: true, message: 'Blog Deleted.', data: deletedBlog };
    });