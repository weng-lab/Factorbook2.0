"use client";

import React from "react";
import { Tabs, Tab } from "@mui/material";
import Link from "next/link";

interface FactorTabsProps {
  species: string;
  factor: string;
  detail: string;
  hasSelexData: boolean;
}

const FactorTabs: React.FC<FactorTabsProps> = ({
  species,
  factor,
  detail,
  hasSelexData,
}) => {
  return (
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
          textTransform: "capitalize",
        }}
      />
      <Tab
        label="Expression (RNA-seq)"
        value="Expression"
        component={Link}
        href={`/TranscriptionFactor/${species}/${factor}/Expression`}
        sx={{
          color: detail === "Expression" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      <Tab
        label="Motif Enrichment (MEME, ChIP-seq)"
        value="MotifEnrichmentMEME"
        component={Link}
        href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME`}
        sx={{
          color: detail === "MotifEnrichmentMEME" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      {hasSelexData && (
        <Tab
          label="Motif Enrichment (SELEX)"
          value="MotifEnrichmentSELEX"
          component={Link}
          href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentSELEX`}
          sx={{
            color: detail === "MotifEnrichmentSELEX" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
      )}
      <Tab
        label={`Epigenetic Profile`}
        value="EpigeneticProfile"
        component={Link}
        href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
        sx={{
          color: detail === "EpigeneticProfile" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      <Tab
        label={`Search ${factor} peaks by region`}
        value="Search"
        component={Link}
        href={`/TranscriptionFactor/${species}/${factor}/Search`}
        sx={{
          color: detail === "Search" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
    </Tabs>
  );
};

export default FactorTabs;
