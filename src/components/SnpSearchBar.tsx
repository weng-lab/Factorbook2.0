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
} from "@mui/material";
import { Autocomplete, FormControl } from "@mui/material";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Unstable_Grid2";
import Config from "../../config.json";
import ClearIcon from "@mui/icons-material/Clear";

import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "gray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray",
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    color: "gray",
  },
});

const StyledFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "gray",
  },
});

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

const SnpSearchbar: React.FC = () => {
  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [options, setOptions] = useState([]);
  const [snpids, setSnpIds] = useState<Snp[]>([]);

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
      const r = snpSuggestion.map((g: { id: number }) => g.id);
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
    } else {
      setOptions([]);
      setSnpIds([]);
    }
  };

  const debounceFn = useCallback(debounce(onSearchChange, 500), []);

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <StyledFormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={options}
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue) {
                event.preventDefault();
                window.open(
                  snpValue ? `/annotationsvariants/GRCh38/${snpValue}` : "",
                  "_self"
                );
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "gray" }} />}
            clearIcon={<ClearIcon sx={{ color: "gray" }} />}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: "24px",
                paddingLeft: "12px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "gray",
                opacity: 1,
              },
            }}
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
                {...params}
                placeholder="Enter rsID"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                  style: { textAlign: "center", color: "gray" },
                }}
                InputLabelProps={{
                  style: { textAlign: "center", width: "100%", color: "gray" },
                }}
              />
            )}
            renderOption={(props, option: any) => {
              const selectedSnp = snpids.find((g) => g.id === option);
              return (
                <li {...props} key={option}>
                  <Grid2 container alignItems="center">
                    <Grid2 sx={{ width: "100%", wordWrap: "break-word" }}>
                      <Box component="span">{option}</Box>
                      {selectedSnp && (
                        <Typography variant="body2" color="text.secondary">
                          {`${selectedSnp.chrom}:${selectedSnp.end}`}
                        </Typography>
                      )}
                    </Grid2>
                  </Grid2>
                </li>
              );
            }}
          />
        </StyledFormControl>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: "125px",
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
          href={snpValue ? `/annotationsvariants/GRCh38/${snpValue}` : ""}
        >
          Search
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
