"use client";

import React, { useState, useCallback } from "react";
import TranscriptionFactors from "@/components/transcriptionfactors";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Unstable_Grid2";
import { debounce } from "lodash";
import Link from "@mui/material/Link";
import Config from "../../../config.json";
import { SNP_AUTOCOMPLETE_QUERY } from "./queries";
import { useParams } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { POPULATIONS, SUBPOPULATIONS } from "./const";
import styled from "@emotion/styled";
import {
  Autocomplete,
  FormControl,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";

type Snp = {
  id: string;
  chrom: string;
  start: number;
  end: number;
};

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

const CodeBox = styled(Box)({
  backgroundColor: "#f5f5f5",
  padding: "16px",
  overflowX: "auto",
  fontFamily: "monospace",
});

const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  marginTop: "8px",
});

const SmallSelect = styled(Select)({
  minWidth: "200px",
  height: "32px",
  "& .MuiSelect-select": {
    padding: "6px 14px",
  },
});

const SmallTextField = styled(TextField)({
  minWidth: "200px",
  "& .MuiInputBase-root": {
    height: "32px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "5px",
    "&:hover fieldset": {
      borderColor: "#673AB7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#673AB7",
    },
  },
});

const PurpleAutocomplete = styled(Autocomplete)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    "&:hover fieldset": {
      borderColor: "#673AB7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#673AB7",
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    color: "#673AB7",
  },
});

const PurpleFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#673AB7",
  },
});

