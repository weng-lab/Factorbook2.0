"use client";

import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { CircularProgress, Typography, Box } from "@mui/material";

import Layout from "@/components/MotifMeme/Aggregate/Layout";
import Graph from "@/components/MotifMeme/Aggregate/Graphs";
import { AGGREGATE_DATA_QUERY } from "@/components/MotifMeme/Aggregate/Queries";

const EpigeneticProfilePage = () => {
  const { species, factor, accession } = useParams();

  // Convert params to strings (to handle array types)
  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  // Fetch the aggregate data using the accession
  const { data, loading, error } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: accessionStr },
    skip: !accessionStr,
  });

  if (loading) return <CircularProgress />;
  if (error) {
    console.error("GraphQL error:", error.message);
    return <p>Error: {error.message}</p>;
  }

  const histoneData = data?.histone_aggregate_values || [];

  return (
    <Layout species={speciesStr} factor={factorStr}>
      {histoneData.length > 0 ? (
        histoneData.map(
          (
            histone: { proximal_values: any; distal_values: any },
            idx: React.Key | null | undefined
          ) => (
            <Graph
              key={idx}
              proximal_values={histone.proximal_values || []} // Safely access data
              distal_values={histone.distal_values || []} // Safely access data
              dataset={{ target: accessionStr || "" }}
              xlabel="distance from summit (bp)"
              ylabel="fold change signal"
              title={`Epigenetic Profile for Accession: ${accessionStr}`}
            />
          )
        )
      ) : (
        <Typography>No data found for this accession.</Typography>
      )}
    </Layout>
  );
};

export default EpigeneticProfilePage;
