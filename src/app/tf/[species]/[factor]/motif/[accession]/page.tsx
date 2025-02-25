'use client'

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  Typography,
  Divider,
  Stack
} from "@mui/material";
import { MOTIF_QUERY } from "../../queries";
import { MotifResponse } from "@/components/motifmeme/types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";
import { DNAAlphabet } from "logojs-react";
import { Dataset } from "../../_utility/ExperimentSelectionPanel/ExperimentSelectionPanel";
import { DATASETS_QUERY } from "../../_utility/ExperimentSelectionPanel/queries";
import LoadingMotif from "../loading";
import MotifTile from "./motifTile";

// Add custom colors to Alphabet A and T
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

export default function MotifEnrichmentPage({
  params: { species, factor, accession },
}: {
  params: { species: string; factor: string, accession: string };
}) {

  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10"

  /**
   * This is needed since the data fetch needs the file ID and the URL only contains the experiment accession.
   * This is needed to extract the file ID from the experiment array
   * @todo maybe would be more appropriate to pass selected dataset down in context from the layout versus fetching and metching up
   * the file ID here
   */
  const { data, loading, error } = useQuery(DATASETS_QUERY, {
    variables: {
      processed_assembly: assembly,
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  const selectedDataset = useMemo(() => {
    if (!data || !data.peakDataset) return null;

    const partitionedBiosamples = [...data.peakDataset.partitionByBiosample];

    const foundDataset =
      accession &&
      partitionedBiosamples
        .flatMap((b) => b.datasets)
        .find((d) => d.accession === accession);

    if (foundDataset) {
      return foundDataset as Dataset;
    }

    // Extract the first experiment if no matching dataset is found
    return partitionedBiosamples
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name))[0]
      ?.datasets[0] || null; // Ensure we return null if no dataset is found
  }, [data, accession]);

  const selectedPeakID = useMemo(() => selectedDataset ? selectedDataset.replicated_peaks[0].accession : "", [selectedDataset]);
  const selectedBiosample = useMemo(() => { return selectedDataset?.biosample }, [selectedDataset]);
  

  const {
    data: motifData,
    loading: motifLoading,
    error: motifError,
  } = useQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: [selectedPeakID] },
    skip: !selectedPeakID,
  });

  // Sort the motifs so that those with either poor peak centrality or enrichment are at the bottom
  const sortedMotifs = [...(motifData?.meme_motifs || [])].sort((a, b) => b.flank_z_score + b.shuffled_z_score - a.flank_z_score - a.shuffled_z_score);

  // Map meme_motifs with target_motifs (tomtomMatch) by index
  const motifsWithMatches = sortedMotifs.map((motif, index) => ({
    ...motif,
    tomtomMatch:
      motifData?.target_motifs && motifData.target_motifs[index]
        ? motifData.target_motifs.filter(tm => tm.motifid === motif.id).slice().sort((a, b) => a.e_value - b.e_value)[0]
        : undefined,
  }));

  if (motifLoading || loading || !motifData ) return LoadingMotif();
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxHeight: '100%',
      }}
      divider={<Divider />}
    >
      <Typography variant="h5" m={2}>
        <span style={{ fontWeight: "bold" }}>
          De novo motif discovery in{" "}
          {selectedBiosample}{" "}
          ({accession}) by MEME
        </span>
      </Typography>
      {motifError && <p>Error: {motifError.message}</p>}
      {motifsWithMatches.length > 0 && (
        <Stack
          sx={{ overflowY: "scroll" }}
          divider={<Divider />}
        >
          {motifsWithMatches.map((motif) => {
            return <MotifTile
              key={motif.id}
              motif={motif}
              species={species}
              selectedExperimentID={accession}
              selectedPeakID={selectedPeakID}
            />
          })}
        </Stack>
      )}
    </Stack>
  )
}