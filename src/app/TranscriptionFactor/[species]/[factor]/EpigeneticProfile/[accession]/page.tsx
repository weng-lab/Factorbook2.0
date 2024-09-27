"use client";

import React, { useMemo } from "react";
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
  HISTONE_METADATA_QUERY,
} from "@/components/MotifMeme/Aggregate/Queries";
import { associateBy, groupBy } from "queryz";
import {
  MARK_TYPES,
  MARK_TYPE_ORDER,
  MARK_GROUPS,
} from "@/components/MotifMeme/Aggregate/marks";

const EpigeneticProfilePage = () => {
  const { species, factor, accession } = useParams();

  // Convert params to strings (to handle array types)
  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  // Logging for debugging
  console.log("species:", speciesStr);
  console.log("factor:", factorStr);
  console.log("accession:", accessionStr);

  const { data, loading, error } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: accessionStr },
    skip: !accessionStr,
    onError: (error) => {
      console.error("AGGREGATE_DATA_QUERY error:", error);
    },
  });

  const {
    data: metadata,
    loading: histoneMetadataLoading,
    error: histoneMetadataError,
  } = useQuery(HISTONE_METADATA_QUERY, {
    variables: {
      accessions: data
        ? data.histone_aggregate_values.map(
            (x: any) => x.histone_dataset_accession
          )
        : [],
      loading,
    },
    skip: loading,
    onError: (error) => {
      console.error("HISTONE_METADATA_QUERY error:", error);
    },
  });

  if (
    loading ||
    histoneMetadataLoading ||
    !metadata ||
    (metadata && !metadata.peakDataset) ||
    !data
  )
    return <CircularProgress />;
  if (error || histoneMetadataError) {
    console.error("GraphQL error:", error?.message);
    return <p>Error: {error?.message}</p>;
  }

  // Associate the values with accessions
  const values = associateBy(
    data.histone_aggregate_values,
    (x: any) => x.histone_dataset_accession,
    (x) => x
  );

  // Associate metadata for grouping
  const marks = associateBy(
    metadata.peakDataset.datasets,
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
      {MARK_TYPE_ORDER.filter((type) => typeGroups.get(type)).map((type) => (
        <Accordion key={type}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{type}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {typeGroups.get(type)?.map((group: any, idx: number) => (
              <Graph
                key={idx}
                proximal_values={group.proximal_values} // Safely access data
                distal_values={group.distal_values} // Safely access data
                dataset={group.dataset}
                xlabel="distance from summit (bp)"
                ylabel="fold change signal"
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Layout>
  );
};

export default EpigeneticProfilePage;
