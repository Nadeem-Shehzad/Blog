
import { authResolver } from './common/auth'
import { authorBlogResolver } from './author/blog';
import { commonBlogResolver } from './common/blog';
import { adminBlogResolver } from './admin/blog';
import {readerBlogResolver} from './reader/blog';

export const resolvers = {
    Query: {
        ...adminBlogResolver.Query,
        ...authorBlogResolver.Query,
        ...commonBlogResolver.Query
    },

    Mutation: {
        ...authResolver.Mutation,
        ...authorBlogResolver.Mutation,
        ...readerBlogResolver.Mutation
    }
}

