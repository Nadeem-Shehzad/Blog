import { gql } from 'graphql-tag';

import { UserType, QueryResponse, SingleUserQueryResponse,PaginatedUsers } from '../dataTypes/userTypes/queryTypes';
import { BlogMutationResponse } from '../dataTypes/blogTypes/mutationTypes'

export const adminSchema = gql`

# types
${UserType}
${QueryResponse}
${PaginatedUsers}
${SingleUserQueryResponse}

${BlogMutationResponse}

type Query{
    getReaders(page:Int!,limit:Int!): PaginatedUsers
}

type Mutation{
    blockUser(userId:String!): SingleUserQueryResponse
    unBlockUser(userId:String!): SingleUserQueryResponse
    deleteCommentByadmin(blogId:String!, commentId:String!): BlogMutationResponse
    deleteBlogByAdmin(blogId:String!): BlogMutationResponse
    deleteUserAccount(userId: String!): SingleUserQueryResponse
}
`;