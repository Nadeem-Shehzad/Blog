
import {
    MyContext, IMutationResponse,
    BlogResponse, CommentBlogResponse, PaginatedUsers
} from '../../utils/types';
import User from '../../models/user';
import {
    compose, authMiddleware, checkRole,
    ErrorHandling, IsUserExists
} from '../../middlewares/common';
import Blog from '../../models/blog';
import Comment from '../../models/comment';
import { sendSocketData } from '../../utils/util';

import { getRedisClient } from '../../redis/redis';
const redis = getRedisClient();


export const qGetReaders = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))
    (async (_: any, { page, limit }: { page: number, limit: number }, context: MyContext): Promise<PaginatedUsers> => {

        const key: string = `qGetReaders:${page}:${limit}`;

        const cachedData = await redis.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const users = await User.find({ role: { $nin: ['Admin', 'Author'] } }).skip((page - 1) * limit).limit(limit);
        const total = users.length;        

        await redis.set(key, JSON.stringify({ users, total }), 'EX', 3600);

        return { users, total };
    });


export const mBlockUser = compose(ErrorHandling, authMiddleware, checkRole(['Admin']), IsUserExists)
    (async (_: any, { userId }: { userId: string }, context: MyContext): Promise<IMutationResponse> => {

        const users = await User.findByIdAndUpdate(
            userId,
            {
                $set: { isBlocked: true }
            },
            { new: true }
        );

        // Notify the user
        sendSocketData({
            userId: userId.toString(),
            type: "block-user",
            message: `You are blocked by admin!`
        });

        return { success: true, message: 'User Blocked!', data: users };
    });


export const mUnblockUser = compose(ErrorHandling, authMiddleware, checkRole(['Admin']), IsUserExists)
    (async (_: any, { userId }: { userId: string }, context: MyContext): Promise<IMutationResponse> => {

        const users = await User.findByIdAndUpdate(
            userId,
            {
                $set: { isBlocked: false }
            },
            { new: true }
        );

        // Notify the user
        sendSocketData({
            userId: userId.toString(),
            type: "unblock-user",
            message: `You are unblocked by admin!`,
        });

        return { success: true, message: 'User Unblocked!', data: users };
    });


export const mDeleteBlog = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<BlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not Exist!');
        }

        // Notify the user
        sendSocketData({
            userId: blog.creater_id.toString(),
            type: "delete-blog",
            message: `Your blog --- ${blog.title} is deleted by admin!`,
        });

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        return { success: true, message: 'Blog Deleted!', data: deletedBlog };
    });


export const mDeleteUser = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))
    (async (_: any, { userId }: { userId: string }, context: MyContext): Promise<IMutationResponse> => {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not exist!');
        }

        // Notify the user
        sendSocketData({
            userId: userId.toString(),
            type: "delete-user",
            message: `Your account is deleted by admin!`,
        });

        const deletedUser = await User.findByIdAndDelete(userId);

        return { success: true, message: 'Blog Deleted!', data: deletedUser };
    });


export const mDeleteComment = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))
    (async (_: any, { blogId, commentId }: { blogId: string, commentId: string }, context: MyContext): Promise<CommentBlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not found!');
        }

        const isCommentExist = await Comment.findById(commentId);
        if (!isCommentExist) {
            throw new Error('comment not exists!');
        }

        // Notify the user
        sendSocketData({
            userId: isCommentExist.userId.toString(),
            type: "delete-comment",
            message: `Your comment --- * ${isCommentExist.comment} * in blog * ${blog.title} * --- is deleted by admin!`,
        });

        await blog.updateOne({ $pull: { comments: { commentId: commentId } } });

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        return { success: true, message: 'Comment Deleted.', data: deletedComment };
    });    