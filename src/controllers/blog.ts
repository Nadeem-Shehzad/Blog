import { IBlog, BlogResponse, MyContext } from '../utils/types';
import Blog from '../models/blog';
import { checkUserLoggedIn, checkUserIsAuthor } from '../utils/commonUtils';
import cloudinary from '../config/cloudinaryConfig';


export const qGetBlogs = async (): Promise<BlogResponse> => {
    const blogs = await Blog.find({});
    return { success: true, message: 'All Blogs', data: blogs };
};


export const qGetBlog = async (_: any, { blogId }: { blogId: string }): Promise<BlogResponse> => {
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return { success: false, message: 'Blog not Exist!', data: null };
    }
    return { success: true, message: 'Blog', data: blog };
};


export const mCreateBlog = async (_: any, { blogData }: { blogData: IBlog }, contextValue: MyContext): Promise<BlogResponse> => {

    const { userId, role } = contextValue;

    try {
        checkUserLoggedIn(userId);
        checkUserIsAuthor(role);

        const newBlog = await Blog.create({
            creater_id: userId,
            title: blogData.title,
            description: blogData.description,
            image: {
                public_id: blogData.image.public_id,
                url: blogData.image.url
            },
        });

        return { success: true, message: 'Blog Created.', data: newBlog };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };
        } else {
            return { success: false, message: 'Server error occurred', data: null };
        }
    }
};


export const mUpdateBlog = async (_: any, { blogId, blogData }: { blogId: string, blogData: IBlog }, contextValue: MyContext): Promise<BlogResponse> => {

    const { userId } = contextValue;

    try {
        checkUserLoggedIn(userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== userId) {
            return { success: false, message: 'Access Denied!', data: null };
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    ...blogData
                }
            },
            { new: true }
        );

        return { success: true, message: 'Blog Updated.', data: updatedBlog };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred', data: null };
        }
    }
};


export const mDeleteBlog = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<BlogResponse> => {

    const { userId } = contextValue;

    try {
        checkUserLoggedIn(userId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== userId) {
            return { success: false, message: 'Access Denied!', data: null };
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId); 

        return { success: true, message: 'Blog Deleted.', data: deletedBlog };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred', data: null };
        }
    }
};