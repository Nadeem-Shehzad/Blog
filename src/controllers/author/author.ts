import { IBlog, BlogResponse, MyContext, FollowUserResponse } from '../../utils/types';
import Blog from '../../models/blog';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling, IsBlogExists } from '../../middlewares/common';
import { getSocketInstance } from '../../utils/socketInstance';


export const qGetDraftedBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, __: any, context: MyContext): Promise<BlogResponse> => {

        const draftedBlogs = await Blog.find({ $and: [{ status: 'draft' }, { creater_id: context.userId }] });
        return { success: true, message: 'All Drafted Blogs', data: draftedBlogs };
    });


export const qGetMyBlogs = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, __: any, context: MyContext): Promise<BlogResponse> => {

        const myBlogs = await Blog.find({ $and: [{ status: 'published' }, { creater_id: context.userId }] });
        return { success: true, message: 'All Your Blogs', data: myBlogs };
    });


export const qGetMyFollowers = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, __: any, context: MyContext): Promise<FollowUserResponse> => {

        const myFollowers = await User.findById(context.userId).populate('followers', 'username email ').lean();
        return { success: true, message: 'All Followers', data: myFollowers?.followers || [] };
    });



export const mCreateBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogData }: { blogData: IBlog }, context: MyContext): Promise<BlogResponse> => {

        if (!context.userId) {
            throw new Error("User not authenticated!");
        }

        const { title, description, image, tags, status } = blogData;

        const finalStatus = status || "draft";

        const newBlog = await Blog.create({
            creater_id: context.userId,
            title: title,
            description: description,
            image: {
                public_id: image.public_id,
                url: image.url
            },
            tags: tags || [],
            status: finalStatus
        });

        const io = getSocketInstance();

        // Notify all readers in the author's room
        io.to(context.userId.toString()).emit("notification", {
            type: "blog",
            message: `New blog published: ${title}!`,
        });

        return { success: true, message: `Blog ${finalStatus === "published" ? "published" : "saved as draft"}`, data: newBlog };

    });


export const mUpdateBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogId, blogData }: { blogId: string, blogData: IBlog }, context: MyContext): Promise<BlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== context.userId) {
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
    });


export const mDeleteBlog = compose(ErrorHandling, authMiddleware, checkRole(['Author']))
    (async (_: any, { blogId }: { blogId: string }, context: MyContext): Promise<BlogResponse> => {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: 'Blog not Exist!', data: null };
        }

        if (blog.creater_id.toString() !== context.userId) {
            return { success: false, message: 'Access Denied!', data: null };
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        return { success: true, message: 'Blog Deleted.', data: deletedBlog };
    });