import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import { connectDB } from './config/dbConnection';
import { typeDefs } from './schemas/allSchemas';
import { resolvers } from './resolvers/allResolvers'
import { IncomingMessage } from 'http';
import { MyContext } from './utils/types';
import { tokenValidation } from './middlewares/tokenValidation';

dotenv.config();
connectDB();

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

const startServer = async (): Promise<void> => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }: { req: IncomingMessage }): Promise<MyContext> => {
      const contextData = await tokenValidation({ req });
      return {
        userId: contextData.userId,
        email: contextData.email,
        role: contextData.role
      }
    },
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();