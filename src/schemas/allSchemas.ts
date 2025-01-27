import { gql } from 'graphql-tag';

import { userSchema } from './user';
import { blogSchema } from './blog';


export const typeDefs = gql`
 ${userSchema}
 ${blogSchema}
`;