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
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/query";
import { FactorQueryResponse } from "@/components/celltype/types";
import FunctionTab from "./function";
import MotifEnrichmentMEME from "@/components/motifmeme/motifenrichmentmeme";
import PeakSearch from "./peaksearch";
import Link from "next/link";
import DeepLearnedSelexMotifs from "./motifenrichmentselex";
import { ApiContext } from "@/apicontext";
import GeneExpressionPage from "./geneexpression";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./queries";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./types";
import EpigeneticProfile from "./epigeneticprofile";

const FactorDetailsPage = () => {
  const apiContext = useContext(ApiContext);
  const router = useRouter();
  const {
    species,
    factor,
    detail = "function",
  } = useParams<{
    species: string;
    factor: string;
    detail: string;
  }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define factorForUrl to be uppercase if species is human
  const factorForUrl =
    species.toLowerCase() === "human" ? factor.toUpperCase() : factor;

  // Update the URL to uppercase if species is human and factor is not already in uppercase
  useEffect(() => {
    if (species.toLowerCase() === "human" && factor !== factorForUrl) {
      router.replace(
        `/transcriptionfactor/${species}/${factorForUrl}/${detail}`
      );
    }
  }, [species, factor, factorForUrl, detail, router]);

  const { data, loading, error } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species === "human" ? "GRCh38" : "mm10",
        name: [factorForUrl],
      },
    }
  );

  const { data: selexData, loading: selexLoading } =
    useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
      DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
      {
        variables: {
          tf: factorForUrl,
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
      case "function":
        return (
          <FunctionTab
            factor={factorForUrl}
            assembly={species === "human" ? "GRCh38" : "mm10"}
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
      case "expression":
        return (
          <GeneExpressionPage
            gene_name={factorForUrl}
            assembly={species === "human" ? "GRCh38" : "mm10"}
          />
        );
      case "motifenrichmentmeme":
        return <MotifEnrichmentMEME factor={factorForUrl} species={species} />;
      case "motifenrichmentselex":
        return (
          <DeepLearnedSelexMotifs factor={factorForUrl} species={species} />
        );
      case "epigeneticprofile":
        return <EpigeneticProfile factor={factorForUrl} species={species} />;
      case "peaksearch":
        return <PeakSearch />;
      default:
        return (
          <FunctionTab
            factor={factorForUrl}
            assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"}
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
          <Link href={`/transcriptionfactor/${species}`}>
            Transcription Factor
          </Link>{" "}
          &gt; <Typography component="span">{factorForUrl}</Typography>
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
              value="function"
              component={Link}
              href={`/transcriptionfactor/${species}/${factorForUrl}/function`}
              sx={{
                color: detail === "function" ? "#8169BF" : "inherit",
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Expression (RNA-seq)"
              value="expression"
              component={Link}
              href={`/transcriptionfactor/${species}/${factorForUrl}/expression`}
              sx={{
                color: detail === "expression" ? "#8169BF" : "inherit",
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Motif Enrichment (MEME, ChIP-seq)"
              value="motifenrichmentmeme"
              component={Link}
              href={`/transcriptionfactor/${species}/${factorForUrl}/motifenrichmentmeme`}
              sx={{
                color: detail === "motifenrichmentmeme" ? "#8169BF" : "inherit",
                textTransform: "capitalize",
              }}
            />
            {hasSelexData && (
              <Tab
                label="Motif Enrichment (SELEX)"
                value="motifenrichmentselex"
                component={Link}
                href={`/transcriptionfactor/${species}/${factorForUrl}/motifenrichmentselex`}
                sx={{
                  color:
                    detail === "motifenrichmentselex" ? "#8169BF" : "inherit",
                  textTransform: "capitalize",
                }}
              />
            )}
            <Tab
              label={`Epigenetic Profile`}
              value="epigeneticprofile"
              component={Link}
              href={`/transcriptionfactor/${species}/${factorForUrl}/epigeneticprofile`}
              sx={{
                color: detail === "epigeneticprofile" ? "#8169BF" : "inherit",
                textTransform: "capitalize",
              }}
            />
            <Tab
              label={`Search ${factorForUrl} peaks by region`}
              value="search"
              component={Link}
              href={`/transcriptionfactor/${species}/${factorForUrl}/peaksearch`}
              sx={{
                color: detail === "search" ? "#8169BF" : "inherit",
                textTransform: "capitalize",
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
