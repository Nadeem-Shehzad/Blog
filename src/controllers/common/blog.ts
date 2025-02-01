import { BlogResponse, AuthorProfileResponse, IQueryResponse } from '../../utils/types';
import Blog from '../../models/blog';
import User from '../../models/user';
import { compose, ErrorHandling } from '../../middlewares/common';



export const qGetBlogs = compose(ErrorHandling)(async (): Promise<BlogResponse> => {
    const blogs = await Blog.find({ status: { $ne: 'draft' } });
    return { success: true, message: 'All Blogs', data: blogs };
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


export const qGetBlogsByAuthor = compose(ErrorHandling)(async (_: any, { authorId }: { authorId: string }): Promise<BlogResponse> => {
    const author = await User.findById(authorId);
    if (!author) {
        throw new Error(`Author not Found!`);
    }

    if (author.role !== 'Author') {
        throw new Error('Not Author!');
    }

    const blogs = await Blog.find({ creater_id: authorId });

    return { success: true, message: `${author.username}'s Blogs`, data: blogs };
});


export const qGetAllAuthors = compose(ErrorHandling)(async (): Promise<IQueryResponse> => {
    const authers = await User.find({ role: { $nin: ['Admin', 'Reader'] } }).select('-password -token');
    return { success: true, message: 'All Authors', data: authers };
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