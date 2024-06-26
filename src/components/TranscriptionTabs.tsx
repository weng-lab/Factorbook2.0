"use client";

import * as React from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

const TranscriptionTabs: React.FC = () => {
  const [tabValue, setTabValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
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
        aria-label="primary tabs example"
        sx={{ marginBottom: "20px" }}
      >
        <Tab
          label="Browse all Transcription Factors"
          sx={{ textTransform: "none" }}
        />
        <Tab label="Browse all Cell Types" sx={{ textTransform: "none" }} />
      </Tabs>
      <Box>
        {tabValue === 0 && (
          <Typography>Content for Browse all Transcription Factors</Typography>
        )}
        {tabValue === 1 && (
          <Typography>Content for Browse all Cell Types</Typography>
        )}
      </Box>
    </Box>
  );
};

export default TranscriptionTabs;
