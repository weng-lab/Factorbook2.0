"use client";

import { debounce } from "lodash";
import React, { useState, useCallback, useEffect } from "react";
import { formatFactorName } from "@/utilities/misc";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Autocomplete,
  FormControl,
  styled,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Config from "../../config.json";
import { inflate } from "pako";
import { associateBy } from "queryz";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

interface TFSearchBarProps {
  assembly: string;
}

// Custom styled Autocomplete with theme-based border and focus colors
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white", // Default border color when not focused
    },
    "&:hover fieldset": {
      borderColor: "white", // Hover border color when not focused
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main, // Border color on focus (primary color)
      borderWidth: 2, // Thicker border when focused
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    color: "white", // Dropdown arrow icon color when not focused
  },
}));

// Custom styled FormControl with theme-based focus color
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main, // Label color when focused
  },
}));

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

const TFSearchbar: React.FC<TFSearchBarProps> = ({ assembly }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [snpids, setSnpIds] = useState<any[]>([]);
  const [tfA, setTFA] = useState<Map<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch and inflate the data from the gzipped JSON file
  useEffect(() => {
    if (!loading) {
      fetch("/tf-assignments.json.gz")
        .then((x) => x.blob())
        .then((x) => x.arrayBuffer())
        .then((x) => inflate(x, { to: "string" }))
        .then((x) =>
          setTFA(
            associateBy(
              JSON.parse(x),
              (x: any) => x["HGNC symbol"],
              (x: any) => x
            )
          )
        )
        .catch(console.error);
      setLoading(true);
    }
  }, [loading]);

  // Handle changes in the search bar with debouncing
  const onSearchChange = async (value: string, tfAassignment: any) => {
    setOptions([]);
    const response = await fetch(Config.API.GraphqlAPI, {
      method: "POST",
      body: JSON.stringify({
        query: `
          query Datasets($q: String, $assembly: String, $limit: Int) {
            counts: targets(
              target_prefix: $q,
              processed_assembly: $assembly,
              replicated_peaks: true,
              exclude_investigatedas: ["recombinant protein"],
              include_investigatedas: ["cofactor", "chromatin remodeler", "RNA polymerase complex", "DNA replication", "DNA repair", "cohesin", "transcription factor"],
              limit: $limit
            ) {
              name
              datasets {
                counts {
                  total
                  biosamples
                  __typename
                }
                __typename
              }
              __typename
            }
          }
        `,
        variables: {
          assembly: assembly,
          q: value,
          limit: 3,
        },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const tfSuggestion = (await response.json()).data?.counts;
    if (tfSuggestion && tfSuggestion.length > 0) {
      const r = tfSuggestion.map((g: { name: string }) => g.name);

      const snp = tfSuggestion.map(
        (g: {
          datasets: { counts: { total: number; biosamples: number } };
          name: string;
        }) => {
          return {
            total: g.datasets.counts.total,
            biosamples: g.datasets.counts.biosamples,
            label:
              !tfAassignment || !tfAassignment.get(g.name!)
                ? ""
                : (
                    tfAassignment.get(g.name!)["TF assessment"] as string
                  ).includes("Likely")
                ? "Likely sequence-specific TF - "
                : SEQUENCE_SPECIFIC.has(
                    tfAassignment.get(g.name!)["TF assessment"]
                  )
                ? "Sequence-specific TF - "
                : "Non-sequence-specific factor - ",
            name: g.name,
          };
        }
      );
      setOptions(r);
      setSnpIds(snp);
    } else {
      setOptions([]);
      setSnpIds([]);
    }
  };

  // Debouncing the search input change
  const debounceFn = useCallback(debounce(onSearchChange, 300), []);

  return (
    <Box>
      <Stack direction={isMobile ? "column" : "row"} spacing={2}>
        <StyledFormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={options}
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue) {
                event.preventDefault();
                window.open(
                  snpValue
                    ? `/TranscriptionFactor/${
                        assembly === "GRCh38" ? "human" : "mouse"
                      }/${snpValue}/Function`
                    : "",
                  "_self"
                );
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "white" }} />} // Arrow icon white when not focused
            clearIcon={<ClearIcon sx={{ color: "white" }} />} // Clear icon white when not focused
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: "24px",
                paddingLeft: "12px",
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
            value={snpValue && formatFactorName(snpValue, assembly)}
            onChange={(_, newValue: any) => setSnpValue(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              if (newInputValue) {
                debounceFn(newInputValue, tfA);
              }
              setInputValue(newInputValue);
            }}
            noOptionsText="Example: CTCF"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter TF Name"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />{" "}
                      {/* Search icon white when not focused */}
                    </InputAdornment>
                  ),
                  style: { textAlign: "center", color: "white" },
                }}
                InputLabelProps={{
                  style: { textAlign: "center", width: "100%", color: "white" },
                }}
              />
            )}
            renderOption={(props, option: any) => {
              const selectedSnp = snpids.find((g) => g.name === option);
              return (
                <li {...props} key={option}>
                  <Grid2 container alignItems="center">
                    <Grid2 sx={{ width: "100%", wordWrap: "break-word" }}>
                      <Box component="span">
                        {formatFactorName(option, assembly)}
                      </Box>
                      {selectedSnp && (
                        <Typography variant="body2" color="text.secondary">
                          {`${selectedSnp.label} ${selectedSnp.total} experiments, ${selectedSnp.biosamples} cell types`}
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
          href={
            snpValue
              ? `/TranscriptionFactor/${
                  assembly === "GRCh38" ? "human" : "mouse"
                }/${snpValue}/Function`
              : ""
          }
        >
          Search
        </Button>
      </Stack>

      <Box sx={{ marginLeft: "10px" }}>
        <Typography variant="caption" sx={{ color: "gray" }}>
          Example: CTCF, ATF3
        </Typography>
      </Box>
    </Box>
  );
};

export default TFSearchbar;
