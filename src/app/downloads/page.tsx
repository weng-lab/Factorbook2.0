"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Grid2,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stack,
  Divider,
  Alert,
  Tooltip,
  Link as MuiLink,
  Button,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeritabilityModels from "./heritabilityModels";
import StackedDownloadButton from "../../components/stackedDownloadButton";
import TfMotifCatalogDownloads from "./tfMotifCatalogs";
import Link from "next/link";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function formatSuperscript(text: string) {
  // Replace '^' with <sup> tag for numbers following it
  return text.replace(/(\^-?\d+)/g, (match: string | any[]) => {
    const exponent = match.slice(1); // Extract exponent part after '^'
    return `<sup>${exponent}</sup>`; // Return formatted HTML string
  });
}

const DownloadPage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    (<Container sx={{ mb: 4, minHeight: '70vh' }}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Factorbook Downloads <SaveAltIcon fontSize="large" />
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Select a Factorbook Data set to download:
        </Typography>
      </Box>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="download tabs" variant="fullWidth" >
          <Tab label="TF Motif Catalog" {...a11yProps(0)} sx={{ textTransform: "none" }} />
          <Tab label="Genomic Motif Sites" {...a11yProps(1)} sx={{ textTransform: "none" }} />
          <Tab label="Heritability Models" {...a11yProps(2)} sx={{ textTransform: "none" }} />
        </Tabs>
      </Box>
      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <TfMotifCatalogDownloads />
      </TabPanel>
      {/* Genomic Motif Sites Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={"bold"}
        >
          Factorbook Human Motif Site Catalog
        </Typography>

        <Typography variant="subtitle2" marginBottom={4}>
          Genomic Motif Sites in ChIP-seq Peaks and Candidate Regulatory
          Elements
        </Typography>

        <Typography variant="body1">
          Motif sites identified by scanning ChIP-seq peaks and candidate
          cis-regulatory elements with FIMO. There are approximately 6 million
          motif sites in ChIP-seq peaks and 7 million motif sites in candidate
          regulatory elements after merging overlapping motif sites.
        </Typography>
        <Divider />

        {/* Info Box */}
        <Alert severity="info" sx={{ my: 4 }}>
          <b>This page offers downloads of the complete motif site catalog.</b>
          To download genomic sites for an individual motif, you can use the
          buttons available through the TF search or motif search on the home
          page.
        </Alert>

        {/* Accordion for ChIP-seq Peak Motif Site Catalog */}
        <div style={{ marginBottom: '16px' }}> {/* div wrapper allows for proper border radius */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">
                ChIP-seq Peak Motif Site Catalog
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Alert severity="warning">
                  <b>This catalog contains sites of MEME motifs from ChIP-seq
                    datasets identified within ChIP-seq peaks using FIMO.</b>{" "}
                  <MuiLink component={Link} href="/tf/human?tab=1" style={{ textDecoration: "underline" }}>See here</MuiLink> for a list of cell types in which these
                  ChIP-seq peaks were identified. <b>Regulatory motif sites in cell
                    types biologically distinct from well-profiled cell types might
                    not be contained in this catalog!</b>
                </Alert>
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase" }}
                >
                  Download merged motif sites
                </Typography>
                <Grid2 container columnSpacing={2}>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-4</sup> (46 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-5</sup> (45 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup> (44 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.merged.bed.gz"
                    />
                  </Grid2>
                </Grid2>
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase" }}
                >
                  Download all motif sites
                </Typography>
                <Grid2 container columnSpacing={2}>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-4</sup> (758 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-5</sup> (684 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup> (653 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.bed.gz"
                    />
                  </Grid2>
                </Grid2>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* Accordion for rDHS Motif Site Catalog */}
        <div> {/* div wrapper allows for proper border radius */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography variant="h6">
                Representative DNase Hypersensitive Site (rDHS) Motif Site Catalog
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Alert severity="warning">
                  <b>This catalog contains sites of MEME motifs and HT-SELEX motifs
                    identified within rDHSs from the ENCODE Registry of cCREs using
                    FIMO.</b> <MuiLink component={Link} href="https://screen.wenglab.org/about">Click here</MuiLink> for more information on the
                  Registry of cCREs.
                </Alert>
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase" }}
                >
                  Download merged motif sites
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup> (47 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-7</sup> (19 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-8</sup> (11 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-5</sup> (57 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-5.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup> (12 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-6.merged.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-7</sup> (2 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-7.merged.bed.gz"
                    />
                  </Grid2>
                </Grid2>
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase" }}
                >
                  Download all motif sites
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup> (2.9 GB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-7</sup> (1.5 GB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.bed.gz"
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="MEME: Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-8</sup> (885 MB)</Typography>}
                      href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                    />
                  </Grid2>
                  {/* <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Lenient set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-6</sup></Typography>}
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Moderate set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-7</sup></Typography>}
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <StackedDownloadButton
                      topText="HT-SELEX: Stringent set"
                      bottomText={<Typography variant="caption">FIMO p-value {'<'} 10<sup>-8</sup></Typography>}
                    />
                  </Grid2> */}
                </Grid2>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </div>
      </TabPanel>
      {/* Heritability Models Tab */}
      <TabPanel value={tabValue} index={2}>
        <HeritabilityModels />
      </TabPanel>
    </Container>)
  );
};

export default DownloadPage;
