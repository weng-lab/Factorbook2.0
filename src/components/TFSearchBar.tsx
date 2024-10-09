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
} from "@mui/material";
import { Autocomplete, FormControl } from "@mui/material";
import styled from "@emotion/styled";
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

const TF_AUTOCOMPLETE_QUERY = `
query Datasets($q: String, $assembly: String, $limit: Int) {
  counts: targets(target_prefix: $q, processed_assembly: $assembly, replicated_peaks: true, exclude_investigatedas: ["recombinant protein"], include_investigatedas: ["cofactor", "chromatin remodeler", "RNA polymerase complex", "DNA replication", "DNA repair", "cohesin", "transcription factor"], limit: $limit) {
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
`;
const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

const TFSearchbar: React.FC<TFSearchBarProps> = ({ assembly }) => {
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
        query: TF_AUTOCOMPLETE_QUERY,
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

  //console.log(snpids,"snpids")
  const debounceFn = useCallback(debounce(onSearchChange, 1), []);
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
                  snpValue
                    ? `/TranscriptionFactor/${
                        assembly === "GRCh38" ? "human" : "mouse"
                      }/${snpValue}/Function`
                    : "",
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
                          {`${selectedSnp.label} ${selectedSnp.total} experiments,${selectedSnp.biosamples} cell types`}
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
          //  onClick={handleSubmit}
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
