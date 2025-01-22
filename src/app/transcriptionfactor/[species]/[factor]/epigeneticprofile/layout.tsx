'use client'

import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  ArrowForwardIos,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import ExperimentSelectionPanel, { Dataset } from "../[detail]/_ExperimentSelectionPanel/ExperimentSelectionPanel";

/**
 * Provides left side panel for biosample selection
 */
export default function EpigeneticProfileLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const params = useParams<{
    species: string,
    factor: string,
    detail: string,
    accession: string
  }>()

  const { species, factor, detail, accession } = params
  const [drawerOpen, setDrawerOpen] = useState(true);
  const router = useRouter(); // For pushing URL updates

  const handleExperimentChange = (experiment: Dataset) => {
    router.push(
      `/transcriptionfactor/${species}/${factor}/epigeneticprofile/${experiment.accession}`
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100vh)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/**
       * @todo this can probably live in ExperimentSelectionPanel? Duplicated currently
       */}
      {/* Right-facing arrow for expanding */}
      {!drawerOpen && (
        <Tooltip title="Open Experiment Selection" placement="right">
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "fixed",
              top: "50%", // Center the button vertically
              left: 5,
              transform: "translateY(-50%)", // Adjust centering
              zIndex: 2000,
              backgroundColor: "white",
              boxShadow: 3,
            }}
            color="primary"
          >
            <ArrowForwardIos />
          </IconButton>
        </Tooltip>
      )}

      {/* Left-side Drawer */}
      <Box
        sx={{
          width: drawerOpen ? { xs: "100%", md: "25%" } : 0, // Same width as before
          transition: "width 0.3s ease", // Smooth transition when opening/closing
          position: "relative",
        }}
      >
        {drawerOpen && (
          <ExperimentSelectionPanel
            mode={"MotifEnrichment"}
            onChange={handleExperimentChange}
            assembly={species === "human" ? "GRCh38" : "mm10"}
            selectedExperiment={accession}
            factor={factor}
            onClose={() => setDrawerOpen(false)}
            tooltipContents={(experiment) => {
              return (
                <Stack>
                  <Typography variant="subtitle1">
                    Lab: {experiment.lab?.friendly_name}
                  </Typography>
                </Stack>
              )
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: "25px" },
          padding: "16px",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}