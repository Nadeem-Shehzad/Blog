import { qGetDraftedBlogs } from '../../controllers/author/blog';
import { mCreateBlog, mUpdateBlog, mDeleteBlog } from '../../controllers/author/blog';

export const blogResolver = {
    Query: {
        getBlogs: qGetDraftedBlogs,
        //getBlog: qGetBlog
    },
    Mutation: {
        createBlog: mCreateBlog,
        updateBlog: mUpdateBlog,
        deleteBlog: mDeleteBlog
    }
}