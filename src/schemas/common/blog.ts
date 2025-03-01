import {gql} from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse,
    AuthorData, AuthorProfileQueryResponse, PaginatedBlogs
} from '../dataTypes/blogTypes/queryTypes';

import { UserType, QueryResponse,PaginatedUsers } from '../dataTypes/userTypes/queryTypes';

export const commonSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${PaginatedBlogs}
${SingleBlogQueryResponse}

${UserType}
${QueryResponse}
${PaginatedUsers}

${AuthorData}
${AuthorProfileQueryResponse}

# queries
type Query{
    getBlogs(page: Int!, limit: Int!): PaginatedBlogs
    getBlog(blogId: String!): SingleBlogQueryResponse
    getAllAuthors(page: Int!, limit: Int!): PaginatedUsers
    getAuthorProfile(authorId: String!): AuthorProfileQueryResponse
    getBlogsByAuthor(authorId: String!, page: Int!, limit: Int!): PaginatedBlogs
    searchBlogByTags(searchTags: [String!]!): BlogQueryResponse
    searchBlogByTitle(title:String!): BlogQueryResponse
    getAuhtorMostLikedBlogs(authorId: String!): BlogQueryResponse
    getMostLikedBlogs: BlogQueryResponse
}

`;