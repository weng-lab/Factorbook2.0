import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  message: string;
}

const QCMessage: React.FC<Props> = ({ message }) => {
  return (
    <Box>
      <Typography variant="h6">QC Message</Typography>
      <Typography>{message}</Typography>
    </Box>
  );
};

export default QCMessage;
