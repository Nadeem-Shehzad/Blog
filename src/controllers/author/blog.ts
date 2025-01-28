import { IBlog, BlogResponse, MyContext } from '../../utils/types';
import Blog from '../../models/blog';
import { checkUserLoggedIn, checkUserIsAuthor } from '../../utils/commonUtils';


// <------- Author Query ------->

export const qGetDraftedBlogs = async (_: any, { blogId }: { blogId: string }, contextValue: MyContext): Promise<BlogResponse> => {
    const { userId } = contextValue;

    try {
        checkUserLoggedIn(userId);

        const draftedBlogs = await Blog.find({ $and: [{ status: 'draft' }, { creater_id: userId }] });
    
        return { success: true, message: 'All Drafted Blogs', data: draftedBlogs };
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: error.message, data: null };

        } else {
            return { success: false, message: 'Server error occurred', data: null };
        }
    }
};

// <------- End Author Query ------->



// <------- Author Mutation ------->

export const mCreateBlog = async (_: any, { blogData }: { blogData: IBlog }, contextValue: MyContext): Promise<BlogResponse> => {

    const { userId, role } = contextValue;
    const { title, description, image, tags, status } = blogData;

    try {
        checkUserLoggedIn(userId);
        checkUserIsAuthor(role);

        const finalStatus = status || "draft";

        const newBlog = await Blog.create({
            creater_id: userId,
            title: title,
            description: description,
            image: {
                public_id: image.public_id,
                url: image.url
            },
            tags: tags || [],
            status: finalStatus
        });

        return { success: true, message: `Blog ${finalStatus === "published" ? "published" : "saved as draft"}`, data: newBlog };

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

// <------- End Author Mutation ------->
