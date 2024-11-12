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
  const factorForUrl =
    species.toLowerCase() === "human" ? factor.toUpperCase() : factor;
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
        value="function"
        component={Link}
        href={`/transcriptionfactor/${species}/${encodeURIComponent(
          factorForUrl
        )}/function`}
        sx={{
          color: detail === "function" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      <Tab
        label="Expression (RNA-seq)"
        value="expression"
        component={Link}
        href={`/transcriptionfactor/${species}/${encodeURIComponent(
          factorForUrl
        )}/expression`}
        sx={{
          color: detail === "expression" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      <Tab
        label="Motif Enrichment (MEME, ChIP-seq)"
        value="motifenrichmentmeme"
        component={Link}
        href={`/transcriptionfactor/${species}/${encodeURIComponent(
          factorForUrl
        )}/motifenrichmentmeme`}
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
          href={`/transcriptionfactor/${species}/${encodeURIComponent(
            factorForUrl
          )}/motifenrichmentselex`}
          sx={{
            color: detail === "motifenrichmentselex" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
      )}
      <Tab
        label={`Epigenetic Profile`}
        value="epigeneticprofile"
        component={Link}
        href={`/transcriptionfactor/${species}/${encodeURIComponent(
          factorForUrl
        )}/epigeneticprofile`}
        sx={{
          color: detail === "epigeneticprofile" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
      <Tab
        label={`Search ${factor} peaks by region`}
        value="search"
        component={Link}
        href={`/transcriptionfactor/${species}/${encodeURIComponent(
          factorForUrl
        )}/search`}
        sx={{
          color: detail === "search" ? "#8169BF" : "inherit",
          textTransform: "capitalize",
        }}
      />
    </Tabs>
  );
};

export default FactorTabs;
