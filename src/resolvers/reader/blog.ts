import { mLikedBlog } from '../../controllers/reader/blog';

export const readerBlogResolver = {
    Mutation: {
        likeBlog: mLikedBlog
    }
} 