import { HttpLink } from "@apollo/client";
import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import Config from "../config.json";

/**
 * @returns an ApolloClient instance scoped for the current request
 */

export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: Config.API.CcreAPI,
      headers: {
        "api-key": process.env.FACTORBOOK_API_KEY!,
      },
    }),
  });
});