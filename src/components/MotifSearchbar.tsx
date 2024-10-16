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

import Stack from "@mui/material/Stack";

const MotifSearchbar: React.FC = () => {
  const [val, setVal] = React.useState<String | null>(null);

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
                <SearchIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
            style: {
              height: "40px",
              borderRadius: "24px",
              color: "gray", // Text color
            },
          }}
          InputLabelProps={{
            style: {
              color: "gray", // Placeholder color
            },
          }}
          onChange={(e) => {
            setVal(e.target.value);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "24px",
              borderColor: "gray",
              "&:hover fieldset": {
                borderColor: "gray",
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "gray", // Placeholder color
              opacity: 1, // Ensure placeholder text is fully opaque
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          //  onClick={handleSubmit}
          onClick={() => {
            window.open(`/MotifsCatalog/Human/${val}`, "_self");
          }}
          sx={{
            width: "100px",
            height: "41px",
            padding: "8px 24px",
            borderRadius: "24px",
            backgroundColor: "#8169BF",
            color: "white",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "26px",
            letterSpacing: "0.46px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#7151A1",
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
