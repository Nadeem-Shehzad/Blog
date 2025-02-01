
import { authResolver } from './common/auth'
import { authorResolver } from './author/author';
import { commonResolver } from './common/blog';
import { adminResolver } from './admin/admin';
import { readerResolver } from './reader/reader';

export const resolvers = {
    Query: {
        ...adminResolver.Query,
        ...authorResolver.Query,
        ...commonResolver.Query,
        ...readerResolver.Query
    },

    Mutation: {
        ...adminResolver.Mutation,
        ...authResolver.Mutation,
        ...authorResolver.Mutation,
        ...readerResolver.Mutation
    }
}

