"use client";

import { debounce } from "lodash";
import React, { useState, useCallback } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";


import Stack from "@mui/material/Stack";
import Config from "../../config.json";


const MotifSearchbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [val, setVal] = React.useState<String>("");


  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="outlined"
          placeholder={"enter sequence or regex"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            style: { textAlign: "center", color: "white" }, // Ensures text is white and visible
          }}
          InputLabelProps={{
            style: { textAlign: "center", width: "100%" },
          }}
          onChange={(e) => {
            setVal(e.target.value)
          }}
          onKeyDown={(event: any) => {
            if (event.key === "Enter" && val !== " " && val !== "") {
              event.preventDefault();
              window.open(`/motifscatalog/human/${val}`, "_self");
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "24px",
              paddingLeft: "12px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // Ensure hover border color is white
              },
              "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main, // Retain primary color on hover when focused
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // White border when not focused
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main, // Primary border when focused
            },
            "& .MuiInputBase-input::placeholder": {
              color: "gray", // Placeholder color
              opacity: 1,
            },
          }}
          
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.open(`/motifscatalog/human/${val}`, "_self")

          }}
          sx={{
            padding: "8px 24px",
            borderRadius: "24px",
            fontSize: "15px",
            lineHeight: "26px",
            textTransform: "none",
            "&:disabled": {
              backgroundColor: "#8169BF",
              color: "white",
              opacity: "75%"
            },
          }}
        // href={snpValue ? str : ""}
        >
          Search
        </Button>
      </Stack>
      <Box sx={{ marginLeft: "10px" }}>
        <Typography variant="caption" sx={{ color: "gray" }}>
          Examples: cca[cg]cag[ag]gggcgc or ccascagrgggcgc
        </Typography>
      </Box>
    </Box>
  );
};

export default MotifSearchbar;
