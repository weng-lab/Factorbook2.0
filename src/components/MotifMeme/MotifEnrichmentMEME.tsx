import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Box,
  Divider,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PublicIcon from "@mui/icons-material/Public";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DATASETS_QUERY, MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import {
  DataResponse,
  Dataset,
  MotifResponse,
  ReplicatedPeaks,
} from "@/components/MotifMeme/Types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";
import { DNALogo, DNAAlphabet } from "logojs-react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";

interface MotifEnrichmentMEMEProps {
  factor: string;
  species: string;
}

const MotifEnrichmentMEME: React.FC<MotifEnrichmentMEMEProps> = ({
  factor,
  species,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<number | false>(0);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const assembly = species === "Human" ? "GRCh38" : "mm10";

  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: assembly,
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  const {
    data: motifData,
    loading: motifLoading,
    error: motifError,
  } = useQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: selectedPeak ? [selectedPeak] : [] },
    skip: !selectedPeak,
  });

  useEffect(() => {
    if (data && !selectedPeak) {
      const firstBiosample = data.peakDataset.partitionByBiosample[0];
      const firstDataset = firstBiosample.datasets[0];
      const firstPeakAccession = firstDataset.replicated_peaks[0].accession;
      setSelectedPeak(firstPeakAccession);
      setExpandedAccordion(0);
    }
  }, [data, selectedPeak]);

  const handleAccessionClick = (peakAccession: string, index: number) => {
    setSelectedPeak(peakAccession);
    setExpandedAccordion(index);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const sortedBiosamples = [
    ...(data?.peakDataset.partitionByBiosample || []),
  ].sort((a, b) => {
    if (a.biosample.name < b.biosample.name) return -1;
    if (a.biosample.name > b.biosample.name) return 1;
    return 0;
  });

  const filteredBiosamples = sortedBiosamples.filter((biosample) =>
    biosample.biosample.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid xs={3} sx={{ height: "100%", overflowY: "auto" }}>
          <Box mb={2}>
            <TextField
              label="Search Biosamples"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <List>
            {filteredBiosamples.map((biosample, index) => (
              <Accordion
                key={index}
                expanded={expandedAccordion === index}
                onChange={() =>
                  setExpandedAccordion(
                    expandedAccordion === index ? false : index
                  )
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {biosample.biosample.name}
                  </Typography>
                  <Chip
                    label={`${biosample.counts.total} exp`}
                    style={{
                      backgroundColor: "#8169BF",
                      color: "white",
                      marginLeft: "auto",
                    }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {biosample.datasets.map((dataset: Dataset, idx: number) =>
                      dataset.replicated_peaks.map(
                        (peak: ReplicatedPeaks, peakIdx: number) => (
                          <ListItem
                            key={`${idx}-${peakIdx}`}
                            style={{
                              paddingLeft: "30px",
                              cursor: "pointer",
                              backgroundColor:
                                selectedPeak === peak.accession
                                  ? "#D3D3D3"
                                  : "transparent",
                              fontWeight:
                                selectedPeak === peak.accession
                                  ? "bold"
                                  : "normal",
                            }}
                            onClick={() =>
                              handleAccessionClick(peak.accession, index)
                            }
                          >
                            <ListItemText
                              primary={`${dataset.lab.friendly_name} (${dataset.accession})`}
                            />
                          </ListItem>
                        )
                      )
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Grid>

        <Grid xs={9} sx={{ paddingLeft: 2, overflowY: "auto", height: "100%" }}>
          {motifLoading && <CircularProgress />}
          {motifError && <p>Error: {motifError.message}</p>}
          {motifData &&
            motifData.meme_motifs &&
            motifData.meme_motifs.length > 0 && (
              <Box>
                {motifData.meme_motifs.map((motif, index) => (
                  <Box key={motif.id} mb={4}>
                    <Grid container spacing={2}>
                      <Grid xs={8}>
                        <DNALogo
                          ppm={motif.pwm}
                          alphabet={DNAAlphabet}
                          ref={(el: SVGSVGElement | null) =>
                            (svgRefs.current[index] = el)
                          }
                          width={400}
                          height={250}
                        />
                        <Box display="flex" mt={2} gap={2}>
                          <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            sx={{
                              backgroundColor: "#8169BF",
                              borderRadius: "24px",
                              textTransform: "none",
                              fontWeight: "medium",
                              "&:hover": {
                                backgroundColor: "#8169BF",
                              },
                            }}
                          >
                            Download
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<SwapHorizIcon />}
                            sx={{
                              borderColor: "#8169BF",
                              color: "#8169BF",
                              backgroundColor: "white",
                              borderRadius: "24px",
                              textTransform: "none",
                              fontWeight: "medium",
                              "&:hover": {
                                backgroundColor: "white",
                                borderColor: "#8169BF",
                              },
                            }}
                          >
                            Reverse Complement
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<PublicIcon />}
                            sx={{
                              borderColor: "#8169BF",
                              color: "#8169BF",
                              backgroundColor: "white",
                              borderRadius: "24px",
                              textTransform: "none",
                              fontWeight: "medium",
                              "&:hover": {
                                backgroundColor: "white",
                                borderColor: "#8169BF",
                              },
                            }}
                          >
                            Show Genomic Sites
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            sx={{
                              borderColor: "#8169BF",
                              color: "#8169BF",
                              backgroundColor: "white",
                              borderRadius: "24px",
                              textTransform: "none",
                              fontWeight: "medium",
                              justifyContent: "center",
                              height: "100%",
                              "&:hover": {
                                backgroundColor: "white",
                                borderColor: "#8169BF",
                              },
                            }}
                          >
                            Show QC
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: "16px",
                            height: "auto",
                            width: "100%",
                            maxWidth: "250px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            margin: "0 auto",
                          }}
                        >
                          {/* E-value Section */}
                          <Box
                            display="flex"
                            alignItems="center"
                            mb={2}
                            width="100%"
                          >
                            <Tooltip
                              title="The statistical significance of the motif. The E-value is an estimate of
              the expected number that one would find in a similarly sized set of
              random sequences (sequences where each position is independent and
              letters are chosen according to the background letter frequencies)."
                            >
                              <HelpOutlineIcon
                                fontSize="medium"
                                sx={{ marginRight: 1 }}
                              />
                            </Tooltip>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
                            >
                              <b>E-value:</b> {motif.e_value}
                            </Typography>
                          </Box>

                          {/* Divider */}
                          <Divider sx={{ width: "100%", mb: 2 }} />

                          {/* Occurrences Section */}
                          <Box display="flex" alignItems="center" width="100%">
                            <Tooltip
                              title="The number of optimal IDR thresholded peaks which contained at least one
              occurrence of this motif according to FIMO."
                            >
                              <HelpOutlineIcon
                                fontSize="medium"
                                sx={{ marginRight: 1 }}
                              />
                            </Tooltip>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
                            >
                              <b>Occurrences:</b>{" "}
                              {motif.original_peaks_occurrences.toLocaleString()}{" "}
                              / {motif.original_peaks.toLocaleString()} peaks
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                    <Divider style={{ margin: "20px 0" }} />
                  </Box>
                ))}
              </Box>
            )}
          {!motifLoading && !motifData && (
            <Typography>Select a peak to view motif data</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotifEnrichmentMEME;
