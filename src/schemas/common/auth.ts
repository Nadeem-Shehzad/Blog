import { gql } from 'graphql-tag';

import {UserInput, SignInInput,MutationResponse} from '../dataTypes/userTypes/mutationTypes';

export const authSchema = gql`

# for mutation
${UserInput}
${SignInInput}
${MutationResponse}

type Mutation{
    signup(userData: UserInput) : MutationResponse
    signin(userData: SignInInput) : MutationResponse
    signout: MutationResponse
    # updateProfile
    # forgotPassword
    # resetPassword
    # deleteAccount
}

`;