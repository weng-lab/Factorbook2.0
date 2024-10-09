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
  Autocomplete,
  FormControl,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Unstable_Grid2";
import Config from "../../config.json";
import { inflate } from "pako";
import { associateBy } from "queryz";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

interface TFSearchBarProps {
  assembly: string;
}

const TFSearchbar: React.FC<TFSearchBarProps> = ({ assembly }) => {
  const theme = useTheme(); // Get the theme object
  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [snpids, setSnpIds] = useState<any[]>([]);
  const [tfA, setTFA] = useState<Map<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

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
          datasets: {
            counts: { total: number; biosamples: number };
          };
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

  const debounceFn = useCallback(debounce(onSearchChange, 300), []);

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth variant="outlined">
          <Autocomplete
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
            popupIcon={
              <ArrowDropDown sx={{ color: theme.palette.gray.main }} />
            }
            clearIcon={<ClearIcon sx={{ color: theme.palette.gray.main }} />}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: "24px",
                backgroundColor: "#FFFFFF", // White background when not focused
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main, // Purple border on hover
                },
                "&.Mui-focused": {
                  backgroundColor: theme.palette.gray.main, // Light purple background on focus
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main, // Purple border on focus
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: theme.palette.primary.main, // Set placeholder color to primary color
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
            noOptionsText="Example: CTCF, APOE"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter TF Name"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  style: {
                    textAlign: "center",
                    color: theme.palette.primary.main,
                  },
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
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: "125px",
            height: "41px",
            padding: "8px 24px",
            borderRadius: "24px",
            backgroundColor: theme.palette.primary.main, // Use theme primary color
            color: "white",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.secondary.main, // Use theme secondary color for hover
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
        <Typography variant="caption" sx={{ color: theme.palette.gray.main }}>
          Example: CTCF, ATF3
        </Typography>
      </Box>
    </Box>
  );
};

export default TFSearchbar;
