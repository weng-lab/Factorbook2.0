import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress, Typography, Box } from "@mui/material";
import Layout from "@/components/MotifMeme/Aggregate/Layout";
import GraphSet from "@/components/MotifMeme/Aggregate/GraphSet";
import {
  AGGREGATE_DATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/MotifMeme/Aggregate/Queries";

interface EpigeneticProfileProps {
  species: string;
  factor: string;
}

const EpigeneticProfile: React.FC<EpigeneticProfileProps> = ({
  species,
  factor,
}) => {
  const [metadata, setMetadata] = useState<any[]>([]); // Store metadata for target groupings
  const [error, setError] = useState<string | null>(null);

  // Fetch the aggregate data (histone aggregate values)
  const {
    data: aggregateData,
    loading: aggregateLoading,
    error: aggregateError,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    // Remove accession if it's no longer part of the query
    skip: false,
  });

  const histoneDatasetAccessions =
    aggregateData?.histone_aggregate_values?.map(
      (item: { histone_dataset_accession: string }) =>
        item.histone_dataset_accession
    ) || [];

  const {
    data: histoneMetadataData,
    loading: histoneLoading,
    error: histoneError,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: { accessions: histoneDatasetAccessions }, // Use accessions from the histone dataset if necessary
    skip: histoneDatasetAccessions.length === 0,
    onCompleted: (data) => {
      if (data && data.peakDataset && data.peakDataset.datasets.length > 0) {
        setMetadata(data.peakDataset.datasets); // Set metadata for histone target grouping
      } else {
        setError("No histone metadata found for these accessions");
      }
    },
  });

  if (aggregateLoading || histoneLoading) return <CircularProgress />;
  if (aggregateError || histoneError || error) {
    return (
      <Typography>
        Error: {aggregateError?.message || histoneError?.message}
      </Typography>
    );
  }

  const histoneData = aggregateData?.histone_aggregate_values || [];

  return (
    <Layout species={species} factor={factor}>
      <Box display="flex">
        <Box flexGrow={1}>{/* Left side content */}</Box>
        <Box width="400px" padding="20px">
          {histoneData.length > 0 && metadata.length > 0 ? (
            <GraphSet histoneData={histoneData} metadata={metadata} />
          ) : (
            <Typography>No data found for this factor and species.</Typography>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default EpigeneticProfile;
