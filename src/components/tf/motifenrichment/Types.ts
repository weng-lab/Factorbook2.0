export interface DeepLearnedSELEXMotifsMetadataQueryResponse {
    deep_learned_motifs: {
      id: string;
      name: string;
      selex_round: number;
    }[];
  }
  
  export interface FactorQueryResponse {
    transcription_factors: {
      description: string;
    };
  }
  