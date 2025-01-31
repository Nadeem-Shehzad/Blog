import { gql } from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse
} from '../dataTypes/blogTypes/queryTypes';

import {
    BlogInput, BlogUpdateInput, LikeInput,
    CommentInput, ImageInput, BlogMutationResponse
} from '../dataTypes/blogTypes/mutationTypes';

import { FollowUserType,FollowUserQueryResponse } from '../dataTypes/userTypes/queryTypes'



export const authorBlogSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${SingleBlogQueryResponse}

${FollowUserType}
${FollowUserQueryResponse}

# queries
type Query{
    getDraftedBlogs: BlogQueryResponse
    getMyBlogs: BlogQueryResponse
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