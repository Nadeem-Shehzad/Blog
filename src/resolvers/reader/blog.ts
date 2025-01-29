import { mLikedBlog,qGetMyLikedBlogs, mBookMarkedBlog, mDeleteBookMarkedBlog, qGetMyBookmark } from '../../controllers/reader/blog';

export const readerBlogResolver = {

    Query: {
        getMyBookMarks: qGetMyBookmark,
        getMyLikedBlogs: qGetMyLikedBlogs
    },

    Mutation: {
        likeBlog: mLikedBlog,
        bookmarkBlog: mBookMarkedBlog,
        deleteBookMark: mDeleteBookMarkedBlog
    }
} 