import { gql } from 'graphql-tag';

import { UserType, QueryResponse } from '../dataTypes/userTypes/queryTypes';

export const adminBlogSchema = gql`

# types
${UserType}
${QueryResponse}

type Query{
    getReaders: QueryResponse
}

`;