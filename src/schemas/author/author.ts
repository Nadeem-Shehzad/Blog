import { gql } from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse, PaginatedBlogs
} from '../dataTypes/blogTypes/queryTypes';

import {
    BlogInput, BlogUpdateInput, LikeInput,
    CommentInput, ImageInput, BlogMutationResponse,
    
} from '../dataTypes/blogTypes/mutationTypes';

import { FollowUserType,FollowUserQueryResponse } from '../dataTypes/userTypes/queryTypes'



export const authorSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${PaginatedBlogs}
${SingleBlogQueryResponse}

${FollowUserType}
${FollowUserQueryResponse}

# queries
type Query{
    getDraftedBlogs(page: Int!, limit: Int!): PaginatedBlogs
    getMyBlogs(page: Int!, limit: Int!): PaginatedBlogs
    getMyFollowers: FollowUserQueryResponse
}


${BlogInput}
${BlogUpdateInput}
${LikeInput}
${CommentInput}
${ImageInput}
${BlogMutationResponse}


# mutation 
type Mutation{
    createBlog(blogData: BlogInput): BlogMutationResponse!
    updateBlog(blogId: String!, blogData: BlogUpdateInput!): BlogMutationResponse!
    deleteBlog(blogId: String!): BlogMutationResponse!
}

`;