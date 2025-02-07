"use client";

import { debounce } from "lodash";
import React, { useState, useCallback, useEffect } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  Autocomplete,
  FormControl,
  Grid2
} from "@mui/material";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import Config from "../../config.json";
import ClearIcon from '@mui/icons-material/Clear';

import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

const SNP_AUTOCOMPLETE_QUERY = `
    query suggestions($assembly: String!, $snpid: String!) {
        snpAutocompleteQuery(assembly: $assembly, snpid: $snpid) {
            id
            coordinates {
                chromosome
                start
                end
            }
        }
    }
`;
type Snp = {
  id: string;
  chrom: string;
  start: number;
  end: number;
};

interface SnpSearchbarProps {
  textColor?: string;
  handleSubmit: (snpValue: string) => void;
}

// Custom styled Autocomplete textField
const StyledAutocomplete = styled(Autocomplete)(() => ({
  "& .MuiOutlinedInput-root": {
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "12px",
  },
}));

const SnpSearchbar: React.FC<SnpSearchbarProps> = ({textColor, handleSubmit}) => {
  const theme = useTheme();

  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [snpids, setSnpIds] = useState<Snp[]>([]);
  const [validSearch, setValidSearch] = useState<boolean>(false)

  const onSearchChange = async (value: string) => {
    setOptions([]);
    const response = await fetch(Config.API.GraphqlAPI, {
      method: "POST",
      body: JSON.stringify({
        query: SNP_AUTOCOMPLETE_QUERY,
        variables: {
          assembly: "GRCh38",
          snpid: value,
        },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const snpSuggestion = (await response.json()).data?.snpAutocompleteQuery;
    if (snpSuggestion && snpSuggestion.length > 0) {
      const r: string[] = snpSuggestion.map((g: { id: number }) => g.id);
      const snp = snpSuggestion.map(
        (g: {
          coordinates: { chromosome: string; start: number; end: number };
          id: number;
        }) => ({
          chrom: g.coordinates.chromosome,
          start: g.coordinates.start,
          end: g.coordinates.end,
          id: g.id,
        })
      );
      setOptions(r);
      setSnpIds(snp);
      const exists = r.some(str => str.toLowerCase() === value.toLowerCase());
      setValidSearch(exists)
      if (exists) {
        setSnpValue(value as any)
      }
    } else {
      setOptions([]);
      setSnpIds([]);
    }
  };

  //handle the case where all characters are deleted
  useEffect(() => {
    if (inputValue === "") {
      handleReset()
    }
  }, [inputValue])

  const handleReset = () => {
    setSnpValue(null); // Clear the selected value
    setInputValue(""); // Clear the input text
    setOptions([]); //clear the options
    setValidSearch(false); // disable search
  }

  const debounceFn = useCallback(debounce(onSearchChange, 500), []);
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={options}
            freeSolo
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue && validSearch) {
                event.preventDefault();
                handleSubmit(snpValue)
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "gray" }} />}

            clearIcon={<ClearIcon sx={{ color: "white" }}
              onClick={() => { handleReset() }}
            />}
            value={snpValue}
            onChange={(_, newValue: any) => setSnpValue(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              if (newInputValue) {
                debounceFn(newInputValue);
              }
              setInputValue(newInputValue);
            }}
            noOptionsText="Example: rs3794102"
            renderInput={(params) => (
              <TextField
                color="primary"
                error={!validSearch && inputValue !== ""}
                label={validSearch || inputValue === "" ? "" : "Invalid ID"}
                {...params}
                placeholder="Enter rsID"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: textColor ? textColor : "white" }} />
                    </InputAdornment>
                  ),
                  style: { textAlign: "center", color: textColor ? textColor : "white" },
                }}
                InputLabelProps={{
                  style: { width: "100%" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: validSearch || inputValue === "" ? theme.palette.primary.main : theme.palette.error.main, // Hover border color
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: textColor ? textColor : "white", // Placeholder color
                      opacity: 1,
                    },
                  }
                }}
              />
            )}
            renderOption={(props, option: any) => {
              const selectedSnp = snpids.find((g) => g.id === option);
              return (
                <li {...props} key={option}>
                  <Grid2 container alignItems="center">
                    <Grid2
                      sx={{ width: "100%", wordWrap: "break-word" }}
                    >
                      <Box component="span">{option}</Box>
                      {selectedSnp && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {`${selectedSnp.chrom}:${selectedSnp.end}`}
                        </Typography>
                      )}
                    </Grid2>
                  </Grid2>
                </li>
              );
            }} theme={theme} />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={!validSearch || inputValue === ""}
          sx={{
            padding: "8px 24px",
            "&:disabled": {
              backgroundColor: "#8169BF",
              color: "white",
              opacity: "75%"
            },
          }}
          onClick={() => {
            if (snpValue && validSearch) {
              handleSubmit(snpValue)
            }
          }}
        >
          Go
        </Button>
      </Stack>
      <Box sx={{ marginLeft: "10px" }}>
        <Typography variant="caption" sx={{ color: "gray" }}>
          Example: rs3794102
        </Typography>
      </Box>
    </Box>
  );
};

export default SnpSearchbar;
