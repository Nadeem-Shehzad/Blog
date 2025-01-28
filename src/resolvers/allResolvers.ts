
import { userResolver } from './common/auth'
import {blogResolver} from './author/blog';

export const resolvers = {
    Query: {
        //...userResolver.Query,
        ...blogResolver.Query
    },

    Mutation: {
        ...userResolver.Mutation,
        ...blogResolver.Mutation
    }
}

