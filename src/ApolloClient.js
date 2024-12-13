import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { RetryLink } from '@apollo/client/link/retry';

let apiToken = process.env.REACT_APP_API_TOKEN;
let connectionAttempts = 0;
const maxAttempts = 2;
const delayBetweenAttempts = 3000;
const userAgent = `SimensSMartHus/1.0.0`;

const refreshToken = async () => {
    // Logic to refresh the token
    // This is a placeholder and should be replaced with actual token refresh logic
    const response = await fetch('https://api.example.com/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Include necessary data to refresh the token
        }),
    });
    const result = await response.json();
    apiToken = result.newToken;
};

const connectWithRateLimit = async (createClientFn) => {
    if (connectionAttempts >= maxAttempts) {
        throw new Error("Max connection attempts reached");
    }
    connectionAttempts++;
    try {
        return await createClientFn();
    } catch (error) {
        if (connectionAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
            return connectWithRateLimit(createClientFn);
        }
        throw error;
    }
};

const fetchWsUrl = async () => {
    try {
        const response = await fetch('https://api.tibber.com/v1-beta/gql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
                'User-Agent': userAgent,
            },
            body: JSON.stringify({
                query: `
                    query GetWssEndpoint {
                        viewer {
                            websocketSubscriptionUrl
                        }
                    }
                `,
            }),
        });
        const result = await response.json();
        return result.data.viewer.websocketSubscriptionUrl;
    } catch (error) {
        if (error.message.includes('4403')) {
            await refreshToken();
            return fetchWsUrl(); // Retry fetching the URL with the new token
        }
        throw error;
    }
};

const createWsLink = async () => {
    const wsUrl = await fetchWsUrl();
    return connectWithRateLimit(() => new GraphQLWsLink(createClient({
        url: wsUrl,
        connectionParams: {
            token: apiToken
        },
        retryAttempts: 1,
        retryWait: (retryCount) => Math.min(1000 * 2 ** retryCount, 30000) + Math.random() * 1000,
    })));
};

// HTTP-link for queries and mutations
const httpLink = new HttpLink({
    uri: "https://api.tibber.com/v1-beta/gql",
});

// Auth-link for HTTP requests
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${apiToken}`,
            'User-Agent': userAgent,
        },
    };
});

// Retry link with jitter and exponential backoff
const retryLink = new RetryLink({
    delay: {
        initial: 300,
        max: Infinity,
        jitter: true,
    },
    attempts: {
        max: 5,
        retryIf: (error, _operation) => !!error,
    },
});

const createCombinedLink = async () => {
    const wsLink = await createWsLink();
    return split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return definition.kind === "OperationDefinition" && definition.operation === "subscription";
        },
        wsLink,
        retryLink.concat(authLink.concat(httpLink))
    );
};

const createApolloClient = async () => {
    const combinedLink = await createCombinedLink();
    return new ApolloClient({
        link: combinedLink,
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;