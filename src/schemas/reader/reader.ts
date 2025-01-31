import { gql } from 'graphql-tag';
import { FollowUserType,FollowUserQueryResponse } from '../dataTypes/userTypes/queryTypes'

export const readerSchema = gql`

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

 ${FollowUserType}
 ${FollowUserQueryResponse}

 type Query{
  getMyBookMarks: BookMarkQueryResponse!
  getMyLikedBlogs: BookMarkQueryResponse!
  getUserFollowings: FollowUserQueryResponse
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
   followAuthor(authorId: String!): BlogMutationResponse!
   unFollowAuthor(authorId: String!): BlogMutationResponse!
   # comment on blog
 }

`;