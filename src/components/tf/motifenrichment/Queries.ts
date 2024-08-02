import { gql } from "@apollo/client";

// Assuming 'id', 'name', and 'selex_round' are the correct fields for deep_learned_motifs
export const DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY = gql`
  query DeepLearnedSelexMotifsMetadata($tf: String!, $species: String!, $selex_round: [Int!]!) {
    deep_learned_motifs(tf: $tf, species: $species, selex_round: $selex_round) {
      id
      name
      selex_round
    }
  }
`;

// Assuming 'description' is a field inside 'transcription_factors'
export const FACTOR_DESCRIPTION_QUERY = gql`
  query FactorDescription($assembly: String!, $name: [String!]!) {
    transcription_factors(assembly: $assembly, name: $name) {
      description
    }
  }
`;
