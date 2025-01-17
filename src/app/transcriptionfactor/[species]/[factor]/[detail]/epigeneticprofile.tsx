"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress, Typography, Box } from "@mui/material";
import EpigeneticProfileLayout from "@/components/motifmeme/aggregate/EpigeneticProfileLayout";
import GraphSet from "@/components/motifmeme/aggregate/graphset";
import {
  AGGREGATE_DATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/motifmeme/aggregate/queries";

interface EpigeneticProfileProps {
  species: string;
  factor: string;
  accession?: string;
}

const EpigeneticProfile: React.FC<EpigeneticProfileProps> = ({
  species,
  factor,
  accession,
}) => {
  const [metadata, setMetadata] = useState<any[]>([]); // To store metadata for target groupings
  const [error, setError] = useState<string | null>(null);

  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  // Fetch aggregate data for the selected accession
  const {
    data: aggregateData,
    loading: aggregateLoading,
    error: aggregateError,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: accessionStr },
    skip: !accessionStr,
  });

  // Fetch histone metadata based on the selected accession
  const {
    data: histoneMetadataData,
    loading: histoneLoading,
    error: histoneError,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: { accessions: [accessionStr] }, // Ensure it's passed as an array
    skip: !accessionStr,
    onCompleted: (data) => {
      if (data && data.peakDataset && data.peakDataset.datasets.length > 0) {
        setMetadata(data.peakDataset.datasets); // Set metadata for histone target grouping
      } else {
        setError("No histone metadata found for this accession");
      }
    },
  });

  if (aggregateLoading || histoneLoading) return <CircularProgress />;
  if (aggregateError || histoneError || error) {
    console.error(
      "GraphQL query error:",
      aggregateError?.message || histoneError?.message
    );
    return <p>Error: {aggregateError?.message || histoneError?.message}</p>;
  }

  const histoneData = aggregateData?.histone_aggregate_values || [];

  //This is currently needed since the tabs try to naviagate here, and then the layout (?) redirects to a specific experiment
  //Which then causes the other page.tsx to be rendered
  return (
    <EpigeneticProfileLayout species={speciesStr} factor={factorStr}>
      {histoneData.length > 0 && metadata.length > 0 ? (
        <>
        <GraphSet histoneData={histoneData} metadata={metadata} />
        </>
      ) : (
        <Typography>Select an accession to view its data.</Typography>
      )}
      <p>Hello World</p>
    </EpigeneticProfileLayout>
  );
};

export default EpigeneticProfile;
