"use client";

import React, { forwardRef, ReactNode } from "react";
import { Button, SxProps, Theme, Box, Typography } from "@mui/material";
import Link from "next/link";

interface StyledButtonProps {
  text: ReactNode;
  secondaryText?: ReactNode;
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
            display,
            padding: "10px 20px",
            backgroundColor: "#8169BF",
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 500,
            color: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            transition: "background-color 0.3s ease",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              marginLeft: "-4px",
            },
            "&:focus, &:hover, &:active": {
              backgroundColor: "#7259A7",
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
          <Box
            component="div"
            sx={{
              textAlign: "center",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: 500, fontSize: "16px" }}
            >
              {text}
            </Typography>
            {secondaryText && (
              <Typography
                variant="body2"
                component="span"
                sx={{
                  mt: 1,
                  fontSize: "14px",
                  color: "#E0E0E0",
                  textAlign: "center",
                }}
              >
                {secondaryText}
              </Typography>
            )}
          </Box>
        </Button>
      </Link>
    );
  }
);

StyledButton.displayName = "StyledButton";

export default StyledButton;
