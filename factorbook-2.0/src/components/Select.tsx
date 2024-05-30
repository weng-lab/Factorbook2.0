"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SelectHost from "@/components/SelectHost"; // Adjust the path as needed
import { SelectChangeEvent } from "@mui/material";

interface SelectComponentProps {
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ onChange }) => {
  const options = [
    { value: "human", label: "Human" },
    { value: "mouse", label: "Mouse" },
  ];

  return (
    <Box
      component="section"
      sx={{
        display: "inline-flex",
        height: "169px",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          width: "100%",
          color: "rgba(0, 0, 0, 0.87)",
          fontFamily: "Helvetica Neue",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "0.15px",
          fontFeatureSettings: "'clig' off, 'liga' off",
          mb: 2,
        }}
      >
        Explore TFs in
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <SelectHost
          text="Select your host"
          options={options}
          onChange={onChange}
        />
        <Button
          variant="contained"
          sx={{
            width: "80px",
            height: "41px",
            padding: "8px 22px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#8169BF",
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: "medium",
            color: "white",
          }}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
};

export default SelectComponent;
