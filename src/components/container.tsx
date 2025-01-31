"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Stack, Paper, Divider, useTheme } from "@mui/material";

type ReferenceProps = {
  title: string;
  sources: { name: string; url: string }[];
};

const ReferenceSection: React.FC<ReferenceProps> = ({ title, sources }) => {
  const theme = useTheme()
  
  return (
    <Stack
      component={Paper}
      elevation={0}
      sx={{ background: "#6B6C74" }}
      p={theme.spacing(2)}
      gap={theme.spacing(2)}
      color={"white"}
    >
      <Typography variant="h5">
        {title}
      </Typography>
      <Divider sx={{ borderColor: "white" }} />
      {sources.map((source: { name: string, url: string }, i) => {
        return (
          <Link
            href={source.url}
            display={"block"}
            underline="hover"
            key={i}
            target="_blank"
            rel="noopener noreferrer"
            color={"inherit"}
          >
            {source.name}
          </Link>
        )
      })}
    </Stack>
  );
};

export default ReferenceSection;
