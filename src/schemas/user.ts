import { gql } from 'graphql-tag';

export const userSchema = gql`
 
# for queries
type User{
    id: ID!
    username:String!
    email:String!
    password:String!
    image: String
    bio: String
    role: String
    token: String
}

type QueryResponse{
    success: Boolean!
    message: String!
    data: [User]
}

type Query{
    getReaders: QueryResponse
}


# for mutation
input UserInput{
    username: String!
    email: String!
    password: String!
    image: String
    bio: String
    role: String
    token: String
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


type Mutation{
    #signup(userData: UserInput) : MutationResponse
    signin(userData: SignInInput) : MutationResponse
    signout: MutationResponse
}

`;