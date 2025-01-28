import {gql} from 'graphql-tag';

export const readerBlogSchema = gql`

 type LikedBlogResponse{
    success: Boolean!
    message: String!
 } 

 type Mutation{
    likeBlog(blogId: String!): LikedBlogResponse!
 }

`;