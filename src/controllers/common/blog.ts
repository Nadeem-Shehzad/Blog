import { IBlog, BlogResponse, MyContext } from '../../utils/types';
import Blog from '../../models/blog';


export const qGetBlogs = async (): Promise<BlogResponse> => {
    const blogs = await Blog.find({ status: { $ne: 'draft' } });
    return { success: true, message: 'All Blogs', data: blogs };
};


export const qGetBlog = async (_: any, { blogId }: { blogId: string }): Promise<BlogResponse> => {
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return { success: false, message: 'Blog not Exist!', data: null };
    }
    return { success: true, message: 'Blog', data: blog };
};