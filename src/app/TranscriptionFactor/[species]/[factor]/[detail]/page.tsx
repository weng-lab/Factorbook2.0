"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import FunctionTab from "./Function";
import MotifEnrichmentMEME from "@/components/MotifMeme/MotifEnrichmentMEME";
import Search from "./Search";
import Link from "next/link";
import DeepLearnedSelexMotifs from "./MotifEnrichmentSELEX";
import { ApiContext } from "@/ApiContext";
import GeneExpressionPage from "./GeneExpression";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./Queries";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./types";
import EpigeneticProfile from "./EpigeneticProfile";

const FactorDetailsPage = () => {
  const apiContext = useContext(ApiContext);

  const router = useRouter();
  const {
    species,
    factor,
    detail = "Function",
  } = useParams<{
    species: string;
    factor: string;
    detail: string;
  }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, loading, error } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species === "Human" ? "GRCh38" : "mm10",
        name: [factor],
      },
    }
  );

  const { data: selexData, loading: selexLoading } =
    useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
      DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
      {
        variables: {
          tf: factor,
          species: species.toLowerCase(),
          selex_round: [1, 2, 3, 4, 5, 6, 7],
        },
        context: apiContext,
      }
    );

  const [hasSelexData, setHasSelexData] = useState(false);

  useEffect(() => {
    if (selexData && selexData.deep_learned_motifs.length > 0) {
      setHasSelexData(true);
    } else {
      setHasSelexData(false);
    }
  }, [selexData]);

  if (loading || selexLoading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const renderTabContent = () => {
    switch (detail) {
      case "Function":
        return (
          <FunctionTab
            factor={factor}
            assembly={species === "Human" ? "GRCh38" : "mm10"}
            datasets={{
              peakDataset: {
                datasets: [],
                partitionByTarget: [],
                counts: {
                  total: 0,
                },
                partitionByBiosample: [],
              },
            }}
            datasetsLoading={false}
          />
        );
      case "Expression":
        return (
          <GeneExpressionPage
            gene_name={factor}
            assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"}
          />
        );
      case "MotifEnrichmentMEME":
        return <MotifEnrichmentMEME factor={factor} species={species} />;
      case "MotifEnrichmentSELEX":
        return <DeepLearnedSelexMotifs factor={factor} species={species} />;
      case "EpigeneticProfile":
        return <EpigeneticProfile />;
      case "Search":
        return <Search />;
      default:
        return (
          <FunctionTab
            factor={factor}
            assembly={species === "Human" ? "GRCh38" : "mm10"}
            datasets={{
              peakDataset: {
                datasets: [],
                partitionByTarget: [],
                counts: {
                  total: 0,
                },
                partitionByBiosample: [],
              },
            }}
            datasetsLoading={false}
          />
        );
    }
  };

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
          <Link href="/">Homepage</Link> &gt;{" "}
          <Link href={`/TranscriptionFactor/${species}`}>
            Transcription Factor
          </Link>{" "}
          &gt; <Typography component="span">{factor}</Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Tabs
            value={detail}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            sx={{ flex: 1 }}
          >
            <Tab
              label="Function"
              value="Function"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Function`}
              sx={{
                color: detail === "Function" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Expression (RNA-seq)"
              value="Expression"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Expression`}
              sx={{
                color: detail === "Expression" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Motif Enrichment (MEME, ChIP-seq)"
              value="MotifEnrichmentMEME"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME`}
              sx={{
                color: detail === "MotifEnrichmentMEME" ? "#8169BF" : "inherit",
              }}
            />
            {hasSelexData && (
              <Tab
                label="Motif Enrichment (SELEX)"
                value="MotifEnrichmentSELEX"
                component={Link}
                href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentSELEX`}
                sx={{
                  color:
                    detail === "MotifEnrichmentSELEX" ? "#8169BF" : "inherit",
                }}
              />
            )}
            <Tab
              label={`Epigenetic Profile`}
              value="EpigeneticProfile"
              href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
            />
            <Tab
              label={`Search ${factor} peaks by region`}
              value="Search"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Search`}
              sx={{
                color: detail === "Search" ? "#8169BF" : "inherit",
              }}
            />
          </Tabs>
        </Box>

        <Box mt={2}>{renderTabContent()}</Box>
      </Box>
    </Box>
  );
};

export default FactorDetailsPage;
