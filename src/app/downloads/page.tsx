"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stack,
  Divider,
  Alert,
  Tooltip,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StyledButton from "../../components/styledbutton";
import Grid2 from "@mui/material/Unstable_Grid2";

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
    <Container sx={{ mb: 4 }}>
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
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={"bold"}
            marginBottom={5}
          >
            TF Motif Catalog
          </Typography>
          <Typography variant="body1">
            Motifs discovered using MEME on ChIP-seq experiments and the ZMotif
            neural network on HT-SELEX experiments. The catalog contains more
            than 6,000 motifs for each (with some redundancy).
          </Typography>
        </Box>
        <Divider />
        <Grid2 container sx={{ mt: 5 }}>
          <Grid2 xs={8}>
            <Stack spacing={2}>
              <Typography variant="h6">
                MEME ChIP-seq Catalog
                <Tooltip
                  title={`
                    These motifs were identified by applying MEME to the top 500 IDR thresholded ChIP-seq peaks from more than 3,000 ENCODE
                    ChIP-seq experiments. Five motifs were identified per experiment; these were subsequently filtered for quality using peak
                    centrality and enrichment metrics
                  `}
                >
                  <InfoIcon sx={{ ml: 1 }} />
                </Tooltip>
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Typography variant="body2">
                  6,069 Motifs
                </Typography>
                <Typography variant="body2">
                  733 Transcription Factors
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={2}>
                <StyledButton
                  href="/motifscatlog/factorbook_chipseq_meme_motifs.tsv"
                  text={
                    <>
                      <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      <strong>Download Motifs in MEME Format</strong>
                    </>
                  }
                  secondaryText="1 MB"
                />
                <StyledButton
                  href="/motifscatlog/complete-factorbook-catalog.meme.gz"
                  text={
                    <>
                      <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      <strong>Download Metadata in TSV Format</strong>
                    </>
                  }
                  secondaryText="2.9 MB"
                />
              </Stack>
            </Stack>
          </Grid2>
          <Grid2 xs={4}>
            <Stack spacing={2}>
              <Typography variant="h6">
                HT-SELEX Catalog
                <Tooltip
                  title={`
                    These motifs were identified by applying the ZMotif neural network to reads from HT-SELEX experiments and negative reads generated
                    by dinucleotide shuffling of true positive reads. The motif identified by the network as most predictive of positive reads for each
                    experiment is contained in this set. HDF5 format motifs can be loaded into Python for application in new models.
                  `}
                >
                  <InfoIcon sx={{ ml: 1 }} />
                </Tooltip>
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Typography variant="body2">
                  6,700 Motifs
                </Typography>
                <Typography variant="body2">
                  631 Transcription Factors
                </Typography>
              </Stack>
              <StyledButton
                href="/motifscatlog/all-selex-motifs.meme.gz"
                text={
                  <>
                    <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    <strong>Download Motifs in MEME Format</strong>
                  </>
                }
                secondaryText="1 MB"
              />
            </Stack>
          </Grid2>
        </Grid2>
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
        <Alert severity="info" sx={{my: 4}}>
          <b>This page offers downloads of the complete motif site catalog.</b>
          To download genomic sites for an individual motif, you can use the
          buttons available through the TF search or motif search on the home
          page.
        </Alert>
          
        {/* Accordion for ChIP-seq Peak Motif Site Catalog */}
        <div style={{marginBottom: '16px'}}> {/* div wrapper allows for proper border radius */}
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
                <a href="#" style={{ textDecoration: "underline" }}>See here</a> for a list of cell types in which these
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
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-4</sup> (46 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-5</sup> (45 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup> (44 MB)</p>}
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
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-4</sup> (758 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-5</sup> (684 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup> (653 MB)</p>}
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
                FIMO.</b> <a href="#" style={{ textDecoration: "underline" }}>Click here</a> for more information on the
                Registry of cCREs.
              </Alert>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: "uppercase" }}
              >
                Download merged motif sites
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>MEME: Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup> (47 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>MEME: Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-7</sup> (19 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>MEME: Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-8</sup> (11 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-5.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-5</sup> (57 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-6.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup> (12 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-7.merged.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-7</sup> (2 MB)</p>}
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
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup> (2.9 GB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-7</sup> (1.5 GB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-8</sup> (885 MB)</p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Lenient set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-5</sup></p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Moderate set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-6</sup></p>}
                  />
                </Grid2>
                <Grid2 xs={4}>
                  <StyledButton
                    href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                    text={
                      <>
                        <SaveAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>HT-SELEX: Stringent set</strong>
                      </>
                    }
                    secondaryText={<p>FIMO p-value {'<'} 10<sup>-7</sup></p>}
                  />
                </Grid2>
              </Grid2>
            </Stack>
          </AccordionDetails>
        </Accordion>     
        </div>
      </TabPanel>

      {/* Heritability Models Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={"bold"}
            gutterBottom
          >
            Partitioned LD Score Regression
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Quantify heritability enrichment in TF peaks and motif sites
          </Typography>
          <Typography variant="body1" gutterBottom>
            Download Partitioned LD Score Regression models for quantifying
            trait and disease heritability enrichment within TF ChIP-seq peaks
            or TF motif sites.
          </Typography>
          <Divider sx={{mb: 2}}/>

          {/* Accordion - Getting Started */}
          <div style={{marginBottom: '16px'}}>
          <Accordion
            defaultExpanded
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
                  1.{" "}
                  <a
                    href="https://docs.docker.com/get-docker/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{textDecoration: "underline"}}
                  >
                    Install Docker
                  </a>
                </li>
                <li>
                  2. Run the following command to partition heritability for motif
                  sites in ChIP-seq peaks from seven ENCODE cell lines:
                </li>
              </ol>
              <Box
                component="pre"
                sx={{
                  backgroundColor: "#f3f3f3",
                  padding: 2,
                  borderRadius: 1,
                  overflowX: "auto",
                }}
              >
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
              </Box>
              <Typography variant="body2" gutterBottom>
                To quantify heritability for a different subset of peaks or
                motif sites, simply sub a different URL for the ld-scores
                parameter. You can find URLs for each model in the{" "}
                <strong>View Models</strong> section below.
              </Typography>
              <Typography variant="body2">
                Output will be located at{" "}
                <Box component="pre" display="inline">
                  <b>/path/to/outputs/partitioned-heritability.txt</b>
                </Box>{" "}
                when the command finishes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </div>
          {/* Accordion - View and Download Models */}
          <div>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">View and Download Models</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box marginX={10}>
                <Typography variant="body1" gutterBottom>
                  Select an annotation to quantify heritability:
                </Typography>
                <Grid container spacing={4}>
                  {/* TF ChIP-seq Peaks Card */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: 3,
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" sx={{mb: 4}}>
                        TF ChIP-seq Peaks
                      </Typography>
                      <Typography variant="body2" sx={{mb: 5}}>
                        Quantify heritability enrichment within TF peaks
                        identified from ChIP-seq experiments in one of five
                        well-profiled ENCODE cell lines.
                      </Typography>
                      <StyledButton
                        text="View Models (5)"
                        href="https://factorbook.org/partitioned-ldr/hg38/peak-models"
                        sx={{width: "auto"}}
                      />
                    </Box>
                  </Grid>

                  {/* Motif Sites in TF ChIP-seq Peaks Card */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: 3,
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" sx={{mb: 4}}>
                        Motif Sites in TF ChIP-seq Peaks
                      </Typography>
                      <Typography variant="body2" sx={{mb: 5}}>
                        Quantify heritability enrichment within TF motif sites
                        identified in peaks from ChIP-seq experiments in one of
                        five well-profiled ENCODE cell lines.
                      </Typography>
                      <StyledButton
                        text="View Models (2)"
                        href="https://factorbook.org/partitioned-ldr/hg38/peak-motif-models"
                        sx={{width: "auto"}}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          </div>
        </Box>
      </TabPanel>
    </Container>
  );
};

export default DownloadPage;
