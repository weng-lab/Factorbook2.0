"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "@/components/motifmeme/aggregate/layout";
import Graph from "@/components/motifmeme/aggregate/graphs";
import {
  AGGREGATE_DATA_QUERY,
  AGGREGATE_METADATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/motifmeme/aggregate/queries";
import { associateBy, groupBy } from "queryz";
import {
  MARK_TYPES,
  MARK_TYPE_ORDER,
} from "@/components/motifmeme/aggregate/marks";
import { useParams } from "next/navigation";
import FactorTabs from "@/app/transcriptionfactor/[species]/[factor]/[detail]/factortabs";
import Link from "next/link";
import { useTheme, useMediaQuery } from "@mui/material";

const EpigeneticProfilePage = () => {
  const { species, factor, accession } = useParams();

  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: aggregateData, loading: aggregateLoading } = useQuery(
    AGGREGATE_DATA_QUERY,
    {
      variables: { accession: accessionStr },
      skip: !accessionStr,
    }
  );

  const { data: metadataData, loading: metadataLoading } = useQuery(
    AGGREGATE_METADATA_QUERY,
    {
      variables: {
        assembly: speciesStr.toLowerCase() === "human" ? "GRCh38" : "mm10",
        target: factorStr,
      },
    }
  );

  const { data: histoneData, loading: histoneLoading } = useQuery(
    HISTONE_METADATA_QUERY,
    {
      variables: {
        accessions: aggregateData
          ? aggregateData.histone_aggregate_values.map(
              (x: any) => x.histone_dataset_accession
            )
          : [],
      },
      skip: !aggregateData,
    }
  );

  const isLoading = aggregateLoading || metadataLoading || histoneLoading;
  if (isLoading) return <CircularProgress />;

  const biosample =
    metadataData?.peakDataset?.datasets?.find(
      (dataset: any) => dataset.accession === accessionStr
    )?.biosample || "Unknown Biosample";

  const values = associateBy(
    aggregateData.histone_aggregate_values,
    (x: any) => x.histone_dataset_accession,
    (x) => x
  );

  const marks = associateBy(
    histoneData?.peakDataset?.datasets,
    (x: any) => x.target,
    (x) => x
  );

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

  // Compute hasSelexData based on SELEX-related data availability
  const hasSelexData = aggregateData?.histone_aggregate_values.some(
    (value: any) => value.source === "SELEX"
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "20px 10px" : "40px 25.5px",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box style={{ flex: 1 }}>
        <Box mb={2}>
          <Link href="/" style={{ color: "black", textDecoration: "none" }}>
            Homepage
          </Link>{" "}
          &gt;{" "}
          <Link
            href={`/transcriptionfactor/${species}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            Transcription Factor
          </Link>{" "}
          &gt;{" "}
          <Typography component="span" style={{ color: "black" }}>
            {factorStr}
          </Typography>
        </Box>

        <FactorTabs
          species={speciesStr}
          factor={factorStr}
          detail="epigeneticprofile"
          hasSelexData={hasSelexData}
        />

        {/* Main content layout with sidebar */}
        <Layout species={speciesStr} factor={factorStr}>
          <Typography variant="h5" align="center" gutterBottom>
            {`Histone modification profiles around ${factorStr} peaks in ${biosample}`}
          </Typography>
          {MARK_TYPE_ORDER.filter((type) => typeGroups.get(type)).map(
            (type) => (
              <Accordion key={type}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{type}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap="7rem"
                  >
                    {typeGroups.get(type)?.map((group: any, idx: number) => (
                      <Box
                        key={idx}
                        style={{ width: "300px", marginBottom: "20px" }}
                      >
                        <Graph
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
            )
          )}
        </Layout>
      </Box>
    </Box>
  );
};

export default EpigeneticProfilePage;
