
import { userResolver } from './user'
import {blogResolver} from './blog';

export const resolvers = {
    Query: {
        ...userResolver.Query,
        ...blogResolver.Query
    },

    Mutation: {
        ...userResolver.Mutation,
        ...blogResolver.Mutation
    }
}

