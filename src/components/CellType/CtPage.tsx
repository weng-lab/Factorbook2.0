"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Summary from "./Summary";

const CtPage: React.FC<{ species: string }> = ({ species }) => {
  const assembly = species === "human" ? "GRCh38" : "mm10";
  const celltype = species === "human" ? "GRCh38" : "mm10";
  const details = "summary";

  return (
    <Container>
      <Box mt={4}>
        <Summary assembly={assembly} celltype={celltype} species={species} />
      </Box>
    </Container>
  );
};

export default CtPage;
