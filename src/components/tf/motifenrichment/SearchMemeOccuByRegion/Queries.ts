import { gql } from "@apollo/client";

// Assuming 'id', 'region', and 'count' are the correct fields for meme_occurrences
export const SEARCH_MEME_OCCU_BY_REGION_QUERY = gql`
  query SearchMemeOccuByRegion {
    meme_occurrences {
      id
      region
      count
    }
  }
`;
