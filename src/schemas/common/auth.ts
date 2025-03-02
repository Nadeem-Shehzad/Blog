import { gql } from 'graphql-tag';

import { UserInput, UserUpdateInput, SignInInput, AuthMutationResponse } from '../dataTypes/userTypes/mutationTypes';

export const authSchema = gql`

# for mutation
${UserInput}
${UserUpdateInput}
${SignInInput}
${AuthMutationResponse}

type Mutation{
    signup(userData: UserInput): AuthMutationResponse
    signin(userData: SignInInput): AuthMutationResponse
    signout: AuthMutationResponse
    updateProfile(userData: UserUpdateInput): AuthMutationResponse
    resetPassword(newPassword: String!): AuthMutationResponse
    deleteAccount: AuthMutationResponse
    forgotPassword(email: String!): AuthMutationResponse
    resetPasswordByEmail(token:String!, newPassword:String!): AuthMutationResponse
}

`;