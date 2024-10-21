"use client";

import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

interface SearchBarProps {
  placeholder: string;
  helperText: string;
}

const Searchbar: React.FC<SearchBarProps> = ({ placeholder, helperText }) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        padding: "9px 12px 8px 16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "3px",
        alignSelf: "stretch",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          position: "relative",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <TextField
          variant="outlined"
          placeholder={placeholder}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#FFFFFF" }} />
              </InputAdornment>
            ),
            style: {
              height: "40px",
              borderRadius: "24px",
              color: "#FFFFFF", // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: "#FFFFFF", // Placeholder color
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "24px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#FFFFFF", // Placeholder color
              opacity: 1, // Ensure placeholder text is fully opaque
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            display: "flex",
            width: "125px",
            height: "41px",
            padding: "8px 24px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px",
            backgroundColor: "#8169BF",
            position: "absolute",
            top: 0,
            right: 0,
            color: "white",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "26px",
            letterSpacing: "0.46px",
            textTransform: "none", // Ensuring only 'S' is capital
            "&:hover": {
              backgroundColor: "#7151A1",
            },
          }}
        >
          Search
        </Button>
      </Box>
      <Typography
        variant="body2"
        sx={{
          marginTop: "8px",
          color: "#FFFFFF", // Helper text color
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "0.15px",
        }}
      >
        {helperText}
      </Typography>
    </Box>
  );
};

export default Searchbar;
