"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { ReactNode } from "react";
import { ApiContext, ApiContextType } from "@/apicontext";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "/api/graphql",
  });

  const link =
    typeof window === "undefined"
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
      : httpLink;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
}

const client = makeClient();

const apiContextValue: ApiContextType = {
  client,
  restEndpoints: {
    streamPeaks: "/api/graphql",
    streamMemeService: "/api/graphql",
  },
};

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <ApiContext.Provider value={apiContextValue}>
        {children}
      </ApiContext.Provider>
    </ApolloNextAppProvider>
  );
}
