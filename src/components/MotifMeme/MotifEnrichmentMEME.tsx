import React, { useState, useRef, useEffect, MutableRefObject } from "react";
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
  Paper,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PublicIcon from "@mui/icons-material/Public";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoIcon from "@mui/icons-material/Info";
import { DATASETS_QUERY, MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import {
  DataResponse,
  Dataset,
  MotifResponse,
  ReplicatedPeaks,
  TOMTOMMatch,
} from "@/components/MotifMeme/Types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";
import { DNALogo, DNAAlphabet } from "logojs-react";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/MotifSearch/MotifUtil";
import CentralityPlot from "./CenrtralityPlot";
import ATACPlot from "./ATACPlot";
import ConservationPlot from "./ConservationPlot";
import { TOMTOMMessage } from "./TOMTOMMessage";

// Helper function to convert numbers to scientific notation
export function toScientificNotationElement(
  num: number,
  variant:
    | "body1"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "caption"
    | "overline" = "body1",
  sigFigs = 2
) {
  const scientific = num.toExponential(sigFigs);
  const [coefficient, exponent] = scientific.split("e");
  return (
    <Typography variant={variant}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
}

// Check for poor peak centrality based on motif properties
const poorPeakCentrality = (motif: any): boolean =>
  motif.flank_z_score < 0 || motif.flank_p_value > 0.05;

// Check for poor peak enrichment based on motif properties
const poorPeakEnrichment = (motif: any): boolean =>
  motif.shuffled_z_score < 0 || motif.shuffled_p_value > 0.05;

interface MotifEnrichmentMEMEProps {
  factor: string;
  species: string;
}

const MotifEnrichmentMEME: React.FC<MotifEnrichmentMEMEProps> = ({
  factor,
  species,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<number | false>(0);
  const [reverseComplements, setReverseComplements] = useState<boolean[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [exportMotif, setExportMotif] = useState<boolean>(true);
  const [exportLogo, setExportLogo] = useState<boolean>(false);
  const [showQCStates, setShowQCStates] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  useEffect(() => {
    if (motifData && motifData.meme_motifs) {
      setReverseComplements(
        new Array(motifData.meme_motifs.length).fill(false)
      );
    }
  }, [motifData]);

  const handleAccessionClick = (peakAccession: string, index: number) => {
    setSelectedPeak(peakAccession);
    setExpandedAccordion(index);
  };

  const handleReverseComplement = (index: number) => {
    setReverseComplements((prev) =>
      prev.map((rc, i) => (i === index ? !rc : rc))
    );
  };

  const toggleShowQC = (motifId: string) => {
    setShowQCStates((prevState) => ({
      ...prevState,
      [motifId]: !prevState[motifId],
    }));
  };

  const handleDownload = async (
    name: string,
    ppm: number[][],
    svgElement: SVGSVGElement | null
  ) => {
    if (exportMotif) {
      downloadData(
        meme([
          {
            accession: name,
            pwm: ppm,
            factor: "",
            dbd: "",
            color: "",
            coordinates: [0, 0],
          } as MMotif,
        ]),
        `${name}.meme`
      );
    }

    if (exportLogo && svgElement) {
      const ref = { current: svgElement } as MutableRefObject<SVGSVGElement>;
      downloadSVGElementAsSVG(ref, `${name}-logo.svg`);
    }

    setIsDialogOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  // Sort the motifs so that those with poor metrics are at the bottom
  const sortedMotifs = [...(motifData?.meme_motifs || [])].sort((a, b) => {
    const aPoor = poorPeakCentrality(a) || poorPeakEnrichment(a);
    const bPoor = poorPeakCentrality(b) || poorPeakEnrichment(b);
    return aPoor === bPoor ? 0 : aPoor ? 1 : -1;
  });

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

  // Map meme_motifs with target_motifs (tomtomMatch) by index
  const motifsWithMatches =
    motifData?.meme_motifs.map((motif, index) => ({
      ...motif,
      tomtomMatch:
        motifData?.target_motifs && motifData.target_motifs[index]
          ? motifData.target_motifs[index]
          : undefined, // Change `null` to `undefined`
    })) || [];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        padding: "5px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          overflowY: "auto",
          paddingRight: { md: "10px" },
          paddingBottom: { xs: "10px", md: "0" },
        }}
      >
        <Box mb={2}>
          <TextField
            label="Search Biosamples"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(129, 105, 191, 0.09)", // #8169BF with 9% opacity
                borderRadius: "50px", // Circular shape
                paddingLeft: "20px", // Adds some padding
              },
            }}
            sx={{
              marginTop: "5px", // Adds a 5px margin to the top to fix label alignment
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8169BF", // Set border color to match background
                },
                "&:hover fieldset": {
                  borderColor: "#8169BF", // Set border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8169BF", // Set border color when focused
                },
              },
            }}
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
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: { xs: "100%", md: "1px" },
          height: { xs: "1px", md: "auto" },
          backgroundColor: "#ccc",
          marginRight: { md: "10px" },
          marginLeft: { md: "10px" },
          marginY: { xs: "10px", md: "0" },
        }}
      />

      {/* Right Side */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingLeft: { md: "10px" },
        }}
      >
        {motifLoading && <CircularProgress />}
        {motifError && <p>Error: {motifError.message}</p>}
        {motifsWithMatches.length > 0 && (
          <Box>
            {motifsWithMatches.map((motif, index) => {
              const motifppm = reverseComplements[index]
                ? rc(motif.pwm)
                : motif.pwm;

              // Determine if the motif should be greyed out
              const isGreyedOut =
                poorPeakCentrality(motif) || poorPeakEnrichment(motif);

              return (
                <Box key={motif.id} mb={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      {/* Add indicators for poor peak centrality and enrichment */}
                      {poorPeakCentrality(motif) && (
                        <Chip
                          icon={<ErrorOutlineIcon />}
                          label="poor peak centrality"
                          sx={{
                            backgroundColor: "rgba(255, 165, 0, 0.1)",
                            color: "#FFA500",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            padding: "5px",
                            marginBottom: "8px",
                          }}
                        />
                      )}
                      {poorPeakEnrichment(motif) && (
                        <Chip
                          icon={<InfoIcon />}
                          label="poor peak enrichment"
                          sx={{
                            backgroundColor: "rgba(75, 0, 130, 0.1)",
                            color: "#4B0082",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            padding: "5px",
                            marginBottom: "8px",
                            marginLeft: "8px",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          opacity: isGreyedOut ? 0.5 : 1,
                          filter: isGreyedOut ? "brightness(50%)" : "none",
                        }}
                      >
                        <DNALogo
                          ppm={motifppm}
                          alphabet={DNAAlphabet}
                          ref={(el: SVGSVGElement | null) =>
                            (svgRefs.current[index] = el)
                          }
                          width={400}
                          height={250}
                        />
                      </Box>

                      {/* TOMTOMMessage component */}
                      <TOMTOMMessage tomtomMatch={motif.tomtomMatch} />

                      <Box display="flex" mt={2} gap={2}>
                        <Button
                          variant="contained"
                          startIcon={<SaveAltIcon />}
                          onClick={() => setIsDialogOpen(true)}
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "#8169BF",
                            color: "white",
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<SwapHorizIcon />}
                          onClick={() => handleReverseComplement(index)}
                          sx={{
                            borderRadius: "20px",
                            borderColor: "#8169BF",
                            color: "#8169BF",
                            backgroundColor: "white",
                            marginRight: 2,
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
                            "&:hover": {
                              backgroundColor: "white",
                              borderColor: "#8169BF",
                            },
                          }}
                          onClick={() => toggleShowQC(motif.id)} // Toggle QC visibility for this specific motif
                        >
                          {showQCStates[motif.id] ? "Hide QC" : "Show QC"}
                        </Button>
                      </Box>

                      {showQCStates[motif.id] && selectedPeak && (
                        <Box mt={3}>
                          <Grid
                            container
                            spacing={2}
                            mt={3}
                            justifyContent="space-between"
                          >
                            {/* Centrality Plot */}
                            <Grid item xs={12} md={6}>
                              <CentralityPlot
                                peak_centrality={motif.peak_centrality}
                                width={500}
                                height={300}
                              />
                            </Grid>

                            {/* Conditionally render ATACPlot */}
                            {motif.atac_data &&
                              Array.isArray(motif.atac_data) &&
                              motif.atac_data.length > 0 && (
                                <Grid item xs={12} md={6}>
                                  <ATACPlot
                                    name={motif.name}
                                    accession={selectedPeak}
                                    pwm={motifppm}
                                  />
                                </Grid>
                              )}

                            {/* Conservation Plot */}
                            <Grid item xs={12} md={6}>
                              <ConservationPlot
                                name={motif.name}
                                accession={selectedPeak}
                                pwm={motifppm}
                                width={500}
                                height={300}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                      <Dialog
                        open={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        aria-labelledby="export-dialog-title"
                      >
                        <DialogTitle id="export-dialog-title">
                          Download as
                        </DialogTitle>
                        <DialogContent>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={exportMotif}
                                onChange={(e) =>
                                  setExportMotif(e.target.checked)
                                }
                                sx={{ color: "#8169BF" }}
                              />
                            }
                            label="Motif (MEME)"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={exportLogo}
                                onChange={(e) =>
                                  setExportLogo(e.target.checked)
                                }
                                sx={{ color: "#8169BF" }}
                              />
                            }
                            label="Logo"
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setIsDialogOpen(false)}
                            sx={{ color: "#8169BF" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() =>
                              handleDownload(
                                motif.id,
                                motifppm,
                                svgRefs.current[index]
                              )
                            }
                            sx={{
                              borderRadius: "20px",
                              backgroundColor: "#8169BF",
                              color: "white",
                            }}
                          >
                            Download
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={3}
                        sx={{
                          padding: "16px",
                          height: "auto",
                          width: "100%",
                          maxWidth: "350px",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          margin: "0 auto",
                          backgroundColor: "white",
                        }}
                      >
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Tooltip
                                    title={
                                      <Typography sx={{ fontSize: "1rem" }}>
                                        The statistical significance of the
                                        motif. The E-value is an estimate of the
                                        expected number that one would find in a
                                        similarly sized set of random sequences.
                                      </Typography>
                                    }
                                  >
                                    <HelpOutlineIcon
                                      fontSize="small"
                                      sx={{ marginRight: 1 }}
                                    />
                                  </Tooltip>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    E-value
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {toScientificNotationElement(motif.e_value)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Tooltip
                                    title={
                                      <Typography sx={{ fontSize: "1rem" }}>
                                        The number of optimal IDR thresholded
                                        peaks which contained at least one
                                        occurrence of this motif according to
                                        FIMO.
                                      </Typography>
                                    }
                                  >
                                    <HelpOutlineIcon
                                      fontSize="small"
                                      sx={{ marginRight: 1 }}
                                    />
                                  </Tooltip>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Occurrences
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {motif.original_peaks_occurrences.toLocaleString()}{" "}
                                / {motif.original_peaks.toLocaleString()} peaks
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Divider style={{ margin: "20px 0" }} />
                </Box>
              );
            })}
          </Box>
        )}
        {!motifLoading && !motifData && (
          <Typography>Select a peak to view motif data</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MotifEnrichmentMEME;
