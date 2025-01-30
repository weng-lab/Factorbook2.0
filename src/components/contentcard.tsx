"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface ContentCardProps {
  title: string;
  count?: number;
  description: string;
  sx?: SxProps<Theme>;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  count,
  description,
  sx,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        p: 3,
        width: "100%",
        backgroundColor: "#EDE7F6",
        boxShadow: "none",
        ...sx,
      }}
    >
      <CardContent sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#558B2F" }}
          >
            {title}
          </Typography>
          {typeof count === "number" && (
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", color: "#333" }}
            >
              {count} performed
            </Typography>
          )}
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "#333",
            mt: 2,
            width: "100%",
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
