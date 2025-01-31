
import { authResolver } from './common/auth'
import { authorBlogResolver } from './author/author';
import { commonBlogResolver } from './common/blog';
import { adminBlogResolver } from './admin/admin';
import {readerResolver} from './reader/reader';

export const resolvers = {
    Query: {
        ...adminBlogResolver.Query,
        ...authorBlogResolver.Query,
        ...commonBlogResolver.Query,
        ...readerResolver.Query
    },

    Mutation: {
        ...authResolver.Mutation,
        ...authorBlogResolver.Mutation,
        ...readerResolver.Mutation
    }
}

