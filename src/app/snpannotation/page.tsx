"use client";

import React, { useState } from "react";
import TranscriptionFactors from "@/components/transcriptionfactors";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { POPULATIONS, SUBPOPULATIONS } from "./const";
import styled from "@emotion/styled";
import {
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SnpSearchBar from "@/components/snpsearchbar";
import { DisequilibriumDetails } from "./types";
import HeritabilityModels from "../downloads/heritabilityModels";

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
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

const AnnotationsVariants = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [value, setValue] = useState(0)

  const [disequilibriumDetails, setDisequilibriumDetails] = useState<DisequilibriumDetails>({
    selected: false,
    population: POPULATIONS[0].value,
    subpopulation: "NONE",
    rSquaredThreshold: 0.7
  });

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

  const handleRSquaredChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    updateDetails("rSquaredThreshold", event.target.value)
  }

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

      {value === 0 && (
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
                      onChange={handleRSquaredChange}
                    />
                  </FlexBox>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                    style={{ marginBottom: "5px" }}
                  >
                    LD data is derived from the{" "}
                    <Link href="https://www.internationalgenome.org/" target="_blank" rel="noopener noreferrer" style={{ color: "secondary" }}>
                      1,000 Genomes Project
                    </Link>
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}

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
          <HeritabilityModels />
        </Box>
      )}
    </>
  );
};

export default AnnotationsVariants;
