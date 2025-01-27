import { qGetBlogs, qGetBlog } from '../controllers/blog';
import { mCreateBlog, mUpdateBlog, mDeleteBlog } from '../controllers/blog';

export const blogResolver = {
    Query: {
        getBlogs: qGetBlogs,
        getBlog: qGetBlog
    },
    Mutation: {
        createBlog: mCreateBlog,
        updateBlog: mUpdateBlog,
        deleteBlog: mDeleteBlog
    }
}