import { gql } from 'graphql-tag';

import { authSchema } from './common/auth';
import { authorSchema } from './author/author';
import { commonSchema } from './common/blog';
import { adminSchema } from './admin/admin';
import { readerSchema } from './reader/reader';


export const typeDefs = gql`
 ${adminSchema}
 ${authSchema}
 ${authorSchema}
 ${commonSchema}
 ${readerSchema}
`;