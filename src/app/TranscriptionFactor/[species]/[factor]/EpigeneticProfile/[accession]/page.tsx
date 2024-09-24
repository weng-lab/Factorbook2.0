"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { CircularProgress, Box, Typography } from "@mui/material";
import { AGGREGATE_DATA_QUERY } from "@/components/MotifMeme/Aggregate/Queries";
import { Graph } from "@/components/MotifMeme/Aggregate/Graphs";

const EpigeneticProfilePage: React.FC = () => {
  const { accession } = useParams(); // Get dynamic route params from the URL

  // Use the AGGREGATE_DATA_QUERY to fetch the data for the selected accession
  const { data, loading, error } = useQuery<{
    histone_aggregate_values: any[];
  }>(AGGREGATE_DATA_QUERY, {
    variables: { accession },
    skip: !accession, // Only fetch when accession is available
  });

  if (loading) return <CircularProgress />;
  if (error) {
    console.error("GraphQL error:", error.message);
    return <p>Error: {error.message}</p>;
  }

  const histoneData = data?.histone_aggregate_values || [];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">
        Epigenetic Profile for Accession: {accession}
      </Typography>

      {/* Render graph for each histone dataset */}
      {histoneData.length > 0 ? (
        histoneData.map((histone, idx) => (
          <Box key={idx} sx={{ marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Histone Dataset Accession: {histone.histone_dataset_accession}
            </Typography>

            {/* Plot the graph using the Graph component */}
            <Graph
              proximal_values={histone.proximal_values}
              distal_values={histone.distal_values}
              dataset={{ target: histone.histone_dataset_accession }}
              xlabel="Position"
              ylabel="Value"
            />
          </Box>
        ))
      ) : (
        <Typography>No data found for this accession.</Typography>
      )}
    </Box>
  );
};

export default EpigeneticProfilePage;
