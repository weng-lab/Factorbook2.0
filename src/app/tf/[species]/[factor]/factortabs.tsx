"use client";

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { includeTargetTypes, excludeTargetTypes } from "@/consts";
import { useQuery } from "@apollo/client";
import { DATASETS_QUERY, EPIGENETIC_PROFILE_ACCESSIONS } from "./_ExperimentSelectionPanel/queries";

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

  /**
   * @todo these queries are now used in many different places. Create a hook for them probably? As well as the logic for filtering out valid experiments
   */
  /**
   * Fetch all experiments
   */
  const { data: experimentsData, loading: experimentsLoading, error: experimentsError } = useQuery(DATASETS_QUERY, {
    variables: {
      processed_assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  })

  /**
   * Accessions valid for epigenetic profiles page
   */
  const { data: histoneAccessions, loading: histoneAccessionsLoading, error: histoneAccessionsError } = useQuery(EPIGENETIC_PROFILE_ACCESSIONS, {
    variables: {
      assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
    }
  })

  const allExperiments = React.useMemo(() => {
    return [...experimentsData?.peakDataset.partitionByBiosample || []]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name))
  }, [experimentsData])

  const firstMotifExperiment = React.useMemo(() => {
    return allExperiments[0]?.datasets[0].accession //take first experiment 
  }, [allExperiments]);

  const firstHistoneExperiment = React.useMemo(() => {
    return allExperiments.map(biosample => {
      return ({
        ...biosample,
        //filter out experiments which are not valid
        datasets: biosample.datasets.filter(dataset =>
          histoneAccessions?.histone_aggregate_values?.some(x =>
            x.peaks_dataset_accession === dataset.accession)
        )
      })
    })
    .filter(biosample => biosample.datasets.length > 0) //filter out biosamples with no valid experiments
    [0]?.datasets[0].accession; //take first experiment
  }, [allExperiments, histoneAccessions]);

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
          href={`/tf/${species}/${factor}/motif/${isCurrentTab("motif") ? accession : firstMotifExperiment}`}
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
          href={`/tf/${species}/${factor}/histone/${isCurrentTab("histone") ? accession : firstHistoneExperiment}`}
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
