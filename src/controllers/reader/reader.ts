import mongoose from 'mongoose';
import {
    LikedBlogResponse, MyContext, M_BookmarkResponse,
    FollowUserResponse, CommentBlogResponse
} from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import Comment from '../../models/comment';
import BookMarkBlog from '../../models/bookmark';
import { Notifications } from '../../models/notification';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling } from '../../middlewares/common';
import { getSocketInstance } from '../../utils/socketInstance';
import { activeUsers } from '../../utils/activeUsers';
import { sendSocketData } from '../../utils/util';


export const mLikedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<LikedBlogResponse> => {

        //const io = getSocketInstance();

        const userObjectId = new mongoose.Types.ObjectId(context.userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not exist!');
        }

        const isLiked = blog.likes.some((like) => like.userId.toString() === userObjectId.toString());

        if (!isLiked) {

            await blog.updateOne({ $push: { likes: { userId: userObjectId } } });

            await LikedBlog.create({
                userId: userObjectId,
                blogId: blogId
            });

            // Notify the author
            sendSocketData({
                userId: blog.creater_id.toString(),
                type: "like",
                message: `Your blog "${blog.title}" got a new like!`
            });

            return { success: true, message: 'Blog liked.', data: null };

        } else {
            await blog.updateOne({ $pull: { likes: { userId: userObjectId } } });

            await LikedBlog.deleteOne({
                userId: userObjectId,
                blogId: blogId
            });

            return { success: true, message: 'Blog disliked.', data: null };
        }
    });


export const qGetMyLikedBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, __: any, context: MyContext): Promise<LikedBlogResponse> => {

        const likedBlogs = await LikedBlog.find({ userId: context.userId });

        return { success: true, message: 'Your liked blogs.', data: likedBlogs };
    });


export const mCommentBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(
    async (_: any, { blogId, comment }: { blogId: string, comment: string }, context: MyContext): Promise<CommentBlogResponse> => {

        const userObjectId = new mongoose.Types.ObjectId(context.userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not exist!');
        }

        const newComment = await Comment.create({
            userId: userObjectId,
            blogId: blogId,
            comment: comment
        });

        // Notify the author
        sendSocketData({
            userId: blog.creater_id.toString(),
            type: "comment",
            message: `Your blog "${blog.title}" got a new comment!`
        });

        await blog.updateOne({ $push: { comments: { commentId: newComment._id } } });

        return { success: true, message: 'New Comment', data: newComment };
    }
);


export const mDeleteComment = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(
    async (_: any, { blogId, commentId }: { blogId: string, commentId: string }, context: MyContext): Promise<CommentBlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not exist!');
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found!');
        }

        if (comment.userId.toString() !== context.userId) {
            throw new Error(`Sorry, you can't delete this comment!`);
        }

        await blog.updateOne({ $pull: { comments: { commentId: commentId } } });
        await Comment.findByIdAndDelete(commentId);

        return { success: true, message: 'Comment Deleted.', data: null };
    }
);


export const mBookMarkedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw new Error('Blog not exist!');
        }

        const isBookMarked = await BookMarkBlog.findOne({ $and: [{ userId: context.userId }, { blogId: blogId }] });
        if (isBookMarked) {
            return { success: false, message: 'Already Bookmarked!', data: null };
        }

        await BookMarkBlog.create({
            userId: context.userId,
            blogId
        });

        return { success: true, message: 'Blog bookmarked.', data: null };
    });


export const qGetMyBookmark = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, __: any, context: MyContext): Promise<M_BookmarkResponse> => {

        const bookMarks = await BookMarkBlog.find({ userId: context.userId });

        return { success: true, message: 'Your bookmarks.', data: bookMarks };
    });


export const mDeleteBookMarkedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

        const bookmark = await BookMarkBlog.findById(blogId);
        if (!bookmark) {
            throw new Error('Bookmark not exist!');
        }

        if (bookmark.userId.toString() !== context.userId) {
            throw new Error('Not Allowed to delete others bookmark!');
        }

        await BookMarkBlog.findByIdAndDelete(blogId);

        return { success: true, message: 'Bookmark deleted.', data: null };
    });


export const qGetUserFollowings = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, __: any, context: MyContext): Promise<FollowUserResponse> => {

        const userFollowings = await User.findById(context.userId).populate('following', 'username email role').lean();

        return { success: true, message: 'User Followings.', data: userFollowings?.following || [] };
    });


export const mFollowAuthor = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, { authorId }: { authorId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

        if (!context.userId) {
            throw new Error("User not authenticated!");
        }

        const io = getSocketInstance();

        const reader = await User.findById(context.userId);
        if (!reader) {
            throw new Error('User not Found!');
        }

        const author = await User.findById(authorId);
        if (!author) {
            throw new Error('Author not found!');
        }

        if (author.role !== 'Author') {
            throw new Error('You can only Follow Author!');
        }

        const isFollowing = reader.following.some((following: mongoose.Types.ObjectId) => following.toString() === authorId);
        if (!isFollowing) {
            await reader.updateOne({ $push: { following: authorId } });
            await author.updateOne({ $push: { followers: context.userId } });

            const authorSocketId = activeUsers.get(authorId.toString());
            const readerSocketId = activeUsers.get(context.userId.toString());

            const notificationData = {
                type: "follower",
                message: `You are followed by user ${reader.username}!`,
            };

            if (authorSocketId) {
                io.to(authorSocketId).emit('notification', notificationData);
            } else {
                await Notifications.create({
                    userId: authorId,
                    ...notificationData,
                    isRead: false
                });
            }

            // Join the Reader to the Author's Room
            if (readerSocketId) {
                const socket = io.sockets.sockets.get(readerSocketId);
                if (socket) {
                    socket.join(authorId.toString());
                    console.log(`Reader ${reader.username} joined room ${authorId}`);
                }
            }

        } else {
            throw new Error(`Already Following!`);
        }

        // const isFollower = author.followers.some((follower: mongoose.Types.ObjectId) => follower.toString() === context.userId);
        // if (!isFollower) {
        //     await author.updateOne({ $push: { followers: userObjectId } });
        // } else {
        //     throw new Error(`You are already author's follower`);
        // }

        return { success: true, message: 'Author Followed.', data: null };
    });


export const mUnFollowAuthor = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))
    (async (_: any, { authorId }: { authorId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

        const reader = await User.findById(context.userId);
        if (!reader) {
            throw new Error('User not Found!');
        }

        const author = await User.findById(authorId);
        if (!author) {
            throw new Error('Author not found!');
        }

        if (!reader.following.some((following: mongoose.Types.ObjectId) => following.equals(authorId))) {
            throw new Error('You are not following this author!');
        }

        await reader.updateOne({ $pull: { following: authorId } });
        await author.updateOne({ $pull: { followers: context.userId } });

        return { success: true, message: 'Author unFollowed.', data: null };
    });
