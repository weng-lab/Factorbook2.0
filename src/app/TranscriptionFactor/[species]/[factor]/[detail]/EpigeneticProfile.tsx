import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { CircularProgress, Typography } from "@mui/material";
import GraphSet from "@/components/MotifMeme/Aggregate/GraphSet";
import Layout from "@/components/MotifMeme/Aggregate/Layout";
import {
  AGGREGATE_DATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/MotifMeme/Aggregate/Queries";

const EpigeneticProfilePage = () => {
  const { species, factor, accession } = useParams();

  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  // Fetch aggregate data
  const {
    data: aggregateData,
    loading: loadingAggregate,
    error: errorAggregate,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: accessionStr },
    skip: !accessionStr,
  });

  // Fetch histone metadata
  const {
    data: metadataData,
    loading: loadingMetadata,
    error: errorMetadata,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: { accessions: accessionStr ? [accessionStr] : [] },
    skip: !accessionStr,
  });

  if (loadingAggregate || loadingMetadata) return <CircularProgress />;
  if (errorAggregate || errorMetadata) {
    console.error(
      "GraphQL error:",
      errorAggregate?.message || errorMetadata?.message
    );
    return (
      <Typography>
        Error: {errorAggregate?.message || errorMetadata?.message}
      </Typography>
    );
  }

  const histoneData = aggregateData?.histone_aggregate_values || [];
  const metadata = metadataData?.peakDataset?.datasets || [];

  return (
    <Layout species={speciesStr} factor={factorStr}>
      {histoneData.length > 0 && metadata.length > 0 ? (
        <GraphSet histoneData={histoneData} metadata={metadata} />
      ) : (
        <Typography>No data found for this accession.</Typography>
      )}
    </Layout>
  );
};

export default EpigeneticProfilePage;
