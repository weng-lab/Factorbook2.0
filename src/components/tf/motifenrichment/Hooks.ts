// src/components/tf/motifenrichment/Hooks.ts

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./Queries";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./Types";

const useDeepLearnedMotifs = (tf: string, species: string) => {
  const { data, loading, error } = useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
    DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
    {
      variables: { tf, species, selex_round: [1, 2, 3, 4, 5, 6, 7] },
    }
  );

  const [motifs, setMotifs] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.deep_learned_motifs) {
      setMotifs(data.deep_learned_motifs);
    }
  }, [data]);

  return { motifs, loading, error };
};

export default useDeepLearnedMotifs;
