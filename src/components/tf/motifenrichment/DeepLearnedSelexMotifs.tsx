import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  factor: string;
  species: string;
}

const DeepLearnedSelexMotifs: React.FC<Props> = ({ factor, species }) => {
  return (
    <Box>
      <Typography variant="h6">Deep Learned SELEX Motifs</Typography>
      <Typography>Factor: {factor}</Typography>
      <Typography>Species: {species}</Typography>
    </Box>
  );
};

export default DeepLearnedSelexMotifs;
