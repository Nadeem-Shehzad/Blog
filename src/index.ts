import express, { Application, Request } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { Server as SocketIOserver } from 'socket.io';
import { createServer } from 'http';

import { connectDB } from './config/dbConnection';
import { typeDefs } from './schemas/allSchemas';
import { resolvers } from './resolvers/allResolvers';
import { MyContext } from './utils/types';
import { tokenValidation } from './middlewares/tokenValidation';
import router from './routes/route';
import setupSocket from './socket/socket';
import { setSocketInstance } from './utils/socketInstance';

import { closeRedisClient } from './redis/redis';


dotenv.config();
connectDB();

const app: Application = express();

// socket.io setup
const server = createServer(app);
const io = new SocketIOserver(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
})

// Store socket instance globally
setSocketInstance(io);
setupSocket(io);


// to get temp files like images
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 50 * 2024 * 1024 }
}));

app.use(cors());
app.use(express.json());

// auth route
app.use('/api',router);

// Apollo Server instance
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return { message: error.message }; 
  },
});

const startApolloServer = async (): Promise<void> => {
  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }: { req: Request }): Promise<MyContext> => {
        const contextData = await tokenValidation({ req });
        return {
          userId: contextData.userId,
          email: contextData.email,
          role: contextData.role,
        };
      },
    }),
  );

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint at http://localhost:${PORT}/graphql`);
    console.log(`🚀 WebSocket running at ws://localhost:${PORT}`);
  });
};

process.on('SIGINT', async () => {
  await closeRedisClient(); 
  process.exit(0);
});

startApolloServer();