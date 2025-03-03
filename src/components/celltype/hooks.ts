import { useContext } from "react";
import { ApiContext } from "@/apicontext";
import { useQuery } from "@apollo/client";
import { CellTypeDescription, TFInfoQueryResponse } from "./types";
import { CELLTYPE_DESCRIPTION_QUERY, TF_INFO_QUERY } from "./queries";
import { includeTargetTypes, excludeTargetTypes } from "@/consts";

export function useCellTypeDescription(assembly: string, celltype: string) {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("ApiContext is not provided");
  }
  const { client } = apiContext;
  return useQuery<{ celltype: CellTypeDescription[] }>(CELLTYPE_DESCRIPTION_QUERY, {
    client,
    variables: {
      assembly,
      name: [celltype],
    },
  });
}

export function useTFInfo(species: string) {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("ApiContext is not provided");
  }
  const { client } = apiContext;
  
  
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";
  return useQuery<TFInfoQueryResponse>(TF_INFO_QUERY, {
    client,
    variables: {
      processed_assembly: assembly,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });
}
