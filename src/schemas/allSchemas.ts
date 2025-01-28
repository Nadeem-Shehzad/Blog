import { gql } from 'graphql-tag';

import { authSchema } from './common/auth';
import { authorBlogSchema } from './author/blog';
import { commonBlogSchema } from './common/blog';
import { adminBlogSchema } from './admin/blog';
import {readerBlogSchema} from './reader/blog';


export const typeDefs = gql`
 ${adminBlogSchema}
 ${authSchema}
 ${authorBlogSchema}
 ${commonBlogSchema}
 ${readerBlogSchema}
`;