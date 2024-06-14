import { createContext } from "react";
import { ApolloClient } from "@apollo/client/core";

export type ApiContext = {
  client: ApolloClient<any>;
  restEndpoints: {
    streamPeaks: string;
    streamMemeService: string;
  };
};

// This is specified by App and not doing this is a hard error
export const ApiContext = createContext<ApiContext>(undefined as any);
