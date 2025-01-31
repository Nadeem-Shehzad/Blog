import {
    mLikedBlog, qGetMyLikedBlogs,
    mBookMarkedBlog,
    mDeleteBookMarkedBlog,
    qGetMyBookmark,
    qGetUserFollowings,
    mFollowAuthor,
    mUnFollowAuthor
} from '../../controllers/reader/reader';

export const readerResolver = {

    Query: {
        getMyBookMarks: qGetMyBookmark,
        getMyLikedBlogs: qGetMyLikedBlogs,
        getUserFollowings: qGetUserFollowings
    },

    Mutation: {
        likeBlog: mLikedBlog,
        bookmarkBlog: mBookMarkedBlog,
        deleteBookMark: mDeleteBookMarkedBlog,
        followAuthor: mFollowAuthor,
        unFollowAuthor: mUnFollowAuthor
    }
} 