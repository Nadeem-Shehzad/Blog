import { gql } from 'graphql-tag';

import { authSchema } from './common/auth';
import { authorBlogSchema } from './author/author';
import { commonBlogSchema } from './common/blog';
import { adminBlogSchema } from './admin/admin';
import { readerSchema } from './reader/reader';


export const typeDefs = gql`
 ${adminBlogSchema}
 ${authSchema}
 ${authorBlogSchema}
 ${commonBlogSchema}
 ${readerSchema}
`;