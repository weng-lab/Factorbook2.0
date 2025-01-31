"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Stack, Link } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface ContentCardProps {
  title: string;
  titleLink?: string;
  description: string;
  sx?: SxProps<Theme>;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  titleLink,
  description,
  sx,
}) => {
  return (
    <Card
      sx={{
        backgroundColor: "#EDE7F6",
        ...sx,
      }}
      elevation={0}
    >
      <CardContent sx={{padding: 3, display: "flex", flexDirection: "column", gap: 1}}>
        {titleLink ?
          <Typography variant="h6" href={titleLink} target="_blank" rel="noopener noreferrer" component={Link} color={theme => theme.palette.black.main} underline="hover">
            <b>{title}</b>
          </Typography>
          :
          <Typography variant="h6" color={theme => theme.palette.black.main}>
            <b>{title}</b>
          </Typography>
        }
        <Typography>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
