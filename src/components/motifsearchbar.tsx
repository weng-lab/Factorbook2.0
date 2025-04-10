"use client";

import React, { useState } from "react";
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

interface MotifSearchBarProps {
  dark?: boolean;
}

const MotifSearchbar: React.FC<MotifSearchBarProps> = ({dark}) => {
  const theme = useTheme();
  const [val, setVal] = React.useState<String>("");
  const [validSearch, setValidSearch] = useState(false);

  const handleChange = (input: string) => {
    setVal(input);

    // Regex to validate allowed characters and closed brackets
    const regex = /^[acgtwsmkrybdhvn\[\]]*$/i; // Match allowed letters and brackets
    const bracketBalanced = (input.match(/\[/g)?.length || 0) === (input.match(/\]/g)?.length || 0);

    // Find all content inside brackets
    const bracketMatches = input.match(/\[([^\[\]]+)\]/g);

    const onlyACGTInside = bracketMatches
    ? bracketMatches.every(group =>
        /^[acgt]+$/i.test(group.slice(1, -1))
      )
    : true;

    if (regex.test(input) && bracketBalanced && onlyACGTInside) {
      setValidSearch(true);
    } else {
      setValidSearch(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <TextField
          autoComplete="off"
          error={!validSearch && val !== ""}
          label={validSearch || val === "" ? "" : "Invalid Sequence"}
          color="primary"
          variant="outlined"
          placeholder={"enter sequence or regex"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: dark ? "grey" : "white" }} />
              </InputAdornment>
            ),
            style: { textAlign: "center", color: dark ? "grey" : "white" },
          }}
          InputLabelProps={{
            style: { width: "100%" },
          }}
          onChange={(e) => {
            handleChange(e.target.value)
          }}
          onKeyDown={(event: any) => {
            if (event.key === "Enter" && val !== " " && val !== "" && validSearch) {
              event.preventDefault();
              sessionStorage.setItem(
                "motifSearch",
                JSON.stringify(val)
              );
              window.open(`/motif/human/meme-search/${val}`, "_self");
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "24px",
              paddingLeft: "12px",
              backgroundColor: dark ? "#EDE7F6" : "transparent",
              "& fieldset": {
                borderColor: dark ? "grey" : "white", // Default border color
              },
              "&:hover fieldset": {
                borderColor: validSearch || val === "" ? theme.palette.primary.main : theme.palette.error.main, // Hover border color
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: dark ? "grey" : "white",
              opacity: 1,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!validSearch && val !== ""}
          onClick={() => {
            sessionStorage.setItem(
              "motifSearch",
              JSON.stringify(val)
            );
            window.open(`/motif/human/meme-search/${val}`, "_self");
          }}
          sx={{
            padding: "8px 24px",
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
