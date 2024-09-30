"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "@/components/MotifMeme/Aggregate/Layout";
import Graph from "@/components/MotifMeme/Aggregate/Graphs";
import {
  AGGREGATE_DATA_QUERY,
  AGGREGATE_METADATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/MotifMeme/Aggregate/Queries";
import { associateBy, groupBy } from "queryz";
import {
  MARK_TYPES,
  MARK_TYPE_ORDER,
} from "@/components/MotifMeme/Aggregate/marks";

const EpigeneticProfilePage = () => {
  const { species, factor, accession } = useParams();

  // Convert params to strings (to handle array types)
  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  // Fetch the aggregate data
  const {
    data: aggregateData,
    loading: aggregateLoading,
    error: aggregateError,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: accessionStr },
    skip: !accessionStr, // Still skip if accession is not defined
  });

  // Fetch the metadata (biosample and others)
  const {
    data: metadataData,
    loading: metadataLoading,
    error: metadataError,
  } = useQuery(AGGREGATE_METADATA_QUERY, {
    variables: {
      assembly: speciesStr === "Human" ? "GRCh38" : "mm10",
      target: factorStr,
    },
  });

  // Fetch the histone metadata once aggregate data is available
  const {
    data: histoneData,
    loading: histoneLoading,
    error: histoneError,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: {
      accessions: aggregateData
        ? aggregateData.histone_aggregate_values.map(
            (x: any) => x.histone_dataset_accession
          )
        : [],
    },
    skip: !aggregateData, // Only fetch histone metadata if aggregate data is available
  });

  // Combine loading states
  const isLoading = aggregateLoading || metadataLoading || histoneLoading;
  const hasError = aggregateError || metadataError || histoneError;

  if (isLoading) return <CircularProgress />;
  if (hasError) {
    console.error(
      "GraphQL error:",
      aggregateError || metadataError || histoneError
    );
    return (
      <p>
        Error:{" "}
        {aggregateError?.message ||
          metadataError?.message ||
          histoneError?.message}
      </p>
    );
  }

  // Find the biosample associated with the current accession
  const biosample =
    metadataData?.peakDataset?.datasets?.find(
      (dataset: any) => dataset.accession === accessionStr
    )?.biosample || "Unknown Biosample";

  // Associate the values with accessions
  const values = associateBy(
    aggregateData.histone_aggregate_values,
    (x: any) => x.histone_dataset_accession,
    (x) => x
  );

  // Associate metadata for grouping
  const marks = associateBy(
    histoneData?.peakDataset?.datasets,
    (x: any) => x.target,
    (x) => x
  );

  // Group the datasets by MARK_TYPES using target field
  const typeGroups = groupBy(
    [...marks.keys()],
    (x) => MARK_TYPES[x],
    (x) => ({
      dataset: marks.get(x)!,
      proximal_values:
        values.get(marks.get(x)!.accession)?.proximal_values || [],
      distal_values: values.get(marks.get(x)!.accession)?.distal_values || [],
    })
  );

  // Render Accordions for each MARK_TYPE_ORDER
  return (
    <Layout species={speciesStr} factor={factorStr}>
      <Typography variant="h5" align="center" gutterBottom>
        {`Histone modification profiles around ${factorStr} peaks in ${biosample}`}
      </Typography>
      {MARK_TYPE_ORDER.filter((type) => typeGroups.get(type)).map((type) => (
        <Accordion key={type}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{type}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Adjusting the Flexbox to align graphs left with minimal gaps */}
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="flex-start" // Ensure all graphs are left-aligned
              alignItems="flex-start" // Align vertically at the top
              gap="7rem" // Reduced gap between graphs
            >
              {typeGroups.get(type)?.map((group: any, idx: number) => (
                <Box key={idx} style={{ width: "300px", marginBottom: "20px" }}>
                  {" "}
                  {/* Adjust width for consistency */}
                  <Graph
                    key={idx}
                    proximal_values={group.proximal_values}
                    distal_values={group.distal_values}
                    dataset={group.dataset}
                    xlabel="distance from summit (bp)"
                    ylabel="fold change signal"
                  />
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Layout>
  );
};

export default EpigeneticProfilePage;
