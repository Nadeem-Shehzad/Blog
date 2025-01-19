import { gql } from 'graphql-tag';

export const userSchema = gql`
 
# for queries
type User{
    id: ID!
    username:String!
    email:String!
    password:String!
}

type Query{
    getUsers: [User]
}


# for mutation
input UserInput{
    username: String!
    email: String!
    password: String!
}

input SignInInput{
    email: String!
    password: String!
}

type MutationResponse{
    success: Boolean!
    message: String!
    data: User
}

type SignInResponse{
    success: Boolean!
    message: String!
    token: String
}


type Mutation{
    signup(userData: UserInput) : MutationResponse
    signin(userData: SignInInput) : SignInResponse
}

`;