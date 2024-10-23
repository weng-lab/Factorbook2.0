"use client";

import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
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

const DownloadPage: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const isMobile = window.innerWidth <= 600; // To handle responsive design
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const downloadCards = [
    {
      title: "TF Motif Catalog",
      description:
        "Motifs discovered using MEME on ChIP-seq experiments and the ZMotif neural network on HT-SELEX experiments. The catalog contains more than 6,000 motifs for each (with some redundancy).",
      link: "/downloads/tf-motif-catalog",
    },
    {
      title: "Genomic Motif Sites",
      description:
        "Motif sites identified by scanning ChIP-seq peaks and candidate cis-regulatory elements with FIMO. There are approximately 6 million motif sites in ChIP-seq peaks and 7 million motif sites in candidate regulatory elements after merging overlapping motif sites.",
      link: "/downloads/tf-motif-catalog-2",
    },
    {
      title: "Heritability Models",
      description:
        "Motifs discovered using MEME on ChIP-seq experiments and the ZMotif neural network on HT-SELEX experiments. The catalog contains more than 6,000 motifs for each (with some redundancy).",
      link: "/downloads/tf-motif-catalog-3",
    },
  ];

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
          <Tab label="Temporary Downloads" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={value} index={0}>
        <Box sx={{ mt: 4, mx: "auto", maxWidth: isMobile ? "90%" : "800px" }}>
          {/* Title */}
          <Typography variant="h4" component="h1" gutterBottom>
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
                733 Transcription Factors{" "}
              </Typography>
              <StyledButton
                startIcon={<SaveAltIcon />}
                href="/motifscatalog/factorbook_chipseq_meme_motifs.tsv"
                text="Download motifs in MEME Format"
              />
              <Box sx={{ marginTop: 2 }}>
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  href="/motifscatalog/complete-factorbook-catalog.meme.gz"
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
                href="/motifscatalog/all-selex-motifs.meme.gz"
                text="Download motifs in MEME Format"
              />
            </Grid2>
          </Grid2>
        </Box>
      </TabPanel>

      {/* Genomic Motif Sites Tab */}
      <TabPanel value={value} index={1}>
        <Typography variant="h4" component="h1" gutterBottom>
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
          expanded={expanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={
              expanded === "panel1" ? <ExpandLessIcon /> : <ExpandMoreIcon />
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
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                This catalog contains sets of MEME motifs from ChIP-seq datasets
                identified within ChIP-seq peaks using FIMO.
              </Typography>

              {/* Buttons */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/merged-motif-sites-lenient"
                    text="Lenient Set"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/merged-motif-sites-moderate"
                    text="Moderate Set"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/merged-motif-sites-stringent"
                    text="Stringent Set"
                  />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Accordion for rDHS Motif Site Catalog */}
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={
              expanded === "panel2" ? <ExpandLessIcon /> : <ExpandMoreIcon />
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
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                This catalog contains sets of MEME motifs and HT-SELEX motifs
                identified within rDHSs from the ENCODE Registry of cCREs using
                FIMO.
              </Typography>

              {/* Buttons */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/rdhs-motif-sites-lenient"
                    text="Lenient Set"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/rdhs-motif-sites-moderate"
                    text="Moderate Set"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledButton
                    startIcon={<InfoIcon />}
                    href="/downloads/rdhs-motif-sites-stringent"
                    text="Stringent Set"
                  />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography variant="h6">Heritability Models</Typography>
        <Typography>
          Motifs discovered using MEME on ChIP-seq experiments and the ZMotif
          neural network on HT-SELEX experiments.
        </Typography>
      </TabPanel>

      <TabPanel value={value} index={3}>
        {/* Download cards from DownloadPage */}
        <Grid container spacing={4}>
          {downloadCards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="white" paragraph>
                    {card.description}
                  </Typography>
                </CardContent>
                <Box textAlign="center" p={2}>
                  <StyledButton text="Go to Downloads" href={card.link} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default DownloadPage;
