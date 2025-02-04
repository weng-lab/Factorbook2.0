"use client";

import React, { useEffect } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { includeTargetTypes, excludeTargetTypes } from "@/consts";
import { useQuery } from "@apollo/client";
import { DATASETS_QUERY, EPIGENETIC_PROFILE_ACCESSIONS } from "./_utility/ExperimentSelectionPanel/queries";

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
  const [motifAccession, setMotifAccession] = React.useState<string | null>(null);
  const [histoneAccession, setHistoneAccession] = React.useState<string | null>(null);

  // usePathname().split('/') -> ["", "tf", "[species]", "[factor]", "[detail]", "[accession used in /motif & /deeplearnedselexmotif)]"]
  const detail = usePathname().split('/')[4]
  const accession = usePathname().split('/')[5]

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
  const { data: histoneAccessionsData, loading: histoneAccessionsLoading, error: histoneAccessionsError } = useQuery(EPIGENETIC_PROFILE_ACCESSIONS, {
    variables: {
      assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
    }
  })

  const allExperiments = React.useMemo(() => {
    return [...experimentsData?.peakDataset.partitionByBiosample || []]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name))
  }, [experimentsData])

  const validHistoneExperiments = React.useMemo(() => {
    return allExperiments.map(biosample => {
      return ({
        ...biosample,
        //filter out experiments which are not valid
        datasets: biosample.datasets.filter(dataset =>
          histoneAccessionsData?.histone_aggregate_values?.some(x =>
            x.peaks_dataset_accession === dataset.accession)
        )
      })
    })
      .filter(biosample => biosample.datasets.length > 0) //filter out empty biosamples
  }, [allExperiments, histoneAccessionsData])

  const isCurrentTab = (tab: string): boolean => {
    return tab === detail
  }

  // Keep motif tab link in sync with the last selected accession
  useEffect(() => {
    if (allExperiments.length > 0) {
      if (motifAccession === null) {
        const firstMotifExperiment = allExperiments[0].datasets[0].accession //take first experiment 
        setMotifAccession(firstMotifExperiment)
      } else if (isCurrentTab("motif") && (motifAccession !== accession)) {
        setMotifAccession(accession)
      }
    }
  }, [allExperiments, motifAccession, accession])

  // Keep epigenetic profiles link in sync with the last selected accession
  useEffect(() => {
    if (validHistoneExperiments.length > 0) {
      if (histoneAccession === null) {
        const firstHistoneExperiment = validHistoneExperiments[0].datasets[0].accession
        setHistoneAccession(firstHistoneExperiment)
      } else if (isCurrentTab("histone") && (histoneAccession !== accession)) {
        setHistoneAccession(accession)
      }
    }
  }, [validHistoneExperiments, histoneAccession, accession])

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={detail}
        variant="scrollable"
        scrollButtons={"auto"}
        allowScrollButtonsMobile
        sx={{
          '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.3 //grey out diabled scroll button instead of hide
          }
        }}
      >
        <Tab
          label="Function"
          value="function"
          component={Link}
          href={`/tf/${species}/${factor}/function`}
        />
        <Tab
          label="Expression (RNA-seq)"
          value="geneexpression"
          component={Link}
          href={`/tf/${species}/${factor}/geneexpression`}
        />
        <Tab
          label="Motif Enrichment (MEME, ChIP-seq)"
          value="motif"
          component={Link}
          href={`/tf/${species}/${factor}/motif/${motifAccession}`}
        />
        {/* Conditionally render SELEX tab */}
        {hasSelexData && (
          <Tab
            label="Motif Enrichment (SELEX)"
            value="deeplearnedselexmotif"
            component={Link}
            href={`/tf/${species}/${factor}/deeplearnedselexmotif`}
          />
        )}
        <Tab
          label="Epigenetic Profile"
          value="histone"
          component={Link}
          href={`/tf/${species}/${factor}/histone/${histoneAccession}`}
        />
        <Tab
          label={`Search ${factor} peaks by region`}
          value="regions"
          component={Link}
          href={`/tf/${species}/${factor}/regions`}
        />
      </Tabs>
    </Box>
  );
};

export default FactorTabs;
