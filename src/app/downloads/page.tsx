"use client";

import React, { useState } from "react";
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
  CardContent,
  Card,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
  const [value, setValue] = React.useState(0);
  const isMobile = window.innerWidth <= 600;
  const [expandedAccordions, setExpandedAccordions] = React.useState({
    panel1: true,
    panel2: true,
  });
  const [accordionOpen, setAccordionOpen] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordions((prevState) => ({
        ...prevState,
        [panel]: isExpanded,
      }));
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
        <Tabs value={value} onChange={handleChange} aria-label="download tabs">
          <Tab label="TF Motif Catalog" {...a11yProps(0)} />
          <Tab label="Genomic Motif Sites" {...a11yProps(1)} />
          <Tab label="Heritability Models" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            mt: 4,
            mx: "auto",
            pb: 16,
            maxWidth: isMobile ? "90%" : "800px",
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight={"bold"}
            gutterBottom
          >
            TF Motif Catalog
          </Typography>

          {/* Description */}
          <Typography variant="body1" gutterBottom>
            Motifs discovered using MEME on ChIP-seq experiments and the ZMotif
            neural network on HT-SELEX experiments. The catalog contains more
            than 6,000 motifs for each (with some redundancy).
          </Typography>
          <Grid2 container spacing={4}>
            {/* MEME ChIP-seq Catalog Section */}
            <Grid2 xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                MEME ChIP-seq Catalog
              </Typography>
              <Typography variant="body2" gutterBottom>
                6,069 Motifs
                <br />
                733 Transcription Factors
              </Typography>
              <StyledButton
                startIcon={<SaveAltIcon />}
                href="/motifscatlog/factorbook_chipseq_meme_motifs.tsv"
                text="Download motifs in MEME Format"
              />
              <Box sx={{ marginTop: 2 }}>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="/motifscatlog/complete-factorbook-catalog.meme.gz"
                  text="Download metadata in TSV Format"
                />
              </Box>
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                HT-SELEX Catalog
              </Typography>
              <Typography variant="body2" gutterBottom>
                6,700 Motifs
                <br />
                631 TFs
              </Typography>
              <StyledButton
                startIcon={<SaveAltIcon />}
                href="/motifscatlog/all-selex-motifs.meme.gz"
                text="Download motifs in MEME Format"
              />
            </Grid2>
          </Grid2>
        </Box>
      </TabPanel>

      {/* Genomic Motif Sites Tab */}
      <TabPanel value={value} index={1}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={"bold"}
          gutterBottom
        >
          Factorbook Human Motif Site Catalog
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Genomic Motif Sites in ChIP-seq Peaks and Candidate Regulatory
          Elements
        </Typography>

        <Typography variant="body1" gutterBottom>
          Motif sites identified by scanning ChIP-seq peaks and candidate
          cis-regulatory elements with FIMO. There are approximately 6 million
          motif sites in ChIP-seq peaks and 7 million motif sites in candidate
          regulatory elements after merging overlapping motif sites.
        </Typography>

        {/* Info Box */}
        <Box
          sx={{
            backgroundColor: "#F3F0FF",
            borderRadius: 2,
            padding: 2,
            display: "flex",
            alignItems: "center",
            my: 3,
          }}
        >
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" color="textPrimary">
            This page offers downloads of the complete motif site catalog. To
            download genomic sites for an individual motif, you can use the
            buttons available through the TF search or motif search on the home
            page.
          </Typography>
        </Box>

        {/* Accordion for ChIP-seq Peak Motif Site Catalog */}
        <Accordion
          expanded={expandedAccordions.panel1}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={
              expandedAccordions.panel1 ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )
            }
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h6">
              ChIP-seq Peak Motif Site Catalog
            </Typography>
            <InfoIcon sx={{ ml: 1 }} />
          </AccordionSummary>
          <AccordionDetails>
            {/* Message Box with ReportProblemIcon */}
            <Box
              sx={{
                backgroundColor: "#FFF7E6",
                borderRadius: 2,
                padding: 2,
                display: "flex",
                alignItems: "center",
                my: 3,
                color: "#663C00",
              }}
            >
              <ReportProblemIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#663C00" }}>
                This catalog contains sites of MEME motifs from ChIP-seq
                datasets identified within ChIP-seq peaks using FIMO.{" "}
                <a href="#">See here</a> for a list of cell types in which these
                ChIP-seq peaks were identified. Regulatory motif sites in cell
                types biologically distinct from well-profiled cell types might
                not be contained in this catalog!
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textTransform: "uppercase" }}
                >
                  Download merged motif sites
                </Typography>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Lenient set - FIMO p-value < 10^-4 (46 MB)"
                        ),
                      }}
                    />
                  }
                />

                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Moderate set - FIMO p-value < 10^-5 (45 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Stringent set - FIMO p-value < 10^-6 (44 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textTransform: "uppercase" }}
                >
                  Download all motif sites
                </Typography>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.4.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Lenient set - FIMO p-value < 10^-4 (758 MB)"
                        ),
                      }}
                    />
                  }
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.5.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Moderate set - FIMO p-value < 10^-5 (684 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-peak-occurrences.6.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Stringent set - FIMO p-value < 10^-6 (653 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Accordion for rDHS Motif Site Catalog */}
        <Accordion
          expanded={expandedAccordions.panel2}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={
              expandedAccordions.panel2 ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="h6">
              Representative DNase Hypersensitive Site (rDHS) Motif Site Catalog
            </Typography>
            <InfoIcon sx={{ ml: 1 }} />
          </AccordionSummary>
          <AccordionDetails>
            {/* Message Box with ReportProblemIcon */}
            <Box
              sx={{
                backgroundColor: "#FFF7E6",
                borderRadius: 2,
                padding: 2,
                display: "flex",
                alignItems: "center",
                my: 3,
                color: "#663C00",
              }}
            >
              <ReportProblemIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#663C00" }}>
                This catalog contains sites of MEME motifs and HT-SELEX motifs
                identified within rDHSs from the ENCODE Registry of cCREs using
                FIMO. <a href="#">Click here</a> for more information on the
                Registry of cCREs.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textTransform: "uppercase" }}
                >
                  Download merged motif sites
                </Typography>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "MEME: Lenient set - FIMO p-value < 10^-6 (47 MB)"
                        ),
                      }}
                    />
                  }
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "MEME: Moderate set - FIMO p-value < 10^-7 (19 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "MEME: Stringent set - FIMO p-value < 10^-8 (11 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-5.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Lenient set FIMO p-value &lt;10^-5 (57 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="ttps://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-6.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Moderate set FIMO p-value &lt;10^-6 (12 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/HT-SELEX-rDHS.1e-7.merged.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Stringent set FIMO p-value &lt;10^-7 (2 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textTransform: "uppercase" }}
                >
                  Download all motif sites
                </Typography>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.6.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Lenient set - FIMO p-value < 10^-6 (2.9 GB)"
                        ),
                      }}
                    />
                  }
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.7.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Moderate set - FIMO p-value < 10^-7 (1.5 GB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "Stringent set - FIMO p-value < 10^-8 (885 MB)"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Lenient set FIMO p-value &lt;10^-5"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Moderate set FIMO p-value &lt;10^-6"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="https://downloads.wenglab.org/factorbook-download/all-rDHS-instances.8.bed.gz"
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatSuperscript(
                          "HT-SELEX: Stringent set FIMO p-value &lt;10^-7"
                        ),
                      }}
                    />
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      {/* Heritability Models Tab */}
      <TabPanel value={value} index={2}>
        <Box
          sx={{
            mb: accordionOpen ? 0 : 13,
            mt: accordionOpen ? 0 : 6,
          }}
        >
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

          {/* Accordion - Getting Started */}
          <Accordion
            defaultExpanded
            onChange={(event, isExpanded) => setAccordionOpen(isExpanded)}
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
                  <a
                    href="https://docs.docker.com/get-docker/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install Docker
                  </a>
                </li>
                <li>
                  Run the following command to partition heritability for motif
                  sites in ChIP-seq peaks from seven ENCODE cell lines:
                </li>
              </ol>
              <Box
                component="pre"
                sx={{
                  backgroundColor: "#f3f3f3",
                  padding: 2,
                  borderRadius: 2,
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
                  /path/to/outputs/partitioned-heritability.txt
                </Box>{" "}
                when the command finishes.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Accordion - View and Download Models */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">View and Download Models</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      TF ChIP-seq Peaks
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Quantify heritability enrichment within TF peaks
                      identified from ChIP-seq experiments in one of five
                      well-profiled ENCODE cell lines.
                    </Typography>
                    <StyledButton
                      text="View Models (5)"
                      href="https://factorbook.org/partitioned-ldr/hg38/peak-models"
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
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Motif Sites in TF ChIP-seq Peaks
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Quantify heritability enrichment within TF motif sites
                      identified in peaks from ChIP-seq experiments in one of
                      five well-profiled ENCODE cell lines.
                    </Typography>
                    <StyledButton
                      text="View Models (2)"
                      href="https://factorbook.org/partitioned-ldr/hg38/peak-motif-models"
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </TabPanel>
    </Container>
  );
};

export default DownloadPage;
