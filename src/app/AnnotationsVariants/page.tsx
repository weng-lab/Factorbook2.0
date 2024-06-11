"use client";

import * as React from "react";
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
import Searchbar from "@/components/Searchbar"; // Assuming Searchbar component is correctly imported
import { styled } from "@mui/material/styles";

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
  const [value, setValue] = React.useState(0);
  const [population, setPopulation] = React.useState("");
  const [subpopulation, setSubpopulation] = React.useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlePopulationChange = (event: SelectChangeEvent<unknown>) => {
    setPopulation(event.target.value as string);
  };

  const handleSubpopulationChange = (event: SelectChangeEvent<unknown>) => {
    setSubpopulation(event.target.value as string);
  };

  const motifsContent = `
  Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Often identified in genome-wide association studies, these variants can disrupt gene regulatory networks, leading to varied phenotypic effects or predispositions to diseases. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants.
  `;

  return (
    <>
      <TranscriptionFactors
        header="Motifs Site Catlog"
        content={motifsContent}
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
              SExample: rs3794102
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
              LD data is derived from the <a href="#">1,000 Genomes Project</a>
            </Typography>
          </Box>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <Typography variant="h6" gutterBottom>
            Quantify Trait Heritability
          </Typography>
          <StyledBox>
            <Typography variant="body1">
              Content for Quantify Trait Heritability tab goes here.
            </Typography>
          </StyledBox>
        </Box>
      )}
    </>
  );
};

export default AnnotationsVariants;
