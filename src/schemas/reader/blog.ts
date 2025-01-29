import { gql } from 'graphql-tag';

export const readerBlogSchema = gql`

 # query
 type BookMark{
  userId: String!
  blogId: String!
 }

 type BookMarkQueryResponse{
   success: Boolean!
   message: String!
   data: [BookMark!]
 } 

 type Query{
  getMyBookMarks: BookMarkQueryResponse!
  getMyLikedBlogs: BookMarkQueryResponse!
 }

 # mutation
 type BookMarkMutationResponse{
   success: Boolean!
   message: String!
 }

 type Mutation{
   likeBlog(blogId: String!): BlogMutationResponse!
   bookmarkBlog(blogId: String!): BlogMutationResponse!
   deleteBookMark(blogId: String!):BlogMutationResponse!
   # follow/unfollow author
   # comment on blog
 }

`;