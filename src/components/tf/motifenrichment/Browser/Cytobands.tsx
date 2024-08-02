import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  bands: string[];
}

const Cytobands: React.FC<Props> = ({ bands }) => {
  return (
    <Box>
      <Typography variant="h6">Cytobands</Typography>
      {bands.map((band, index) => (
        <Typography key={index}>{band}</Typography>
      ))}
    </Box>
  );
};

export default Cytobands;
