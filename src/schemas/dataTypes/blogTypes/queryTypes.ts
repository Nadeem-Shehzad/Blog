
// <------- Query Types ------->

export const BlogType = `
  type Blog {
    creater_id: String!
    title: String!
    image: Image!
    description: String
    tags: [String!]
    likes: [Like!]
    comments: [Comment!]
    status: String!
  }
`;

export const LikeType = `
  type Like {
    userId: String!  
  }
`;

export const CommentType = `
  type Comment {
    userId: String!
    comment: String!
  }
`;

export const ImageType = `
  type Image {
    public_id: String!
    url: String!
  }
`;

export const BlogQueryResponse = `
  type BlogQueryResponse {
    success: Boolean!
    message: String!
    data: [Blog]
  }
`;

export const PaginatedBlogs = `
  type PaginatedBlogs {
    blogs: [Blog!]
    total: Int!
  }
`;

export const SingleBlogQueryResponse = `
  type SingleBlogQueryResponse {
    success: Boolean!
    message: String!
    data: Blog
  }
`;



export const AuthorData = `
  type AuthorData {
    username: String!
    email: String!
    bio: String!
    followers: [String!]!
  }
`;

export const AuthorProfileQueryResponse = `
  type AuthorProfileQueryResponse {
    success: Boolean!
    message: String!
    author: AuthorData
    blogs: [Blog]
  }
`;
