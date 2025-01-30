import mongoose from 'mongoose';
import { LikedBlogResponse, MyContext, M_BookmarkResponse } from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import BookMarkBlog from '../../models/bookmark';
import { authMiddleware } from '../../middlewares/common/auth';
import { checkRole } from '../../middlewares/common/checkRole';



export const mLikedBlog = authMiddleware(checkRole(['Reader'])(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<LikedBlogResponse> => {

    try {

        const userObjectId = new mongoose.Types.ObjectId(context.userId);

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
}));


export const qGetMyLikedBlogs = authMiddleware(checkRole(['Reader'])(async (_: any, __: any, context: MyContext): Promise<LikedBlogResponse> => {

    try {
        const likedBlogs = await LikedBlog.find({ userId: context.userId });

        return { success: true, message: 'Your liked blogs.', data: likedBlogs };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}));


export const mBookMarkedBlog = authMiddleware(checkRole(['Reader'])(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

    try {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not exist!', data: null };
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

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}));


export const qGetMyBookmark = authMiddleware(checkRole(['Reader'])(async (_: any, __: any, context: MyContext): Promise<M_BookmarkResponse> => {

    try {

        const bookMarks = await BookMarkBlog.find({ userId: context.userId });

        return { success: true, message: 'Your bookmarks.', data: bookMarks };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred!', data: null };
        }
    }
}));


export const mDeleteBookMarkedBlog = authMiddleware(checkRole(['Reader'])(async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<M_BookmarkResponse> => {

    try {

        const bookmark = await BookMarkBlog.findById(blogId);
        if (!bookmark) {
            return { success: false, message: 'Bookmark not exist!', data: null };
        }

        if (bookmark.userId.toString() !== context.userId) {
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
}));