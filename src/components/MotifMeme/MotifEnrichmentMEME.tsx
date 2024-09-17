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
  Drawer,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PublicIcon from "@mui/icons-material/Public";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { DATASETS_QUERY, MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import {
  DataResponse,
  Dataset,
  MotifResponse,
  ReplicatedPeaks,
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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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

// Add custom colors to Alphabet A and T
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
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

  // Sort the motifs so that those with either poor peak centrality or enrichment are at the bottom
  const sortedMotifs = [...(motifData?.meme_motifs || [])].sort((a, b) => {
    const aIsPoor = poorPeakCentrality(a) || poorPeakEnrichment(a);
    const bIsPoor = poorPeakCentrality(b) || poorPeakEnrichment(b);

    if (aIsPoor && !bIsPoor) return 1; // Move 'a' down if it's poor but 'b' isn't
    if (!aIsPoor && bIsPoor) return -1; // Move 'b' down if it's poor but 'a' isn't
    return 0; // Otherwise, keep them in the same order
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
  const motifsWithMatches = sortedMotifs.map((motif, index) => ({
    ...motif,
    tomtomMatch:
      motifData?.target_motifs && motifData.target_motifs[index]
        ? motifData.target_motifs[index]
        : undefined, // Change `null` to `undefined`
  }));

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)", // Respect header/footer
        display: "flex",
        padding: "5px",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden", // Fix extra white space issue
      }}
    >
      {/* IconButton to toggle drawer - always visible */}
      <IconButton
        onClick={() => setDrawerOpen(!drawerOpen)}
        sx={{
          position: "fixed",
          top: "50%", // Center the button vertically
          left: 0,
          transform: "translateY(-50%)", // Adjust centering
          zIndex: 2000,
          backgroundColor: "white", // Ensure visibility
          color: "#8169BF",
          borderRadius: "50%",
          boxShadow: 3,
        }}
      >
        {drawerOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Left-side Drawer (Respects header and footer) */}
      <Box
        sx={{
          width: drawerOpen ? { xs: "100%", md: "25%" } : 0, // Same width as before
          height: "calc(100vh - 128px)", // Respect header/footer
          marginTop: "64px", // Below header
          marginBottom: "64px", // Above footer
          position: "relative", // Not fixed, part of the layout
          overflowY: "auto", // Allow scrolling of drawer content
          transition: "width 0.3s ease", // Smooth transition when opening/closing
          paddingRight: { md: "10px" },
          paddingBottom: { xs: "10px", md: "0" },
          backgroundColor: "white",
          borderRight: drawerOpen ? "1px solid #ccc" : "none", // Show border when open
        }}
      >
        {drawerOpen && (
          <Box>
            {/* Sticky Search Bar */}
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                backgroundColor: "white",
                padding: "16px",
                borderBottom: "1px solid #ccc", // Divider between search bar and list
              }}
            >
              <TextField
                label="Search Biosamples"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  sx: {
                    backgroundColor: "rgba(129, 105, 191, 0.09)",
                    borderRadius: "50px",
                    paddingLeft: "20px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#8169BF",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8169BF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8169BF",
                    },
                  },
                }}
              />
            </Box>

            {/* Scrollable Biosample List */}
            <List sx={{ padding: "16px" }}>
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
        )}
      </Box>

      {/* Right-side Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: drawerOpen ? { xs: 0, md: "25%" } : 0, // Adjust margin when drawer is open
          transition: "margin-left 0.3s ease", // Smooth transition for content shift
          padding: "16px",
          overflowY: "auto", // Scrollable right-side content
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
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
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
                    </Grid>

                    {/* E-value and Occurrences table */}
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          padding: "16px",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "0 auto",
                          width: "60%",
                          backgroundColor: "white",
                          borderRadius: "16px", // Adding rounded corners
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

                  {/* TOMTOMMessage component */}
                  <TOMTOMMessage tomtomMatch={motif.tomtomMatch} />

                  {/* Button controls */}
                  {/* Buttons aligned side by side */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      startIcon={<SaveAltIcon />}
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "#8169BF",
                        color: "white",
                        flex: 1, // Ensures each button takes up equal space
                        minWidth: "20%", // Ensure each button is at least 20% width
                      }}
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Download
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<SwapHorizIcon />}
                      sx={{
                        borderRadius: "20px",
                        borderColor: "#8169BF",
                        color: "#8169BF",
                        backgroundColor: "white",
                        flex: 1, // Equal width distribution
                        minWidth: "20%", // Ensure each button is at least 20% width
                      }}
                      onClick={() => handleReverseComplement(index)}
                    >
                      Reverse Complement
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<PublicIcon />}
                      sx={{
                        borderRadius: "20px",
                        borderColor: "#8169BF",
                        color: "#8169BF",
                        backgroundColor: "white",
                        flex: 1, // Equal width distribution
                        minWidth: "20%", // Ensure each button is at least 20% width
                      }}
                    >
                      Show Genomic Sites
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderRadius: "20px",
                        borderColor: "#8169BF",
                        color: "#8169BF",
                        backgroundColor: "white",
                        flex: 1, // Equal width distribution
                        minWidth: "20%", // Ensure each button is at least 20% width
                      }}
                      onClick={() => toggleShowQC(motif.id)}
                    >
                      {showQCStates[motif.id] ? "Hide QC" : "Show QC"}
                    </Button>
                  </Box>

                  {/* QC Plots */}
                  {showQCStates[motif.id] && selectedPeak && (
                    <Box mt={3}>
                      <Grid
                        container
                        spacing={2}
                        mt={3}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12} md={6}>
                          <CentralityPlot
                            peak_centrality={motif.peak_centrality}
                            width={500}
                            height={300}
                          />
                        </Grid>
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
                            onChange={(e) => setExportMotif(e.target.checked)}
                            sx={{ color: "#8169BF" }}
                          />
                        }
                        label="Motif (MEME)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={exportLogo}
                            onChange={(e) => setExportLogo(e.target.checked)}
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
