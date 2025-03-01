import { BlogResponse, AuthorProfileResponse, IQueryResponse, PaginatedBlogs, PaginatedUsers } from '../../utils/types';
import Blog from '../../models/blog';
import User from '../../models/user';
import { compose, ErrorHandling } from '../../middlewares/common';
import mongoose from 'mongoose';



export const qGetBlogs = compose(ErrorHandling)(async (_: any, { page, limit }: { page: number, limit: number }): Promise<PaginatedBlogs> => {
    const blogs = await Blog.find({ status: { $ne: 'draft' } }).skip((page - 1) * limit).limit(limit);
    const totalBlog = blogs.length;
    return { blogs: blogs, total: totalBlog };
});


export const qGetBlog = compose(ErrorHandling)(async (_: any, { blogId }: { blogId: string }): Promise<BlogResponse> => {
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return { success: false, message: 'Blog not Exist!', data: null };
    }
    return { success: true, message: 'Blog', data: blog };
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
    const author = await User.findById(authorId);
    if (!author) {
        throw new Error(`Author not Found!`);
    }

    if (author.role !== 'Author') {
        throw new Error('Not Author!');
    }

    const blogs = await Blog.find({ creater_id: authorId }).skip((page - 1) * limit).limit(limit);
    const totalBlogs = blogs.length;

    return { blogs, total: totalBlogs };
});


export const qGetAllAuthors = compose(ErrorHandling)(async (_: any, { page, limit }: { page: number, limit: number }): Promise<PaginatedUsers> => {
    const authers = await User.find({ role: { $nin: ['Admin', 'Reader'] } }).select('-password -token').skip((page - 1) * limit).limit(limit);
    const totalAuthors = authers.length;
    return { users: authers, total: totalAuthors };
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

    const blogs = await Blog.aggregate([
        { $match: { creater_id: new mongoose.Types.ObjectId(authorId) } },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } }
    ]);
    return { success: true, message: 'Authors most Liked Blogs ...', data: blogs };
});


export const getMostLikedBlogs = compose(ErrorHandling)(async (): Promise<BlogResponse> => {

    const blogs = await Blog.aggregate([
        {
            $addFields: { likesCount: { $size: "$likes" } } // Count likes array length dynamically
        },
        {
            $sort: { likesCount: -1 } // Sort by likes count (descending)
        }
    ]);
    return { success: true, message: 'Blogs', data: blogs };
});