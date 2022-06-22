import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { readFile } from 'fs/promises';
import resolvers from './resolvers.js';
import 'dotenv/config';

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';
app.use(
  helmet({
    crossOriginEmbedderPolicy: !isDevelopment,
    contentSecurityPolicy: !isDevelopment,
  })
); // helmet prevents apollo studio from opening at http://localhost:4000/graphql
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

const typeDefs = await readFile('src/schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.get('/', (req, res) => {
  res.status(200).json({
    data: 'Express server ',
  });
});
app.listen({ port: process.env.PORT }, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
  console.log(`Apollo server listening on path ${process.env.PORT}`);
});
