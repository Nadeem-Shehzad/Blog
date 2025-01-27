import {gql} from 'graphql-tag';


export const blogSchema = gql`

# for query types
type Like {
    userId: String! # MongoDB ObjectId as a string
}

type Comment{
    userId: String!
    comment: String! 
}

type Image {
    public_id: String!
    url: String!
}

type Blog{
    creater_id: String!
    title: String!
    image: Image!
    description: String
    likes: [Like!]
    comments: [Comment!]
}

type BlogQueryResponse{
    success: Boolean!
    message: String!
    data: [Blog]
}

type SingleBlogQueryResponse{
    success: Boolean!
    message: String!
    data: Blog
}

# queries
type Query{
    getBlogs: BlogQueryResponse
    getBlog(blogId: String!): SingleBlogQueryResponse
}

# for mutation types
input LikeInput {
  userId: String!
}

input CommentInput{
    userId: String!
    comment: String! 
}

input ImageInput {
    public_id: String!
    url: String!
}

input BlogInput{
    title: String
    image: ImageInput!
    description: String
    likes: [LikeInput!]
    comments: [CommentInput!]
}

input BlogUpdateInput{
    title: String
    image: ImageInput
    description: String
    likes: [LikeInput!]
    comments: [CommentInput!]
}

type BlogMutationResponse{
    success: Boolean!
    message: String!
    data: Blog
}

# mutation 
type Mutation{
    createBlog(blogData: BlogInput): BlogMutationResponse!
    updateBlog(blogId: String!, blogData: BlogUpdateInput!): BlogMutationResponse!
    deleteBlog(blogId: String!): BlogMutationResponse!
}

`;