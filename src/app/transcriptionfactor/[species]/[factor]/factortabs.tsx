"use client";

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FactorTabsProps {
  species: string;
  factor: string;
  hasSelexData: boolean;
}

const FactorTabs: React.FC<FactorTabsProps> = ({
  species,
  factor,
  hasSelexData,
}) => {
  // usePathname().split('/') -> ["", "transcriptionfactor", "[species]", "[factor]", "[detail]", "[accession"]
  const detail = usePathname().split('/')[4]
  const accession = usePathname().split('/')[5]

  const isCurrentTab = (tab: string): boolean => {
    return tab === detail
  }

  return (
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
          href={`/transcriptionfactor/${species}/${factor}/function`}
          sx={{
            color: detail === "function" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label="Expression (RNA-seq)"
          value="expression"
          component={Link}
          href={`/transcriptionfactor/${species}/${factor}/expression`}
          sx={{
            color: detail === "expression" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label="Motif Enrichment (MEME, ChIP-seq)"
          value="motifenrichmentmeme"
          component={Link}
          href={`/transcriptionfactor/${species}/${factor}/motifenrichmentmeme`}
          sx={{
            color: detail === "motifenrichmentmeme" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        {/* Conditionally render SELEX tab */}
        {hasSelexData && (
          <Tab
            label="Motif Enrichment (SELEX)"
            value="motifenrichmentselex"
            component={Link}
            href={`/transcriptionfactor/${species}/${factor}/motifenrichmentselex`}
            sx={{
              color: detail === "motifenrichmentselex" ? "#8169BF" : "inherit",
              textTransform: "capitalize",
            }}
          />
        )}
        <Tab
          label="Epigenetic Profile"
          value="epigeneticprofile"
          component={Link}
          href={`/transcriptionfactor/${species}/${factor}/epigeneticprofile/${isCurrentTab("epigeneticprofile") ? accession : ""}`}
          sx={{
            color: detail === "epigeneticprofile" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label={`Search ${factor} peaks by region`}
          value="peaksearch"
          component={Link}
          href={`/transcriptionfactor/${species}/${factor}/peaksearch`}
          sx={{
            color: detail === "search" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
      </Tabs>
    </Box>
  );
};

export default FactorTabs;
