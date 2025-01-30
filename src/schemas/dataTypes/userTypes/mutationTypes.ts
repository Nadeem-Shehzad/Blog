
export const UserInput = `
 input UserInput{
    username: String!
    email: String!
    password: String!
    image: String
    bio: String
    role: String
    token: String
}`;

export const UserUpdateInput = `
 input UserUpdateInput{
    username: String
    email: String
    password: String
    image: String
    bio: String
}`;

export const SignInInput = `
 input SignInInput{
    email: String!
    password: String!
}`;

export const AuthMutationResponse = `
 type AuthMutationResponse{
    success: Boolean!
    message: String!
    data: User
}`;