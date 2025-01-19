import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import { connectDB } from './config/dbConnection';
import { typeDefs } from './schemas/allSchemas';
import { resolvers } from './resolvers/allResolvers'

dotenv.config();
connectDB();

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    // Customize the error response
    return {
      message: err.message, // Only include the message
      success: false, // Optional: Add custom fields like success flag
    };
  },
});

const startServer = async (): Promise<void> => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();