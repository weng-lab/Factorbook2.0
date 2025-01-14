"use client";

import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
} from "@mui/material";
import Stack from "@mui/material/Stack";

const MotifSearchbar: React.FC = () => {
  const theme = useTheme();

  const [val, setVal] = React.useState<String>("");

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <TextField
          color="primary"
          variant="outlined"
          placeholder={"enter sequence or regex"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            style: { textAlign: "center", color: "white" },
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
              "& fieldset": {
                borderColor: "white", // Default border color
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main, // Hover border color
              },
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
