import mongoose from 'mongoose';
import { LikedBlogResponse, MyContext } from '../../utils/types';
import Blog from '../../models/blog';
import LikedBlog from '../../models/likedBlog';
import { checkUserLoggedIn, checkUserIsReader } from '../../utils/commonUtils';



export const mLikedBlog = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<LikedBlogResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsReader(role);

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not exist!' };
        }

        const isLiked = blog.likes.some((like) => like.userId.toString() === userObjectId.toString());

        if (!isLiked) {

            await blog.updateOne({ $push: { likes: { userId: userObjectId } } });

            await LikedBlog.create({
                userId: userObjectId,
                blogId: blogId
            });

            return { success: true, message: 'Blog liked.' };

        } else {
            await blog.updateOne({ $pull: { likes: { userId: userObjectId } } });

            await LikedBlog.deleteOne({
                userId: userObjectId,
                blogId: blogId
            });

            return { success: true, message: 'Blog disliked.' };
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message };

        } else {
            return { success: false, message: 'Server error occurred'};
        }
    }
}