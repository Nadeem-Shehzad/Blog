import {
    qGetBlogs, qGetBlog, qGetAuthorProfile,
    qGetBlogsByAuthor, qGetAllAuthors
} from '../../controllers/common/blog';


export const commonBlogResolver = {
    Query: {
        getBlogs: qGetBlogs,
        getBlog: qGetBlog,
        getAllAuthors: qGetAllAuthors,
        getAuthorProfile: qGetAuthorProfile,
        getBlogsByAuthor: qGetBlogsByAuthor
    }
}