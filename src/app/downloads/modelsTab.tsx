import StyledButton from "@/components/styledbutton";
import { Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Popup, { motifRows, peaksRows } from "./popup";

export default function ModelsTab() {
  return (
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
      <Divider sx={{ mb: 2 }} />
      <GettingStarted />
      <ViewModels />
    </Box>
  )
}

function GettingStarted() {
  return (
    <div style={{ marginBottom: '16px' }}>
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
                style={{ textDecoration: "underline" }}
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
    </div >
  )
}

function ViewModels() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  return (
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
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    TF ChIP-seq Peaks
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 5 }}>
                    Quantify heritability enrichment within TF peaks
                    identified from ChIP-seq experiments in one of five
                    well-profiled ENCODE cell lines.
                  </Typography>
                  <StyledButton
                    text={`View Models (${peaksRows.length})`}
                    href=""
                    sx={{ width: "auto" }}
                    onClick={() => { setContent("peaks"); setOpen(true) }}
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
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    Motif Sites in TF ChIP-seq Peaks
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 5 }}>
                    Quantify heritability enrichment within TF motif sites
                    identified in peaks from ChIP-seq experiments in one of
                    five well-profiled ENCODE cell lines.
                  </Typography>
                  <StyledButton
                    text={`View Models (${motifRows.length})`}
                    sx={{ width: "auto" }}
                    onClick={() => { setContent("motif"); setOpen(true) }}
                    href={""} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Popup content={content} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
