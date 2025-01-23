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
  // usePathname().split('/') -> ["", "tf", "[species]", "[factor]", "[detail]", "[accession used in /motif & /deeplearnedselexmotif)]"]
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
          href={`/tf/${species}/${factor}/function`}
          sx={{
            color: detail === "function" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label="Expression (RNA-seq)"
          value="geneexpression"
          component={Link}
          href={`/tf/${species}/${factor}/geneexpression`}
          sx={{
            color: detail === "geneexpression" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label="Motif Enrichment (MEME, ChIP-seq)"
          value="motif"
          component={Link}
          href={`/tf/${species}/${factor}/motif`}
          sx={{
            color: detail === "motif" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        {/* Conditionally render SELEX tab */}
        {hasSelexData && (
          <Tab
            label="Motif Enrichment (SELEX)"
            value="deeplearnedselexmotif"
            component={Link}
            href={`/tf/${species}/${factor}/deeplearnedselexmotif`}
            sx={{
              color: detail === "deeplearnedselexmotif" ? "#8169BF" : "inherit",
              textTransform: "capitalize",
            }}
          />
        )}
        <Tab
          label="Epigenetic Profile"
          value="histone"
          component={Link}
          href={`/tf/${species}/${factor}/histone/${isCurrentTab("histone") ? accession : ""}`}
          sx={{
            color: detail === "histone" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
        <Tab
          label={`Search ${factor} peaks by region`}
          value="regions"
          component={Link}
          href={`/tf/${species}/${factor}/regions`}
          sx={{
            color: detail === "regions" ? "#8169BF" : "inherit",
            textTransform: "capitalize",
          }}
        />
      </Tabs>
    </Box>
  );
};

export default FactorTabs;
