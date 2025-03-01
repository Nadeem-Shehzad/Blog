import { gql } from 'graphql-tag';
import { FollowUserType, FollowUserQueryResponse } from '../dataTypes/userTypes/queryTypes';
import { BlogComment, BlogCommentResponse } from '../dataTypes/blogTypes/mutationTypes';
import { PaginatedBlogs, PaginatedLikedBlogs,LikedBlog } from '../dataTypes/blogTypes/queryTypes';

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

 ${BlogComment}
 ${BlogCommentResponse}
 ${PaginatedBlogs}
 ${LikedBlog}
 ${PaginatedLikedBlogs}


 type Query{
  getMyBookMarks(page: Int!, limit: Int!): PaginatedLikedBlogs
  getMyLikedBlogs(page: Int!, limit: Int!): PaginatedLikedBlogs
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
   commentBlog(blogId: String, comment:String!): BlogCommentResponse!
   deleteMyComment(blogId: String,commentId: String!) : BlogCommentResponse!
 }

`;