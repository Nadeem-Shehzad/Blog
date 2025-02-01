
import { MyContext, IQueryResponse, IMutationResponse, BlogResponse, CommentBlogResponse } from '../../utils/types';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling, IsBlogExists, IsUserExists } from '../../middlewares/common';
import Blog from '../../models/blog';
import Comment from '../../models/comment';



export const qGetReaders = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))
    (async (_: any, __: any, context: MyContext): Promise<IQueryResponse> => {

        const users = await User.find({ role: { $nin: ['Admin', 'Author'] } });
        return { success: true, message: 'Total Readers', data: users };
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

        return { success: true, message: 'User Unblocked!', data: users };
    });


export const mDeleteBlog = compose(ErrorHandling, authMiddleware, checkRole(['Admin']), IsBlogExists)
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<BlogResponse> => {

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        return { success: true, message: 'Blog Deleted!', data: deletedBlog };
    });


export const mDeleteUser = compose(ErrorHandling, authMiddleware, checkRole(['Admin']), IsUserExists)
    (async (_: any, { userId }: { userId: string }, context: MyContext): Promise<IMutationResponse> => {

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

        await blog.updateOne({ $pull: { comments: { commentId: commentId } } });

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        return { success: true, message: 'Comment Deleted.', data: deletedComment };
    });    