"use client";

import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";

interface StyledButtonProps {
  text: string;
  href: string;
  display?: string;
  sx?: object;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  text,
  href,
  display = "block",
  sx = {},
}) => {
  return (
    <Link href={href} passHref>
      <Button
        variant="contained"
        sx={{
          display: display,
          padding: "8px 16px",
          backgroundColor: "#8169BF",
          borderRadius: "24px",
          textTransform: "none",
          fontWeight: "medium",
          color: "#FFFFFF",
          "&:focus, &:hover, &:active": {
            backgroundColor: "#8169BF",
          },
          ...sx,
        }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default StyledButton;
