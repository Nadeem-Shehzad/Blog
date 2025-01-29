import { qGetDraftedBlogs } from '../../controllers/author/blog';
import { mCreateBlog, mUpdateBlog, mDeleteBlog } from '../../controllers/author/blog';

export const authorBlogResolver = {
    Query: {
        getDraftedBlogs: qGetDraftedBlogs,
    },
    Mutation: {
        createBlog: mCreateBlog,
        updateBlog: mUpdateBlog,
        deleteBlog: mDeleteBlog
    }
}