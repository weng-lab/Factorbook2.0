"use client";

import { ApolloLink, HttpLink, NormalizedCacheObject } from "@apollo/client";
import {
  ApolloNextAppProvider,
  SSRMultipartLink,
  InMemoryCache,
  ApolloClient as ApolloClientNext,
} from "@apollo/experimental-nextjs-app-support";
import Config from "../src/config.json";

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

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
