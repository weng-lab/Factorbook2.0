"use client";

import { debounce } from "lodash";
import React, { useState, useEffect, useMemo } from "react";
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
  Grid2,
  CircularProgress
} from "@mui/material";
import { inflate } from "pako";
import { associateBy } from "queryz";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@/types";

interface TFSearchBarProps {
  assembly: string;
}

// Custom styled Autocomplete textField
const StyledAutocomplete = styled(Autocomplete)(() => ({
  "& .MuiOutlinedInput-root": {
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "12px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "white", // Placeholder color
    opacity: 1,
  },
}));

const SEARCH_OPTIONS_QUERY = gql(`
  query Datasets($q: String, $assembly: String, $limit: Int) {
    counts: targets(
      target_prefix: $q,
      processed_assembly: $assembly,
      replicated_peaks: true,
      exclude_investigatedas: ["recombinant protein"],
      include_investigatedas: ["cofactor", "chromatin remodeler", "RNA polymerase complex", "DNA replication", "DNA repair", "cohesin", "transcription factor","RNA binding protein","other context"],
      limit: $limit
    ) {
      name
      datasets {
        counts {
          total
          biosamples
        }
      }
    }
  }
`)

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

const TFSearchbar: React.FC<TFSearchBarProps> = ({ assembly }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tfA, setTFA] = useState<Map<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [validSearch, setValidSearch] = useState<string | undefined>(undefined)
  const [searchCaption, setSearchCaption] = useState<string>("")

  const [fetchOptions, { loading: loading_options, data: optionsData, error: error_options }] =
    useLazyQuery(SEARCH_OPTIONS_QUERY, {
      fetchPolicy: 'cache-first',
      onCompleted(d) {
        const tfSuggestion = d.counts;
        if (tfSuggestion && tfSuggestion.length > 0) {
          setSearchCaption("Select TF")
          const r = tfSuggestion
            .map(g => g.name)
            .filter((name): name is string => typeof name === "string");

          if (r?.length > 0) {

            let exists = r.find(str => str.toLowerCase() === inputValue.toLowerCase());
            if (exists) {
              if (assembly === "GRCh38") {
                exists = exists.toUpperCase();
              } else if (assembly === "mm10") {
                exists = exists.charAt(0).toUpperCase() + exists.slice(1).toLowerCase();
              }

              setValidSearch(exists);
              setSnpValue(inputValue as any);
              setSearchCaption("")
            } else {
              setValidSearch(undefined);
            }
          } else {
            setValidSearch(undefined)
            setSearchCaption("No Matching TFs")
          }
        } else {
          setValidSearch(undefined)
          setSearchCaption("No Matching TFs")
        }
      }
    });

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

  //handle the case where all characters are deleted
  useEffect(() => {
    if (inputValue === "") {
      handleReset()
    }
  }, [inputValue])

  const handleReset = () => {
    setSnpValue(null); // Clear the selected value
    setInputValue(""); // Clear the input text
    setValidSearch(undefined); // disable search
    setSearchCaption("")
  }

  // Debouncing the search input change
  const debounceFn = useMemo(() => {
    return debounce((q: string) => {
      fetchOptions({
        variables: {
          assembly,
          q,
          limit: 3,
        },
      });
    }, 300);
  }, [assembly, fetchOptions]);

  useEffect(() => {
    return () => debounceFn.cancel();
  }, [debounceFn]);

  return (
    <Box>
      <Stack direction={isMobile ? "column" : "row"} spacing={2}>
        <FormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={inputValue === "" ? [] : optionsData?.counts.map(c => c.name) ?? []}
            freeSolo
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue && validSearch) {
                event.preventDefault();
                window.open(
                  validSearch
                    ? `/tf/${assembly === "GRCh38" ? "human" : "mouse"
                    }/${validSearch}/function`
                    : "",
                  "_self"
                );
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "white" }} />}
            clearIcon={loading_options && !validSearch ? <CircularProgress size={20} sx={{ color: "white" }} /> : <ClearIcon sx={{ color: "white" }} onClick={() => { handleReset() }} />}
            value={snpValue && formatFactorName(snpValue, assembly)}
            onChange={(_, newValue: any) => setSnpValue(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue) {
                debounceFn(newInputValue);
              }
            }}
            noOptionsText="Example: CTCF"
            renderInput={(params) => (
              <TextField
                color="primary"
                error={(optionsData?.counts.length === 0 && inputValue !== "") || Boolean(error_options)}
                label={error_options ? "Error Fetching TFs" : searchCaption}
                {...params}
                placeholder="Enter TF Name"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />{" "}
                    </InputAdornment>
                  ),
                  style: { textAlign: "center", color: "white" },
                }}
                InputLabelProps={{
                  style: { width: "100%", color: optionsData?.counts.length === 0 || error_options ? theme.palette.error.main : "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: searchCaption === "Select TF" || searchCaption === "" ? theme.palette.primary.main : theme.palette.error.main, // Hover border color
                    },
                  }
                }}
              />
            )}
            renderOption={(props, option: any) => {
              const tfSuggestion = optionsData?.counts;
              let subtitle;
              if (tfSuggestion && tfSuggestion.length > 0) {
                subtitle = tfSuggestion.map((g: any) => ({
                  total: g.datasets.counts.total,
                  biosamples: g.datasets.counts.biosamples,
                  label:
                    !tfA || !tfA.get(g.name!)
                      ? ""
                      : (
                        tfA.get(g.name!)["TF assessment"] as string
                      ).includes("Likely")
                        ? "Likely sequence-specific TF - "
                        : SEQUENCE_SPECIFIC.has(tfA.get(g.name!)["TF assessment"])
                          ? "Sequence-specific TF - "
                          : "Non-sequence-specific factor - ",
                  name: g.name,
                }));
              }
              const selected = subtitle?.find((g) => g.name === option);
              return (
                <li {...props} key={option}>
                  <Grid2 container alignItems="center">
                    <Grid2 sx={{ width: "100%", wordWrap: "break-word" }}>
                      <Box component="span">
                        {formatFactorName(option, assembly)}
                      </Box>
                      {selected && (
                        <Typography variant="body2" color="text.secondary">
                          {`${selected.label} ${selected.total} experiments, ${selected.biosamples} cell types`}
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
          LinkComponent={Link}
          variant="contained"
          disabled={validSearch === undefined}
          sx={{
            padding: "8px 24px",
            "&:disabled": {
              backgroundColor: "#8169BF",
              color: "white",
              opacity: "75%"
            },
          }}
          href={
            snpValue && validSearch
              ? `/tf/${assembly === "GRCh38" ? "human" : "mouse"
              }/${validSearch}/function`
              : ""
          }
        >
          Go
        </Button>

      </Stack>

      <Box sx={{ marginLeft: "10px" }}>
        <Typography variant="caption" sx={{ color: "white" }}>
          {assembly === "GRCh38" ?
            "Example: CTCF, ATF3"
            :
            "Example: Ctcf, Chd2"
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default TFSearchbar;
