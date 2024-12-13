import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import createApolloClient from "./ApolloClient"; // Import the function to create the Apollo Client

const initializeApp = async () => {
    const client = await createApolloClient(); // Ensure the client is created asynchronously
    const root = createRoot(document.getElementById("root"));

    root.render(
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );
};

initializeApp(); // Call the function to initialize the app