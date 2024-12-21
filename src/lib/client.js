import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, registerApolloClient } from "@apollo/experimental-nextjs-app-support";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://api.tibber.com/v1-beta/gql",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'User-Agent': 'SimensSmartHus/1.0.0',
      }
    }),
  });
});