"use client";

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";

type ReferenceProps = {
  title: string;
  sources: { name: string; url: string }[];
};

const ReferenceSection: React.FC<ReferenceProps> = ({ title, sources }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        color: "white",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          width: "100%",
          fontSize: "1.25rem",
          fontWeight: "medium",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ cursor: "default" }}>
          {title}
        </Typography>
        <IconButton onClick={handleToggleVisibility} sx={{ p: 1 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.88 9.28957L12 13.1696L8.11998 9.28957C7.72998 8.89957 7.09998 8.89957 6.70998 9.28957C6.31998 9.67957 6.31998 10.3096 6.70998 10.6996L11.3 15.2896C11.69 15.6796 12.32 15.6796 12.71 15.2896L17.3 10.6996C17.69 10.3096 17.69 9.67957 17.3 9.28957C16.91 8.90957 16.27 8.89957 15.88 9.28957Z"
              fill="black"
              fillOpacity="0.54"
            />
          </svg>
        </IconButton>
      </Box>
      <Collapse in={isVisible}>
        <Box
          sx={{
            display: "flex",
            padding: "var(--2, 16px)",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            borderRadius: "var(--borderRadius3, 24px)",
            background: "var(--grey-500, #494A50)",
            width: "100%",
          }}
        >
          {sources.map((source, index) => (
            <Link
              href={source.url}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                padding: "var(--2, 16px)",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 0 auto",
                mt: 1,
                color: "white",
                backgroundColor: "transparent",
                borderRadius: "var(--borderRadius3, 24px)",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
                transition: "background-color 0.2s, color 0.2s",
              }}
            >
              {source.name}
            </Link>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ReferenceSection;
