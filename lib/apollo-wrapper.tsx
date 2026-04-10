"use client";

import { ApolloLink, HttpLink, NormalizedCacheObject } from "@apollo/client";
import {
  ApolloNextAppProvider,
  SSRMultipartLink,
  InMemoryCache,
  ApolloClient as ApolloClientNext,
} from "@apollo/experimental-nextjs-app-support";
import { ReactNode } from "react";
import { ApiContext, ApiContextType } from "@/apicontext";

function makeClient(): ApolloClientNext<NormalizedCacheObject> {
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

  return new ApolloClientNext<NormalizedCacheObject>({
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
