import { gql } from 'graphql-tag';

import { userSchema } from './common/auth';
import { blogSchema } from './author/blog';


export const typeDefs = gql`
 ${userSchema}
 ${blogSchema}
`;