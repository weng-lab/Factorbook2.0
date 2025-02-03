"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';

const Header: React.FC = () => {

  return (
    <Box
      id="target-section"
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
          mt: "-18px",
        }}
      >
        <IconButton 
          onClick={() => {
            const targetElement = document.getElementById('target-section');
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          sx={{color:"#757575"}}
          aria-label="Scroll down">
          <ExpandMoreIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
