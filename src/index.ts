import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


const typeDefs = `
  type Query {
    hello: String
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, Graphql!" 
  }
};


const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async() : Promise<void> => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }, 
      });
      
      console.log(`🚀 Server ready at: ${url}`);
}

startServer();