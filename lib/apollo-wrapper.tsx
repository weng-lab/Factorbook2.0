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
import Config from "../config.json";

function makeClient(): ApolloClientNext<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: Config.API.CcreAPI,
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
    streamPeaks: Config.API.CcreAPI,
    streamMemeService: Config.API.CcreAPI,
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
