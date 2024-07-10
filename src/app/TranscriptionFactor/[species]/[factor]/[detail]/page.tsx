"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import FunctionTab from "./Function";
import Expression from "./Expression";
import MotifEnrichmentMEME from "./MotifEnrichmentMEME";
import MotifEnrichmentSELEX from "./MotifEnrichmentSELEX";
import EpigeneticProfile from "./EpigeneticProfile";
import Search from "./Search";
import Link from "next/link";

const FactorDetailsPage = () => {
  const { species, factor, detail = "Function" } = useParams();
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

  if (loading) return <CircularProgress />;
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
                counts: { total: 0 },
                partitionByBiosample: [],
              },
            }}
            datasetsLoading={false}
          />
        );
      case "Expression":
        return <Expression />;
      case "MotifEnrichmentMEME":
        return <MotifEnrichmentMEME />;
      case "MotifEnrichmentSELEX":
        return <MotifEnrichmentSELEX />;
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
                counts: { total: 0 },
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
          <ArrowBackIosIcon
            onClick={() => {
              const tabsScroller = document.querySelector(".MuiTabs-scroller");
              if (tabsScroller) {
                tabsScroller.scrollBy({ left: -200, behavior: "smooth" });
              }
            }}
          />
          <Tabs
            value={detail}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flex: 1 }}
          >
            <Tab
              label="Function"
              value="Function"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Function`}
              sx={{ color: detail === "Function" ? "#8169BF" : "inherit" }}
            />
            <Tab
              label="Expression (RNA-seq)"
              value="Expression"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Expression`}
              sx={{ color: detail === "Expression" ? "#8169BF" : "inherit" }}
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
            <Tab
              label="Epigenetic Profile"
              value="EpigeneticProfile"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
              sx={{
                color: detail === "EpigeneticProfile" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label={`Search ${factor} peaks by region`}
              value="Search"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Search`}
              sx={{ color: detail === "Search" ? "#8169BF" : "inherit" }}
            />
          </Tabs>
          <ArrowForwardIosIcon
            onClick={() => {
              const tabsScroller = document.querySelector(".MuiTabs-scroller");
              if (tabsScroller) {
                tabsScroller.scrollBy({ left: 200, behavior: "smooth" });
              }
            }}
          />
        </Box>

        <Box mt={2}>{renderTabContent()}</Box>
      </Box>
    </Box>
  );
};

export default FactorDetailsPage;
