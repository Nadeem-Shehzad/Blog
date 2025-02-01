import {
    qGetBlogs, qGetBlog, qGetAuthorProfile,
    qGetBlogsByAuthor, qGetAllAuthors, searchBlogByTag, searchBlogByTitle
} from '../../controllers/common/blog';


export const commonResolver = {
    Query: {
        getBlogs: qGetBlogs,
        getBlog: qGetBlog,
        getAllAuthors: qGetAllAuthors,
        getAuthorProfile: qGetAuthorProfile,
        getBlogsByAuthor: qGetBlogsByAuthor,
        searchBlogByTags: searchBlogByTag,
        searchBlogByTitle: searchBlogByTitle
    }
}