import {gql} from 'graphql-tag';

import {
    BlogType, LikeType, CommentType,
    ImageType, BlogQueryResponse, SingleBlogQueryResponse
} from '../dataTypes/blogTypes/queryTypes';


export const commonBlogSchema = gql`

# query types
${BlogType}
${LikeType}
${CommentType}
${ImageType}
${BlogQueryResponse}
${SingleBlogQueryResponse}

# queries
type Query{
    getBlogs: BlogQueryResponse
    getBlog(blogId: String!): SingleBlogQueryResponse
}

`;