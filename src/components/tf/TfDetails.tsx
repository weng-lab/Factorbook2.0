"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { TF_INFO_QUERY } from "@/components/tf/Query";
import { TFInfoQueryResponse } from "@/components/CellType/types";

const TfDetails: React.FC<{ species: string }> = ({ species }) => {
  const assembly = species === "human" ? "GRCh38" : "mm10";

  const { data, loading, error } = useQuery<TFInfoQueryResponse>(
    TF_INFO_QUERY,
    {
      variables: {
        processed_assembly: assembly,
        replicated_peaks: true,
        include_investigatedas: [
          "cofactor",
          "chromatin remodeler",
          "RNA polymerase complex",
          "DNA replication",
          "DNA repair",
          "cohesin",
          "transcription factor",
        ],
        exclude_investigatedas: ["recombinant protein"],
      },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Typography variant="h4">
        Browsing {data?.peakDataset.partitionByTarget.length} factors with data
        available in {species}:
      </Typography>
      <Box>
        {data?.peakDataset.partitionByTarget.map((target) => (
          <Box key={target.target.name} mb={4}>
            <Typography variant="h6">{target.target.name}</Typography>
            <Typography>
              Total Biosamples: {target.counts.biosamples}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default TfDetails;
