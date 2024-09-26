import React, { useState, useEffect } from "react";
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
  accession: string;
}

const EpigeneticProfile: React.FC<EpigeneticProfileProps> = ({
  species,
  factor,
  accession,
}) => {
  const [metadata, setMetadata] = useState<any[]>([]); // Store metadata for target groupings
  const [error, setError] = useState<string | null>(null);

  // Fetch the aggregate data (histone aggregate values)
  const {
    data: aggregateData,
    loading: aggregateLoading,
    error: aggregateError,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession },
    skip: !accession,
  });

  // Get the list of histone dataset accessions to pass to HISTONE_METADATA_QUERY
  const histoneDatasetAccessions =
    aggregateData?.histone_aggregate_values?.map(
      (item: { histone_dataset_accession: string }) =>
        item.histone_dataset_accession
    ) || [];

  // TODO Akshay to Fetch the histone metadata based on the dataset accessions
  const {
    data: histoneMetadataData,
    loading: histoneLoading,
    error: histoneError,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: { accessions: histoneDatasetAccessions }, // Pass the dataset accessions
    skip: histoneDatasetAccessions.length === 0, // Skip if there are no accessions
    onCompleted: (data) => {
      if (data && data.peakDataset && data.peakDataset.datasets.length > 0) {
        setMetadata(data.peakDataset.datasets); // Set metadata for histone target grouping
      } else {
        setError("No histone metadata found for these accessions");
      }
    },
  });

  // Handle loading and error states
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
            <Typography>No data found for this accession.</Typography>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default EpigeneticProfile;
