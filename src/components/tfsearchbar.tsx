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
  Grid2
} from "@mui/material";
import Config from "../../config.json";
import { inflate } from "pako";
import { associateBy } from "queryz";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";

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

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

const TFSearchbar: React.FC<TFSearchBarProps> = ({ assembly }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [snpids, setSnpIds] = useState<any[]>([]);
  const [tfA, setTFA] = useState<Map<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [validSearch, setValidSearch] = useState<boolean>(false)

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
    setOptions([]); //clear the options
    setValidSearch(false); // disable search
  }

  // Handle changes in the search bar with debouncing
  const onSearchChange = async (value: string, tfAassignment: any) => {
    setOptions([]);
    const response = await fetch(Config.API.CcreAPI, {
      method: "POST",
      body: JSON.stringify({
        query: `
          query Datasets($q: String, $assembly: String, $limit: Int) {
            counts: targets(
              target_prefix: $q,
              processed_assembly: $assembly,
              replicated_peaks: true,
              exclude_investigatedas: ["recombinant protein"],
              include_investigatedas: ["cofactor", "chromatin remodeler", "RNA polymerase complex", "DNA replication", "DNA repair", "cohesin", "transcription factor","RNA binding protein"],
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
      const r: string[] = tfSuggestion.map((g: { name: string }) => g.name);

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

  // Debouncing the search input change
  const debounceFn = useCallback(debounce(onSearchChange, 300), [assembly]);

  return (
    <Box>
      <Stack direction={isMobile ? "column" : "row"} spacing={2}>
        <FormControl fullWidth variant="outlined">
          <StyledAutocomplete
            options={options}
            freeSolo
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && snpValue && validSearch) {
                event.preventDefault();
                window.open(
                  snpValue
                    ? `/tf/${assembly === "GRCh38" ? "human" : "mouse"
                    }/${snpValue}/function`
                    : "",
                  "_self"
                );
              }
            }}
            popupIcon={<ArrowDropDown sx={{ color: "white" }} />}
            clearIcon={<ClearIcon sx={{ color: "white" }}
              onClick={() => { handleReset() }}
            />}
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
                color="primary"
                error={!validSearch && inputValue !== ""}
                label={validSearch || inputValue === "" ? "" : "Invalid TF"}
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
                  style: { width: "100%", color: "#ee725f" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: validSearch || inputValue === "" ? theme.palette.primary.main : theme.palette.error.main, // Hover border color
                    },
                  }
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
          LinkComponent={Link}
          variant="contained"
          disabled={!validSearch}
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
              }/${snpValue}/function`
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
