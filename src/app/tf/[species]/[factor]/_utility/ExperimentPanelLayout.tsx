'use client'

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  ArrowForwardIos,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import ExperimentSelectionPanel, { Dataset } from "./ExperimentSelectionPanel/ExperimentSelectionPanel";

/**
 * Provides left side panel for biosample selection on motif enrichemnt and epigenetic profiles
 */
export default function ExperimentPanelLayout({
  children,
  mode
}: {
  children: React.ReactNode,
  mode: "MotifEnrichment" | "EpigeneticProfile"
}) {
  const params = useParams<{
    species: string,
    factor: string,
    accession: string
  }>()

  const { species, factor, accession } = params
  const [drawerOpen, setDrawerOpen] = useState(true);
  const router = useRouter(); // For pushing URL updates

  const handleExperimentChange = (experiment: Dataset) => {
    router.push(
      `/tf/${species}/${factor}/${mode === "MotifEnrichment" ? "motif" : "histone"}/${experiment.accession}`
    );
  };

  return (
    <Box
      sx={{
        height: {xs: 'auto', md: "100vh"},
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/**
       * @todo this can probably live in ExperimentSelectionPanel?
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
          height: drawerOpen ? {xs: '300px', md: 'auto'} : 'auto'
        }}
      >
        {drawerOpen && (
          <ExperimentSelectionPanel
            mode={mode}
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
          padding: 2,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}