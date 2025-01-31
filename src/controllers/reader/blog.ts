import mongoose from 'mongoose';
import { LikedBlogResponse, MyContext, M_BookmarkResponse } from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import BookMarkBlog from '../../models/bookmark';
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