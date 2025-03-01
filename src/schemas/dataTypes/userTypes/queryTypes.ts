
export const UserType = `
 type User{
    id: ID!
    username:String!
    email:String!
    password:String!
    image: String
    bio: String
    isBlocked: Boolean
    role: String
    token: String
}`;


export const QueryResponse = `
 type QueryResponse{
    success: Boolean!
    message: String!
    data: [User]
}`;

export const PaginatedUsers = `
 type PaginatedUsers{
   users: [User!]
   total: Int!
 }
`;


export const SingleUserQueryResponse = `
 type SingleUserQueryResponse{
    success: Boolean!
    message: String!
    data: User
}`;


export const FollowUserType = `
 type FollowUser{
    id: ID!
    username:String!
    email:String!
    role: String!
    following: [User]  
    followers: [User]  
}`;


export const FollowUserQueryResponse = `
 type FollowUserQueryResponse{
    success: Boolean!
    message: String!
    data: [FollowUser]
}`;