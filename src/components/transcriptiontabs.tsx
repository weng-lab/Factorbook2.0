"use client";

import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

const TfDetails = dynamic(() => import("@/components/tf/tfdetails"));
const CtPage = dynamic(() => import("@/components/celltype/ctpage"));

const TranscriptionTabs: React.FC<{ species: string, initialTab: 0 | 1 }> = ({ species, initialTab }) => {
  const [tabValue, setTabValue] = React.useState<number>(initialTab);

  const router = useRouter()
  const pathname = usePathname()

  //clear search params from the url once the initial tab is set
  React.useEffect(() => {
    router.replace(pathname);
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        minHeight: "800px",
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="transcription factor and cell type tabs"
        sx={{ marginBottom: "20px" }}
      >
        <Tab
          label="Browse all Transcription Factors"
          sx={{ textTransform: "none" }}
        />
        <Tab label="Browse all Cell Types" sx={{ textTransform: "none" }} />
      </Tabs>
      <Box mb={4}>
        {tabValue === 0 && (
          <TfDetails
            species={species}
            row={{
              target: {
                name: "",
              },
              counts: {
                total: 0,
                biosamples: 0,
              },
              datasets: undefined,
            }}
            factor={""}
          />
        )}
        {tabValue === 1 && <CtPage species={species} />}
      </Box>
    </Box>
  );
};

export default TranscriptionTabs;
