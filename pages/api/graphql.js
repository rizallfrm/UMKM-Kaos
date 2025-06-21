import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { db } from '../../lib/firebase';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ db }),
});

// Mulai server Apollo terlebih dahulu
const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};