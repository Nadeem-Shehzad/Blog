import { qGetDraftedBlogs, qGetMyBlogs,qGetMyFollowers } from '../../controllers/author/author';
import { mCreateBlog, mUpdateBlog, mDeleteBlog } from '../../controllers/author/author';

export const authorBlogResolver = {
    Query: {
        getDraftedBlogs: qGetDraftedBlogs,
        getMyBlogs: qGetMyBlogs,
        getMyFollowers: qGetMyFollowers
    },
    Mutation: {
        createBlog: mCreateBlog,
        updateBlog: mUpdateBlog,
        deleteBlog: mDeleteBlog
    }
}