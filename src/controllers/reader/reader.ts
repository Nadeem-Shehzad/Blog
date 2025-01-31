import mongoose from 'mongoose';
import { LikedBlogResponse, MyContext, M_BookmarkResponse, FollowUserResponse, IQueryResponse } from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import BookMarkBlog from '../../models/bookmark';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling } from '../../middlewares/common';



export const mLikedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<LikedBlogResponse> => {

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


export const qGetMyLikedBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, __: any, context: MyContext): Promise<LikedBlogResponse> => {

    const likedBlogs = await LikedBlog.find({ userId: context.userId });

    return { success: true, message: 'Your liked blogs.', data: likedBlogs };
});


export const mBookMarkedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

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


export const qGetMyBookmark = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, __: any, context: MyContext): Promise<M_BookmarkResponse> => {

    const bookMarks = await BookMarkBlog.find({ userId: context.userId });

    return { success: true, message: 'Your bookmarks.', data: bookMarks };
});


export const mDeleteBookMarkedBlog = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

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


export const qGetUserFollowings = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, __: any, context: MyContext): Promise<FollowUserResponse> => {

    const userFollowings = await User.findById(context.userId).populate('following', 'username email role').lean();

    return { success: true, message: 'User Followings.', data: userFollowings?.following || [] };
});


export const mFollowAuthor = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, { authorId }: { authorId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

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


export const mUnFollowAuthor = compose(ErrorHandling, authMiddleware, checkRole(['Reader']))(async (_: any, { authorId }: { authorId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

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