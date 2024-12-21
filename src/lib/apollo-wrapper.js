"use client";

import { HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from 'graphql-ws';
import { ApolloNextAppProvider, InMemoryCache, ApolloClient } from "@apollo/experimental-nextjs-app-support"
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
let apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
const userAgent = `SimensSMartHus/1.0.0`;

function makeClient(wsUrl) {
  const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
    url: wsUrl,
    connectionParams: {
        token: apiToken
    },
    retryAttempts: 1,
    retryWait: (retryCount) => Math.min(1000 * 2 ** retryCount, 30000) + Math.random() * 1000,
})) : null;
  const httpLink = new HttpLink({
    uri: "https://api.tibber.com/v1-beta/gql",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
      'User-Agent': userAgent,
    },
  });
  const splitLink = typeof window !== 'undefined' && wsLink ? split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  ) : httpLink;
  

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });
}

export function ApolloWrapper({ wsUrl, children }) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient(wsUrl)}>
      {children}
    </ApolloNextAppProvider>
  );
}