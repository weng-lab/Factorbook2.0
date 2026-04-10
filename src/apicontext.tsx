import { createContext } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export type ApiContextType = {
  client: ApolloClient<any>;
  restEndpoints: {
    streamPeaks: string;
    streamMemeService: string;
  };
};

// This is specified by App and not doing this is a hard error
export const ApiContext = createContext<ApiContextType | undefined>(undefined);

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

export const apiContextValue: ApiContextType = {
  client,
  restEndpoints: {
    streamPeaks: "your-stream-peaks-endpoint",
    streamMemeService: "your-stream-meme-service-endpoint",
  },
};
