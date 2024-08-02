import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  details: string;
}

const MEMEMotifsDetails: React.FC<Props> = ({ details }) => {
  return (
    <Box>
      <Typography variant="h6">MEME Motifs Details</Typography>
      <Typography>{details}</Typography>
    </Box>
  );
};

export default MEMEMotifsDetails;
