import { gql } from 'graphql-tag';

import { UserType, QueryResponse, SingleUserQueryResponse } from '../dataTypes/userTypes/queryTypes';
import {BlogMutationResponse} from '../dataTypes/blogTypes/mutationTypes'

export const adminSchema = gql`

# types
${UserType}
${QueryResponse}
${SingleUserQueryResponse}

${BlogMutationResponse}

type Query{
    getReaders: QueryResponse
}

type Mutation{
    blockUser(userId:String!): SingleUserQueryResponse
    unBlockUser(userId:String!): SingleUserQueryResponse
    deleteCommentByadmin(blogId:String!, commentId:String!): BlogMutationResponse
    deleteBlogByAdmin(blogId:String!): BlogMutationResponse
    deleteUserAccount(userId: String!): SingleUserQueryResponse
}
`;