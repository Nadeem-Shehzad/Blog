import { gql } from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse
} from '../dataTypes/blogTypes/queryTypes';

import {
    BlogInput, BlogUpdateInput, LikeInput,
    CommentInput, ImageInput, BlogMutationResponse
} from '../dataTypes/blogTypes/mutationTypes';


export const authorBlogSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${SingleBlogQueryResponse}

# queries
type Query{
    getDraftedBlogs: BlogQueryResponse
    getMyBlogs: BlogQueryResponse
}

# for mutation types
# input LikeInput {
#   userId: String!
# }

# input CommentInput{
#     userId: String!
#     comment: String! 
# }

# input ImageInput {
#     public_id: String!
#     url: String!
# }

# input BlogInput{
#     title: String
#     image: ImageInput!
#     description: String
#     tags: [String!]
#     likes: [LikeInput!]
#     comments: [CommentInput!]
#     status: String
# }

# input BlogUpdateInput{
#     title: String
#     image: ImageInput
#     description: String
#     likes: [LikeInput!]
#     comments: [CommentInput!]
#     status: String
# }

# type BlogMutationResponse{
#     success: Boolean!
#     message: String!
#     data: Blog
# }

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