"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import Summary from "./Summary";

const CtPage: React.FC<{ species: string }> = ({ species }) => {
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";

  return (
    <Container>
      <Box mt={4}>
        <Summary assembly={assembly} species={species} />
      </Box>
    </Container>
  );
};

export default CtPage;
