import React, { useState, useRef, useEffect, MutableRefObject, useMemo } from "react";
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
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PublicIcon from "@mui/icons-material/Public";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { DATASETS_QUERY, MOTIF_QUERY } from "@/components/motifmeme/queries";
import {
  DataResponse,
  Dataset,
  MotifResponse,
  ReplicatedPeaks,
} from "@/components/motifmeme/types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";
import { DNALogo, DNAAlphabet } from "logojs-react";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/motifsearch/motifutil";
import CentralityPlot from "./centralityplot";
import ATACPlot from "./atacplot";
import ConservationPlot from "./conservationplot";
import { TOMTOMMessage } from "./tomtommessage";
import { HelpRounded } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const selectedPeakID = useMemo(() => selectedDataset && selectedDataset.replicated_peaks[0].accession, [selectedDataset]);
  const selectedExperimentID = useMemo(() => selectedDataset && selectedDataset.accession, [selectedDataset]);
  const [reverseComplements, setReverseComplements] = useState<boolean[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [exportMotif, setExportMotif] = useState<boolean>(true);
  const [exportLogo, setExportLogo] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [exportPeakSites, setExportPeakSites] = useState<boolean>(false);
  const [showQCStates, setShowQCStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleSetSelectedDataset = (newDataset: Dataset) => {
    setSelectedDataset(newDataset)
    if (searchParams.get("experiment") !== newDataset.accession){
      router.push(pathname + `?experiment=${newDataset.accession}`)
    }
  }

  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";

  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only("xs"));
  const isSM = useMediaQuery(theme.breakpoints.only("sm"));
  const isMD = useMediaQuery(theme.breakpoints.only("md"));
  const isLG = useMediaQuery(theme.breakpoints.only("lg"));
  const isXL = useMediaQuery(theme.breakpoints.only("xl"));

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: assembly,
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
    onCompleted: (d) => {
      //if there's a url experiment passed, initialize selectedDataset with that, else set to first
      if (!selectedDataset) {
        const urlExp = searchParams.get('experiment')
        const partitionedBiosamples = [...d.peakDataset.partitionByBiosample]
        const foundDataset = urlExp && partitionedBiosamples.flatMap((b) => b.datasets).find((d) => d.accession === urlExp)
        if (foundDataset) {
          handleSetSelectedDataset(foundDataset)
        } else {
          console.log(d)
          const firstExperiment = partitionedBiosamples
            .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
            [0].datasets[0] //extract first experiment
          handleSetSelectedDataset(firstExperiment)
        }
      }
    }
  });

  const {
    data: motifData,
    loading: motifLoading,
    error: motifError,
  } = useQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: [selectedPeakID]},
    skip: !selectedPeakID,
  });

  const sortedBiosamples = [
    ...(data?.peakDataset.partitionByBiosample || []),
  ].sort((a, b) => {
    return a.biosample.name.localeCompare(b.biosample.name);
  });

  const filteredBiosamples = sortedBiosamples.filter((biosample) =>
    biosample.biosample.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * @todo the better way to do this would be to have each motif tile have it's own state, versus tracking the state of each
   * in the parent like this. No reason for the state to be lifted up like this (I think)
   */
  useEffect(() => {
    if (motifData && motifData.meme_motifs) {
      setReverseComplements(
        new Array(motifData.meme_motifs.length).fill(false)
      );
    }
  }, [motifData]);

  const handleExperimentClick = (peakDataset: Dataset) => {
    handleSetSelectedDataset(peakDataset)
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
      // No need for MutableRefObject here; just pass the svgElement directly
      downloadSVGElementAsSVG({ current: svgElement }, `${name}-logo.svg`);
    }

    setIsDialogOpen(false);
  };

  // Sort the motifs so that those with either poor peak centrality or enrichment are at the bottom
  const sortedMotifs = [...(motifData?.meme_motifs || [])].sort((a, b) => b.flank_z_score + b.shuffled_z_score - a.flank_z_score - a.shuffled_z_score);
  
  // Map meme_motifs with target_motifs (tomtomMatch) by index
  const motifsWithMatches = sortedMotifs.map((motif, index) => ({
    ...motif,
    tomtomMatch:
    motifData?.target_motifs && motifData.target_motifs[index]
    ? motifData.target_motifs.filter(tm=>tm.motifid===motif.id).slice().sort((a, b) => a.e_value - b.e_value)[0]
    : undefined, // Change `null` to `undefined`
  }));
  
  const selectedBiosample = useMemo(() => {
    return sortedBiosamples.find(x => x.datasets.some(y => y.accession === selectedExperimentID))?.biosample.name
  }, [sortedBiosamples, selectedDataset, selectedExperimentID])
  
  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        padding: "5px",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden", // Fix extra white space issue
      }}
    >
      {!drawerOpen && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: "50%", // Center the button vertically
            left: 0,
            transform: "translateY(-50%)", // Adjust centering
            zIndex: 2000,
            backgroundColor: "white",
            color: "#8169BF",
            borderRadius: "50%",
            boxShadow: 3,
          }}
        >
          <ArrowForwardIosIcon /> {/* Right-facing arrow for expanding */}
        </IconButton>
      )}

      {/* Left-side Drawer */}
      <Box
        sx={{
          width: drawerOpen ? { xs: "100%", md: "25%" } : 0, // Same width as before
          height: "100vh", // Respect header/footer
          position: "relative", // Not fixed, part of the layout
          overflowY: "auto", // Allow scrolling of drawer content
          transition: "width 0.3s ease", // Smooth transition when opening/closing
          paddingRight: drawerOpen ? { md: "10px" } : 0,
          backgroundColor: "white",
          borderRight: drawerOpen ? "1px solid #ccc" : "none", // Show border when open
        }}
      >
        {drawerOpen && (
          <Box>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                backgroundColor: "white",
                padding: "16px",
                borderBottom: "1px solid #ccc", // Divider between search bar and list
                display: "flex",
                alignItems: "center",
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
                    "& fieldset": { borderColor: "#8169BF" },
                  },
                }}
              />
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{
                  marginLeft: 2,
                  backgroundColor: "#8169BF",
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <List sx={{ padding: "16px" }}>
              {filteredBiosamples.map((biosample, index) => (
                <Accordion
                  key={Math.random()}
                  defaultExpanded={!!(selectedDataset && biosample.datasets.some(x => x.accession === selectedExperimentID))}
                >
                  <AccordionSummary
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
                                  selectedDataset?.accession === dataset.accession
                                    ? "#D3D3D3"
                                    : "transparent",
                                fontWeight:
                                  selectedDataset?.accession === dataset.accession
                                    ? "bold"
                                    : "normal",
                              }}
                              onClick={() => handleExperimentClick(dataset)}
                            >
                              <ListItemText primary={`${dataset.accession}`} />
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
          marginLeft: drawerOpen ? { xs: 0 } : 0, // Adjust margin when drawer is open
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

              const isGreyedOut =
                poorPeakCentrality(motif) || poorPeakEnrichment(motif);

              return (
                <Box key={motif.id} mb={4}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={7} xl={6}>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "bold" }}>
                          De novo motif discovery in{" "}
                          {selectedBiosample || "Unknown"}{" "}
                          ({selectedExperimentID || "Unknown"}) by MEME
                        </span>
                      </Typography>
                      {poorPeakCentrality(motif) && (
                        <Chip
                          icon={<HelpOutlineIcon />}
                          label="Poor Peak Centrality"
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
                          icon={<HelpOutlineIcon />}
                          label="Poor Peak Enrichment"
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
                          width={
                            (isXS || isSM) ? 290
                              : isMD ? 348
                                : isLG ? 406
                                  : 522
                          }
                          height={
                            (isXS || isSM) ? 127
                              : isMD ? 152
                                : isLG ? 178
                                  : 229
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={5} xl={6}>
                      <Paper
                        elevation={2}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                          borderRadius: "16px",
                        }}
                      >
                        <Table sx={{border: 0}}>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Tooltip
                                    title={
                                      <Typography>
                                        The statistical significance of the
                                        motif. The E-value is an estimate of the
                                        expected number that one would find in a
                                        similarly sized set of random sequences.
                                      </Typography>
                                    }
                                  >
                                    <HelpRounded sx={{ mr: 1 }} htmlColor="grey"/>
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
                              {motif.e_value ? toScientificNotationElement(motif.e_value) : <div style={{"display": "inline-flex" }}>{'<'}&nbsp;{toScientificNotationElement(+1e-300)}</div> }
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{border: 0}}>
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
                                    <HelpRounded htmlColor="grey" sx={{ marginRight: 1 }} />
                                  </Tooltip>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Occurrences
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right" sx={{border: 0}}>
                                {motif.original_peaks_occurrences.toLocaleString()}{" "}
                                / {motif.original_peaks.toLocaleString()} peaks
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </Grid>
                  </Grid>

                  <TOMTOMMessage tomtomMatch={motif.tomtomMatch} />

                  <Box
                    display="flex"
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
                        flex: 1,
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
                        flex: 1,
                      }}
                      onClick={() => handleReverseComplement(index)}
                    >
                      Reverse Complement
                    </Button>

                    {/* <Button
                      variant="text"
                      startIcon={<PublicIcon />}
                      sx={{
                        borderRadius: "20px",
                        borderColor: "#8169BF",
                        color: "#8169BF",
                        backgroundColor: "white",
                        flex: 1,
                        minWidth: "20%",
                      }}
                    >
                      Show Genomic Sites
                    </Button> */}

                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderRadius: "20px",
                        borderColor: "#8169BF",
                        color: "#8169BF",
                        backgroundColor: "white",
                        flex: 1,
                      }}
                      onClick={() => toggleShowQC(motif.id)}
                    >
                      {showQCStates[motif.id] ? "Hide QC" : "Show QC"}
                    </Button>
                  </Box>

                  {showQCStates[motif.id] && selectedPeakID && (
                    <Box mt={3}>
                      <Grid container spacing={2} mt={3}>
                        <Grid item xs={12} md={6}>
                          <CentralityPlot
                            peak_centrality={motif.peak_centrality}
                            width={isMobile ? 300 : 500}
                            height={isMobile ? 150 : 300}
                          />
                        </Grid>
                        {motif.atac_data &&
                          Array.isArray(motif.atac_data) &&
                          motif.atac_data.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <ATACPlot
                                name={motif.name}
                                accession={selectedPeakID}
                                pwm={motifppm}
                              />
                            </Grid>
                          )}
                        <Grid item xs={12} md={6}>
                          <ConservationPlot
                            name={motif.name}
                            accession={selectedPeakID}
                            pwm={motifppm}
                            width={isMobile ? 300 : 500}
                            height={isMobile ? 150 : 300}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Dialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    aria-labelledby="export-dialog-title"
                    slotProps={{
                      backdrop: {
                        sx: {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                        },
                      },
                    }}
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
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={exportPeakSites}
                            onChange={(e) =>
                              setExportPeakSites(e.target.checked)
                            }
                            sx={{ color: "#8169BF" }}
                          />
                        }
                        label="Peak Sites"
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
                        onClick={() => {
                          if (exportMotif) {
                            handleDownload(
                              motif.id,
                              motifppm,
                              svgRefs.current[index]
                            );
                          }
                          if (exportPeakSites) {
                            const speciesGenome =
                              species === "Human" ? "hg38" : "mm10";
                            const downloadUrl = `https://screen-beta-api.wenglab.org/factorbook_downloads/hq-occurrences/${selectedPeakID}_${motif.name}.gz`;
                            const link = document.createElement("a");
                            link.href = downloadUrl;
                            link.download = `${selectedPeakID}_${motif.name}_${speciesGenome}.gz`;
                            link.click();
                          }
                          if (exportLogo && svgRefs.current[index]) {
                            downloadSVGElementAsSVG(
                              { current: svgRefs.current[index] },
                              `${motif.name}-logo.svg`
                            );
                          }
                          setIsDialogOpen(false);
                        }}
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
