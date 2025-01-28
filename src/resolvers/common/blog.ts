import { qGetBlogs,qGetBlog } from '../../controllers/common/blog';

export const commonBlogResolver = {
    Query: {
        getBlogs: qGetBlogs,
        getBlog: qGetBlog
    }
}