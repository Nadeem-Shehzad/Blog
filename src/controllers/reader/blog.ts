import mongoose from 'mongoose';
import { LikedBlogResponse, MyContext, M_BookmarkResponse } from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import BookMarkBlog from '../../models/bookmark';
import { checkUserLoggedIn, checkUserIsReader } from '../../utils/commonUtils';



export const mLikedBlog = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<LikedBlogResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not exist!', data: null };
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

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred', data: null };
        }
    }
}


export const qGetMyLikedBlogs = async (_: any, __: any, contextValue: MyContext): Promise<LikedBlogResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const likedBlogs = await LikedBlog.find({ userId: userId });

        return { success: true, message: 'Your liked blogs.', data: likedBlogs };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}


export const mBookMarkedBlog = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<M_BookmarkResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not exist!', data: null };
        }

        const isBookMarked = await BookMarkBlog.findOne({ $and: [{ userId: userId }, { blogId: blogId }] });
        if (isBookMarked) {
            return { success: false, message: 'Already Bookmarked!', data: null };
        }

        await BookMarkBlog.create({
            userId,
            blogId
        });

        return { success: true, message: 'Blog bookmarked.', data: null };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}


export const qGetMyBookmark = async (_: any, __: any, contextValue: MyContext): Promise<M_BookmarkResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const bookMarks = await BookMarkBlog.find({ userId: userId });

        return { success: true, message: 'Your bookmarks.', data: bookMarks };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}


export const mDeleteBookMarkedBlog = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<M_BookmarkResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const bookmark = await BookMarkBlog.findById(blogId);
        if (!bookmark) {
            return { success: false, message: 'Bookmark not exist!', data: null };
        }

        if (bookmark.userId.toString() !== userId) {
            return { success: false, message: 'Not Allowed to delete others bookmark!', data: null };
        }

        await BookMarkBlog.findByIdAndDelete(blogId);

        return { success: true, message: 'Bookmark deleted.', data: null };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}
