"use client";

import React, { forwardRef } from "react";
import { Button, SxProps, Theme } from "@mui/material";
import Link from "next/link";

interface StyledButtonProps {
  text: string;
  href: string;
  display?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  startIcon?: React.ReactNode;
}

const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ text, href, display = "block", sx = {}, onClick, startIcon }, ref) => {
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
            justifyContent: "flex-start", // Ensure icon and text are aligned horizontally
            alignItems: "center", // Vertically center align icon and text
            width: "100%", // Make the button take up the full width of its container
            maxWidth: "400px", // Set a max width for larger screens
            "&:focus, &:hover, &:active": {
              backgroundColor: "#8169BF",
            },
            // Media query for tablets
            "@media (max-width: 768px)": {
              maxWidth: "300px", // Adjust max width for tablets
              padding: "8px 12px", // Adjust padding for smaller screens
            },
            // Media query for phones
            "@media (max-width: 480px)": {
              maxWidth: "100%", // Use full width on small screens
              padding: "8px 10px", // Adjust padding for smaller screens
            },
            ...sx,
          }}
          onClick={onClick}
          startIcon={startIcon}
        >
          {text}
        </Button>
      </Link>
    );
  }
);

StyledButton.displayName = "StyledButton";

export default StyledButton;
