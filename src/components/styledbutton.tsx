"use client";

import React, { forwardRef, ReactNode } from "react";
import { Button, SxProps, Theme, Box, Typography } from "@mui/material";
import Link from "next/link";

interface StyledButtonProps {
  text: string; // Keep as string for backward compatibility
  secondaryText?: ReactNode; // New optional prop for additional text
  href: string;
  display?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  startIcon?: React.ReactNode;
}

const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  (
    {
      text,
      secondaryText,
      href,
      display = "block",
      sx = {},
      onClick,
      startIcon,
    },
    ref
  ) => {
    return (
      <Link href={href} passHref>
        <Button
          variant="contained"
          ref={ref}
          sx={{
            display: display,
            padding: "8px 16px",
            backgroundColor: "#8169BF",
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: "medium",
            color: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              marginLeft: "-4px",
            },
            "&:focus, &:hover, &:active": {
              backgroundColor: "#8169BF",
            },
            "@media (max-width: 768px)": {
              maxWidth: "300px",
              padding: "8px 12px",
            },
            "@media (max-width: 480px)": {
              maxWidth: "100%",
              padding: "8px 10px",
            },
            ...sx,
          }}
          onClick={onClick}
          startIcon={startIcon}
        >
          {/* Main Text with Icon on the same line */}
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" component="span" sx={{ mr: 1 }}>
              {text}
            </Typography>
          </Box>

          {/* Secondary text (optional), displayed on a new line */}
          {secondaryText && (
            <Typography
              variant="body2"
              component="div"
              sx={{ mt: 1, width: "100%" }}
            >
              {secondaryText}
            </Typography>
          )}
        </Button>
      </Link>
    );
  }
);

StyledButton.displayName = "StyledButton";

export default StyledButton;
