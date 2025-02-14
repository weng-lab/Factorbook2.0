"use client";

import React from "react";
import { Button, ButtonProps, Typography, Stack } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";

export interface StackedDownloadButtonProps extends ButtonProps {
  topText: React.ReactNode;
  bottomText?: React.ReactNode;
}

const StackedDownloadButton = ({ topText, bottomText, ...buttonProps }: StackedDownloadButtonProps) => {

  return (
    <Button
      variant="contained"
      startIcon={<SaveAlt />}
      fullWidth
      {...buttonProps}
    >
      <Stack>
        <Typography
          variant="body1"
          fontWeight={"bold"}
        >
          {topText}
        </Typography>
        {typeof bottomText === "number" || typeof bottomText === "string" ?
          <Typography
            variant="caption"
          >
            {bottomText}
          </Typography>
          :
          bottomText
        }
      </Stack>
    </Button>
  );
}

export default StackedDownloadButton;
