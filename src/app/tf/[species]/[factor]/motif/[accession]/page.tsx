'use client'

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  Typography,
  Chip,
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
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { MOTIF_QUERY } from "../../queries";
import { MotifResponse } from "@/components/motifmeme/types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";
import { DNALogo, DNAAlphabet } from "logojs-react";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/motifsearch/motifutil";
import CentralityPlot from "../../../../../../components/motifmeme/centralityplot";
import ATACPlot from "../../../../../../components/motifmeme/atacplot";
import ConservationPlot from "../../../../../../components/motifmeme/conservationplot";
import { TOMTOMMessage } from "../../../../../../components/motifmeme/tomtommessage";
import { HelpRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { Dataset } from "../../_utility/ExperimentSelectionPanel/ExperimentSelectionPanel";
import { DATASETS_QUERY } from "../../_utility/ExperimentSelectionPanel/queries";
import LoadingMotif from "../loading";

// Helper function to convert numbers to scientific notation
function toScientificNotationElement(
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

export default function MotifEnrichmentPage({
  params: { species, factor, accession },
}: {
  params: { species: string; factor: string, accession: string };
}) {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const selectedPeakID = useMemo(() => selectedDataset && selectedDataset.replicated_peaks[0].accession, [selectedDataset]);
  const selectedExperimentID = useMemo(() => selectedDataset && selectedDataset.accession, [selectedDataset]);
  const selectedBiosample = useMemo(() => { return selectedDataset?.biosample }, [selectedDataset])

  const [reverseComplements, setReverseComplements] = useState<boolean[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [exportMotif, setExportMotif] = useState<boolean>(true);
  const [exportLogo, setExportLogo] = useState<boolean>(false);
  const [exportPeakSites, setExportPeakSites] = useState<boolean>(false);
  const [showQCStates, setShowQCStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleSetSelectedDataset = (newDataset: Dataset) => {
    setSelectedDataset(newDataset)
  }

  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10"

  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only("xs"))
  const isSM = useMediaQuery(theme.breakpoints.only("sm"))
  const isMD = useMediaQuery(theme.breakpoints.only("md"))
  const isLG = useMediaQuery(theme.breakpoints.only("lg"))

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  /**
   * This is needed since the data fetch needs the file ID and the URL only contains the experiment accession.
   * This is needed to extract the file ID from the experiment array
   * @todo maybe would be more appropriate to pass selected dataset down in context from the layout versus fetching and metching up
   * the file ID here
   */
  const { data, loading, error } = useQuery(DATASETS_QUERY, {
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
        const urlExp = accession
        const partitionedBiosamples = [...d.peakDataset.partitionByBiosample]
        const foundDataset = urlExp && partitionedBiosamples.flatMap((b) => b.datasets).find((d) => d.accession === urlExp)
        if (foundDataset) {
          handleSetSelectedDataset(foundDataset as Dataset)
        } else {
          const firstExperiment = partitionedBiosamples
            .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
          [0].datasets[0] //extract first experiment
          handleSetSelectedDataset(firstExperiment as Dataset)
        }
      }
    }
  });

  const {
    data: motifData,
    loading: motifLoading,
    error: motifError,
  } = useQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: [selectedPeakID] },
    skip: !selectedPeakID,
  });

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
        ? motifData.target_motifs.filter(tm => tm.motifid === motif.id).slice().sort((a, b) => a.e_value - b.e_value)[0]
        : undefined, // Change `null` to `undefined`
  }));

  if (loading || !selectedPeakID) return LoadingMotif();
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {motifLoading && LoadingMotif()}
      {!motifLoading && motifData && (
        <Stack
          sx={{
            flexGrow: 1,
            maxHeight: '100%',
          }}
          divider={<Divider />}
        >
          <Typography variant="h5" m={2}>
            <span style={{ fontWeight: "bold" }}>
              De novo motif discovery in{" "}
              {selectedBiosample || "Unknown"}{" "}
              ({selectedExperimentID || "Unknown"}) by MEME
            </span>
          </Typography>
          {motifError && <p>Error: {motifError.message}</p>}
          {motifsWithMatches.length > 0 && (
            <Stack
              sx={{ overflowY: "scroll" }}
              divider={<Divider />}
            >
              {motifsWithMatches.map((motif, index) => {
                const motifppm = reverseComplements[index]
                  ? rc(motif.pwm)
                  : motif.pwm;

                const isGreyedOut =
                  poorPeakCentrality(motif) || poorPeakEnrichment(motif);

                return (
                  <Box key={motif.id} m={2}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={12} md={12} lg={7} xl={6}>
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
                          <Table sx={{ border: 0 }}>
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
                                      <HelpRounded sx={{ mr: 1 }} htmlColor="grey" />
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
                                  {motif.e_value ? toScientificNotationElement(motif.e_value) : <div style={{ "display": "inline-flex" }}>{'<'}&nbsp;{toScientificNotationElement(+1e-300)}</div>}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ border: 0 }}>
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
                                <TableCell align="right" sx={{ border: 0 }}>
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
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SwapHorizIcon />}
                        onClick={() => handleReverseComplement(index)}
                      >
                        Reverse Complement
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={showQCStates[motif.id] ? <VisibilityOff /> : <Visibility />}
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
                    {/** @todo deduplicate with download dialog in motifenrichmentselex.tsx */}
                    <Dialog
                      open={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      aria-labelledby="export-dialog-title"
                      slotProps={{
                        backdrop: {
                          sx: {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(2px)",
                          },
                        },
                      }}
                      PaperProps={{
                        sx: {
                          width: "25vw",
                          maxWidth: "90%",
                        },
                      }}
                    >
                      <DialogTitle id="export-dialog-title">
                        Download as
                      </DialogTitle>
                      <DialogContent>
                        <Stack>
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
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (exportMotif) {
                              handleDownload(
                                motif.id,
                                motifppm,
                                svgRefs.current[index]
                              );
                            }
                            if (exportPeakSites) {
                              const speciesGenome = species === "Human" ? "hg38" : "mm10";
                              /**
                               * @todo figure out if this is the correct API url
                               */
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
                        >
                          Download
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      )}
      {!motifLoading && !motifData && (
        <Typography>Select a peak to view motif data</Typography>
      )}

    </>
  )
}