import {gql} from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse,
    AuthorData, AuthorProfileQueryResponse
} from '../dataTypes/blogTypes/queryTypes';

import { UserType, QueryResponse } from '../dataTypes/userTypes/queryTypes';

export const commonBlogSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${SingleBlogQueryResponse}

${UserType}
${QueryResponse}

${AuthorData}
${AuthorProfileQueryResponse}

# queries
type Query{
    getBlogs: BlogQueryResponse
    getBlog(blogId: String!): SingleBlogQueryResponse
    getAllAuthors: QueryResponse
    getAuthorProfile(authorId: String!): AuthorProfileQueryResponse
    getBlogsByAuthor(authorId: String!): BlogQueryResponse
    # searchBlog
    # filter blogs by tag and category
}

`;