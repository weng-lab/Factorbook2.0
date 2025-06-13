"use client";

import { debounce } from "lodash";
import React, { useState, useCallback, useEffect, useMemo } from "react";

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
  Grid2,
  CircularProgress
} from "@mui/material";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import ClearIcon from '@mui/icons-material/Clear';

import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@/types";

const SNP_AUTOCOMPLETE_QUERY = gql(`
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
`);
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
  const [snpids, setSnpIds] = useState<Snp[]>([]);
  const [validSearch, setValidSearch] = useState<boolean>(false)
  const [searchCaption, setSearchCaption] = useState<string>("")

  const [fetchOptions, { loading: loading_options, data: optionsData, error: error_options }] =
    useLazyQuery(SNP_AUTOCOMPLETE_QUERY, {
      fetchPolicy: 'cache-first',
      onCompleted(d) {
        setSearchCaption("Select ID")
        const snpSuggestion = d.snpAutocompleteQuery;
        if (snpSuggestion && snpSuggestion.length > 0) {
          const r = snpSuggestion.map(g => g.id);
          const snp = snpSuggestion.map(g => ({
            chrom: g.coordinates.chromosome,
            start: g.coordinates.start,
            end: g.coordinates.end,
            id: g.id,
          })
          );
          setSnpIds(snp);
          const exists = r.some(str => str.toLowerCase() === inputValue.toLowerCase());
          setValidSearch(exists)
          if (exists) {
            setSnpValue(inputValue as any)
            setSearchCaption("")
          }
        } else {
          setSnpIds([]);
          setSearchCaption("No Matching IDs")
        }
      }
    });

  //handle the case where all characters are deleted
  useEffect(() => {
    if (inputValue === "") {
      handleReset()
    }
  }, [inputValue])

  const handleReset = () => {
    setSnpValue(null); // Clear the selected value
    setInputValue(""); // Clear the input text
    setValidSearch(false); // disable search
    setSearchCaption("")
  }

  // Debouncing the search input change
  const debounceFn = useMemo(() => {
    return debounce((q: string) => {
      fetchOptions({
        variables: {
          assembly: "GRCh38",
          snpid: q,
        },
      });
    }, 300);
  }, [fetchOptions]);

  useEffect(() => {
    return () => debounceFn.cancel();
  }, [debounceFn]);
  
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={inputValue === "" ? [] : optionsData?.snpAutocompleteQuery.map(s => s.id) ?? []}
            freeSolo
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue && validSearch) {
                event.preventDefault();
                handleSubmit(snpValue)
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "gray" }} />}

            clearIcon={loading_options && !validSearch ? <CircularProgress size={20} sx={{ color: "white" }} /> : <ClearIcon sx={{ color: "white" }} onClick={() => { handleReset() }}/>}
            value={snpValue}
            onChange={(_, newValue: any) => setSnpValue(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue) {
                debounceFn(newInputValue);
              }
            }}
            noOptionsText="Example: rs3794102"
            renderInput={(params) => (
              <TextField
                color="primary"
                error={(optionsData?.snpAutocompleteQuery.length === 0 && inputValue !== "") || Boolean(error_options)}
                label={error_options ? "Error Fetching IDs" : searchCaption}
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
                  style: { width: "100%", color: optionsData?.snpAutocompleteQuery.length === 0 || error_options ? theme.palette.error.main : "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: searchCaption === "Select ID" || searchCaption === "" ? theme.palette.primary.main : theme.palette.error.main, // Hover border color
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
