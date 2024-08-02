import { gql } from "@apollo/client";

// Assuming 'data' is a field inside 'browser'
export const BROWSER_QUERY = gql`
  query BrowserQuery($region: String!) {
    browser(region: $region) {
      data
    }
  }
`;
