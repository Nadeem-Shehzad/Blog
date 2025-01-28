
export const UserType = `
 type User{
    id: ID!
    username:String!
    email:String!
    password:String!
    image: String
    bio: String
    role: String
    token: String
}`;


export const QueryResponse = `
 type QueryResponse{
    success: Boolean!
    message: String!
    data: [User]
}`;
