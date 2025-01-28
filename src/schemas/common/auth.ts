import { gql } from 'graphql-tag';

import {UserType, QueryResponse} from '../userTypes/queryTypes';
import {UserInput, SignInInput,MutationResponse} from '../userTypes/mutationTypes';

export const userSchema = gql`
 
# for queries
${UserType}
${QueryResponse}

type Query{
    getReaders: QueryResponse
}


# for mutation
${UserInput}
${SignInInput}
${MutationResponse}

type Mutation{
    signup(userData: UserInput) : MutationResponse
    signin(userData: SignInInput) : MutationResponse
    signout: MutationResponse
}

`;