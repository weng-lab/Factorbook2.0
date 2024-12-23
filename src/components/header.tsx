"use client";

import React from "react";
import { Box, Typography, SvgIcon } from "@mui/material";

const Header: React.FC = () => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        p: "30px 0 16px 0",
        textAlign: "center",
        backgroundColor: "transparent",
        color: "var(--text-primary, rgba(0, 0, 0, 0.87))",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: "34px",
          fontWeight: 400,
          lineHeight: "123.5%",
          letterSpacing: "0.25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFeatureSettings: "'clig' off, 'liga' off",
          mb: 0,
        }}
      >
        Portals
      </Typography>

      <Box
        sx={{
          width: "166px",
          height: "51px",
          mt: "-20px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="166"
          height="51"
          viewBox="0 0 166 51"
          fill="none"
        >
          <path
            d="M5 5.77011C49 49.7701 134 57.27 161 30.27"
            stroke="#E0E0FF"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "-10px",
        }}
      >
        <SvgIcon viewBox="0 0 24 24" sx={{ width: 24, height: 24 }}>
          <path
            d="M15.88 9.28957L12 13.1696L8.11998 9.28957C7.72998 8.89957 7.09998 8.89957 6.70998 9.28957C6.31998 9.67957 6.31998 10.3096 6.70998 10.6996L11.3 15.2896C11.69 15.6796 12.32 15.6796 12.71 15.2896L17.3 10.6996C17.69 10.3096 17.69 9.67957 17.3 9.28957C16.91 8.90957 16.27 8.89957 15.88 9.28957Z"
            fill="black"
            fillOpacity="0.54"
          />
        </SvgIcon>
      </Box>
    </Box>
  );
};

export default Header;
