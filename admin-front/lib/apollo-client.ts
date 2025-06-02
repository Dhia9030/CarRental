"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:3001/graphql", // remplace avec l’URL de ton API NestJS
  cache: new InMemoryCache(),
});
