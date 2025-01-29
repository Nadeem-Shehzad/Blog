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
    # searchBlog
    # viewblog by author
    # filter blog by tag and category
    # author profile
}

`;