const AnnotationsVariants = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [value, setValue] = useState(0);
  const params = useParams();

  const [snpValue, setSnpValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [snpids, setSnpIds] = useState<Snp[]>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(true);

  const { p, s, r } = useParams();

  const snpid = params?.[2];

  const [id, setId] = useState<string | undefined>(params.i);
  const [population, setPopulation] = useState(p || POPULATIONS[0].value);
  const [subpopulation, setSubpopulation] = useState(s || "NONE");
  const [rSquaredThreshold, setRSquaredThreshold] = useState(+(r || 0.7));

  // autocomplete fetch logic
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
  const handleSubmit = () => {
    if (snpValue) {
      setId(snpid);
    }
  };

  const handleTabChange = (_: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const handlePopulationChange = (event: any) => {
    setPopulation(event.target.value);
  };

  const handleSubpopulationChange = (event: any) => {
    setSubpopulation(event.target.value);
  };

  const handleSelectionChange = (prev: boolean) => {
    setSelected(!prev);
  };

  const annotationsContent = `Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Often identified in genome-wide association studies, these variants can disrupt gene regulatory networks, leading to varied phenotypic effects or predispositions to diseases. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants.`;

  const str: string = selected
    ? "/annotationsvariants/GRCh38/" +
      snpValue +
      "/" +
      population +
      "/" +
      subpopulation +
      "/" +
      rSquaredThreshold
    : "/annotationsvariants/GRCh38/" + snpValue;

  return (
    <>
      <TranscriptionFactors
        header="Annotations"
        content={annotationsContent}
        image="/Human.png"
      />
      <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 4 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="full width tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label="Annotate a Variant" />
          <Tab label="Quantify Trait Heritability" />
        </Tabs>
      </Box>

      {id === "" || id === undefined
        ? value === 0 && (
            <Box
              sx={{
                mt: 4,
                mx: "auto",
                maxWidth: "800px",
                padding: isMobile ? 2 : isTablet ? 3 : 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Annotate a variant of interest using peaks and motif sites
              </Typography>
              <StyledBox>
                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                  <PurpleFormControl fullWidth variant="outlined">
                    <PurpleAutocomplete
                      options={options}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && snpValue) {
                          event.preventDefault();
                          handleSubmit();
                        }
                      }}
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
                          placeholder="Enter rsID or locus"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                            style: { textAlign: "center" },
                          }}
                          InputLabelProps={{
                            style: { textAlign: "center", width: "100%" },
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
                      }}
                    />
                  </PurpleFormControl>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
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
                    href={snpValue ? str : ""}
                  >
                    Search
                  </Button>
                </Stack>
                <Box sx={{ marginLeft: "10px" }}>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    Example: rs3794102
                  </Typography>
                </Box>
              </StyledBox>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Linkage Disequilibrium Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      onClick={() => handleSelectionChange(selected)}
                      style={{ color: "purple" }}
                    />
                  }
                  label="Include SNPs in linkage disequilibrium with the query"
                  style={{ marginBottom: "5px" }}
                />
                {selected && (
                  <>
                    <FlexBox>
                      <Typography variant="body1">
                        Select a Population:
                      </Typography>
                      <SmallSelect
                        value={population}
                        onChange={handlePopulationChange}
                        defaultValue={POPULATIONS[0].value}
                      >
                        {POPULATIONS.map((e) => {
                          return <MenuItem value={e.value}>{e.text}</MenuItem>;
                        })}
                      </SmallSelect>
                    </FlexBox>
                    <FlexBox>
                      <Typography variant="body1">
                        Select a Subpopulation:
                      </Typography>
                      <SmallSelect
                        value={subpopulation}
                        onChange={handleSubpopulationChange}
                      >
                        {SUBPOPULATIONS.get(population)?.map((e) => {
                          return <MenuItem value={e.value}>{e.text}</MenuItem>;
                        })}
                      </SmallSelect>
                    </FlexBox>
                    <FlexBox>
                      <Typography variant="body1">
                        r<sup>2</sup> threshold:
                      </Typography>
                      <SmallTextField
                        label=""
                        variant="outlined"
                        placeholder="Type a value"
                        defaultValue="0.7"
                      />
                    </FlexBox>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2 }}
                      style={{ marginBottom: "5px" }}
                    >
                      LD data is derived from the{" "}
                      <Link href="#" style={{ color: "purple" }}>
                        1,000 Genomes Project
                      </Link>
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )
        : null}

      {value === 1 && (
        <Box
          sx={{
            mt: 4,
            mx: "auto",
            maxWidth: "800px",
            padding: isMobile ? 2 : isTablet ? 3 : 4,
            mb: 8, // Add margin at the bottom for extra space
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Partitioned LD Score Regression
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Quantify heritability enrichment in TF peaks and motif sites
          </Typography>
          <Accordion
            expanded={page === 0}
            onChange={() => setPage(page === 0 ? -1 : 0)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Getting Started</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" gutterBottom>
                Quantifying heritability enrichment takes ~5 minutes on a
                standard laptop. We recommend running this workflow using our
                provided Docker image. Click for detailed instructions.
              </Typography>
              <ol>
                <li>
                  <Link
                    href="https://docs.docker.com/get-docker/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install Docker
                  </Link>
                </li>
                <li>
                  Run the following command to partition heritability for motif
                  sites in ChIP-seq peaks from seven ENCODE cell lines:
                </li>
              </ol>
              <CodeBox>
                <pre>
                  docker run \<br />
                  &nbsp;&nbsp;--volume /path/to/inputs:/input \<br />
                  &nbsp;&nbsp;ghcr.io/weng-lab/ldr/ldr:latest \<br />
                  &nbsp;&nbsp;python3 -m ldr.h2 \<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--ld-scores <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;http://gcp.wenglab.org/ldr-models/seven-cell-type-motifs.tar.gz
                  \<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--ld-prefix annotations \<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--summary-statistics <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;/input/summary-stats.txt &gt;
                  partitioned-heritability.txt
                </pre>
              </CodeBox>
              <Typography variant="body2" gutterBottom>
                To quantify heritability for a different subset of peaks or
                motif sites, simply sub a different URL for the ld-scores
                parameter. You can find URLs for each model in the{" "}
                <strong>View Models</strong> section below.
              </Typography>
              <Typography variant="body2">
                Output will be located at{" "}
                <Box component="pre" display="inline">
                  /path/to/outputs/partitioned-heritability.txt
                </Box>{" "}
                when the command finishes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Divider />
        </Box>
      )}
    </>
  );
};

export default AnnotationsVariants;
