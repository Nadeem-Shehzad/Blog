
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

export const SignInInput = `
 input SignInInput{
    email: String!
    password: String!
}`;

export const MutationResponse = `
 type MutationResponse{
    success: Boolean!
    message: String!
    data: User
}`;