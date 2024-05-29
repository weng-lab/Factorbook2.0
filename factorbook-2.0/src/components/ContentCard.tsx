"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface ExperimentProps {
  title: string;
  count: number;
  description: string;
}

const ContentCard: React.FC<ExperimentProps> = ({
  title,
  count,
  description,
}) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 4,
      padding: 3,
      width: "100%", // Set width to 100% to fit the screen
      borderRadius: "24px",
      backgroundColor: "#EDE7F6",
      boxShadow: "none", // Remove the default box shadow
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
        <Typography
          variant="body2"
          sx={{ fontWeight: "medium", color: "#333" }}
        >
          {count} performed
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ color: "#333", marginTop: 2, width: "100%" }}
      >
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default ContentCard;
