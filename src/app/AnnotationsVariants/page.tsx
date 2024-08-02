"use client";

import React, { useState } from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Searchbar from "@/components/Searchbar";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px", // reduce space between the label and input
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
    padding: "6px 14px",
  },
});

const AnnotationsVariants = () => {
  const [value, setValue] = useState(0);
  const [population, setPopulation] = useState("");
  const [subpopulation, setSubpopulation] = useState("");
  const [page, setPage] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlePopulationChange = (event: SelectChangeEvent<unknown>) => {
    setPopulation(event.target.value as string);
  };

  const handleSubpopulationChange = (event: SelectChangeEvent<unknown>) => {
    setSubpopulation(event.target.value as string);
  };

  const CodeBox = styled(Box)({
    backgroundColor: "#f5f5f5",
    padding: "16px",
    overflowX: "auto",
    fontFamily: "monospace",
  });

  const annotationsContent = `
  Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Often identified in genome-wide association studies, these variants can disrupt gene regulatory networks, leading to varied phenotypic effects or predispositions to diseases. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants.
  `;

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
          onChange={handleChange}
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
      {value === 0 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <Typography variant="h6" gutterBottom>
            Annotate a variant of interest using peaks and motif sites
          </Typography>
          <StyledBox>
            <Searchbar placeholder="Enter rsID or locus" helperText="" />
            <Typography variant="body2" sx={{ mt: -2 }}>
              Example: rs3794102
            </Typography>
          </StyledBox>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Linkage Disequilibrium Settings
            </Typography>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Include SNPs in linkage disequilibrium with the query"
            />
            <FlexBox>
              <Typography variant="body1">Select a Population:</Typography>
              <SmallSelect value={population} onChange={handlePopulationChange}>
                <MenuItem value="">
                  <em>(none)</em>
                </MenuItem>
                <MenuItem value={"population1"}>Population 1</MenuItem>
                <MenuItem value={"population2"}>Population 2</MenuItem>
              </SmallSelect>
            </FlexBox>
            <FlexBox>
              <Typography variant="body1">Select a Subpopulation:</Typography>
              <SmallSelect
                value={subpopulation}
                onChange={handleSubpopulationChange}
              >
                <MenuItem value="">
                  <em>(none)</em>
                </MenuItem>
                <MenuItem value={"subpopulation1"}>Subpopulation 1</MenuItem>
                <MenuItem value={"subpopulation2"}>Subpopulation 2</MenuItem>
              </SmallSelect>
            </FlexBox>
            <FlexBox>
              <Typography variant="body1">r2 threshold:</Typography>
              <SmallTextField
                label=""
                variant="outlined"
                placeholder="Type a value"
              />
            </FlexBox>
            <Typography variant="body2" sx={{ mt: 2 }}>
              LD data is derived from the{" "}
              <Link href="#">1,000 Genomes Project</Link>
            </Typography>
          </Box>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
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
