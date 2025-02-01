
export const BlogInput = `
  input BlogInput {
    title: String
    image: ImageInput!
    description: String
    tags: [String!]
    likes: [LikeInput!]
    comments: [CommentInput!]
    status: String
  }
`;

export const BlogUpdateInput = `
  input BlogUpdateInput {
    title: String
    image: ImageInput
    description: String
    likes: [LikeInput!]
    comments: [CommentInput!]
    status: String
  }
`;

export const LikeInput = `
  input LikeInput {
    userId: String!
  }
`;

export const CommentInput = `
  input CommentInput {
    userId: String!
  }
`;

export const ImageInput = `
  input ImageInput {
    public_id: String!
    url: String!
  }
`;

export const BlogMutationResponse = `
  type BlogMutationResponse {
    success: Boolean!
    message: String!
    data: Blog
  }
`;

export const BlogComment = `
  type BlogComment {
    userId: String!
    comment: String!
  }
`;

export const BlogCommentResponse = `
  type BlogCommentResponse {
    success: Boolean!
    message: String!
    data: BlogComment
  }
`;