import { gql } from 'graphql-tag';

import { userSchema } from './user'


export const typeDefs = gql`
 ${userSchema}
`;