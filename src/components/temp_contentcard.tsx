"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { SxProps } from "@mui/system";

interface ExperimentProps {
  title: string;
  count?: number;
  description: string;
  sx?: SxProps;
}

const ContentCard: React.FC<ExperimentProps> = ({
  title,
  count,
  description,
  sx,
}) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 4,
      padding: 3,
      width: "100%",
      borderRadius: "24px",
      backgroundColor: "#EDE7F6",
      boxShadow: "none",
      ...sx,
    }}
  >
    <CardContent sx={{ width: "100%" }}>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#558B2F" }}>
          {title}
        </Typography>
        {count !== undefined && (
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
          marginTop: 2,
          width: "100%",
          whiteSpace: "pre-line",
        }}
      >
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default ContentCard;
