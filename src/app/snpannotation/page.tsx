"use client";

import React, { useState, useCallback, useEffect } from "react";
import TranscriptionFactors from "@/components/transcriptionfactors";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { useParams } from "react-router";
import { POPULATIONS, SUBPOPULATIONS } from "./const";
import styled from "@emotion/styled";
import {
  Autocomplete,
  FormControl,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import SnpSearchBar from "@/components/snpsearchbar";
import { DisequilibriumDetails } from "./types";

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
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "12px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "gray", // Placeholder color
    opacity: 1,
  },
});

const AnnotationsVariants = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { population, subPopulation, rSquared } = useParams();
  const [value, setValue] = useState(0);
  const params = useParams();
  const [disequilibriumDetails, setDisequilibriumDetails] = useState<DisequilibriumDetails>({
    selected: false,
    population: population || POPULATIONS[0].value,
    subpopulation: subPopulation || "NONE",
    rSquaredThreshold: +(rSquared || 0.7)
  });

  const [id, setId] = useState<string | undefined>(params.i);

  //update specific variable in disequilbriumDetails
  const updateDetails = (key: keyof DisequilibriumDetails, value: unknown) => {
    setDisequilibriumDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleTabChange = (_: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const handlePopulationChange = (event: any) => {
    updateDetails("population", event.target.value);
    updateDetails("subpopulation", "NONE");
  };

  const handleSubpopulationChange = (event: any) => {
    updateDetails("subpopulation", event.target.value);
  };

  const handleSelectionChange = (prev: boolean) => {
    updateDetails("selected", !prev);
  };

  const handleSubmit = (snpValue: string) => {
    //create cutom redirect url based on if the user wants to change the linkage disequilibrium details
    const url: string = disequilibriumDetails.selected
      ? "/snpannotation/hg38/" +
      snpValue +
      "/" +
      disequilibriumDetails.population +
      "/" +
      disequilibriumDetails.subpopulation +
      "/" +
      disequilibriumDetails.rSquaredThreshold
      : "/snpannotation/hg38/" + snpValue;

    window.open(snpValue ? url : "", "_self");
  };

  const annotationsContent = `Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Often identified in genome-wide association studies, these variants can disrupt gene regulatory networks, leading to varied phenotypic effects or predispositions to diseases. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants.`;

  return (
    <>
      <TranscriptionFactors
        header="Annotations"
        content={annotationsContent}
        image="/Human.png"
      />
      <Box sx={{ width: "100%", bgcolor: "background.paper", paddingX: "10vw" }}>
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
              ml: "10vw",
              mt: 4,
              maxWidth: "800px",
              paddingY: isMobile ? 2 : isTablet ? 3 : 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Annotate a variant of interest using peaks and motif sites
            </Typography>
            <StyledBox>
              <SnpSearchBar textColor="gray" handleSubmit={handleSubmit} />
            </StyledBox>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Linkage Disequilibrium Settings
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disequilibriumDetails.selected}
                    onClick={() => handleSelectionChange(disequilibriumDetails.selected)}
                    style={{ color: "primary" }}
                  />
                }
                label="Include SNPs in linkage disequilibrium with the query"
                style={{ marginBottom: "5px" }}
              />
              {disequilibriumDetails.selected && (
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
                      value={disequilibriumDetails.subpopulation}
                      onChange={handleSubpopulationChange}
                    >
                      {SUBPOPULATIONS.get(disequilibriumDetails.population)?.map((e) => {
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
                    <Link href="#" style={{ color: "secondary" }}>
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
            ml: "10vw",
            maxWidth: "80vw",
            paddingY: isMobile ? 2 : isTablet ? 3 : 4,
            mb: 8, // Add margin at the bottom for extra space
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Partitioned LD Score Regression
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Quantify heritability enrichment in TF peaks and motif sites
          </Typography>
          <Typography variant="body1" gutterBottom>
            Quantifying heritability enrichment takes ~5 minutes on a
            standard laptop. We recommend running this workflow using our
            provided Docker image. Click for detailed instructions.
          </Typography>
          <ol>
            <li>
              1.{" "}
              <Link
                href="https://docs.docker.com/get-docker/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install Docker
              </Link>
            </li>
            <li>
              2. Run the following command to partition heritability for motif
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
          </Typography>
          <Box component="pre" display="inline">
            <Typography variant="body2">
              <b>/path/to/outputs/partitioned-heritability.txt </b>when the command finishes.
            </Typography>
          </Box>
          <Divider />
        </Box>
      )}
    </>
  );
};

export default AnnotationsVariants;
