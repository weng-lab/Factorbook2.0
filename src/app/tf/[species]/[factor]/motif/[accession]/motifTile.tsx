import { Box, Table, Chip, Grid, Paper, Typography, Tooltip, TableCell, TableRow, TableBody, Button, Dialog, DialogTitle, DialogContent, Stack, FormControlLabel, Checkbox, DialogActions, useMediaQuery, useTheme } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { DNALogo, DNAAlphabet } from "logojs-react";
import { HelpRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FullScreenDialog from "./genomicsites";
import CentralityPlot from "@/components/motifmeme/centralityplot";
import ConservationPlot from "@/components/motifmeme/conservationplot";
import { useEffect, useMemo, useRef, useState } from "react";
import ATACPlot from "@/components/motifmeme/atacplot";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif, rc } from "@/components/motifsearch/motifutil";
import { TOMTOMMessage } from "@/components/motifmeme/tomtommessage";

// Check for poor peak centrality based on motif properties
const poorPeakCentrality = (motif: any): boolean =>
    motif.flank_z_score < 0 || motif.flank_p_value > 0.05;

// Check for poor peak enrichment based on motif properties
const poorPeakEnrichment = (motif: any): boolean =>
    motif.shuffled_z_score < 0 || motif.shuffled_p_value > 0.05;

function logLikelihood(backgroundFrequencies: number[]): (r: number[]) => number[] {
    return (r: number[]): number[] => {
        let sum = 0.0;
        r.map((x, i) => (sum += x === 0 ? 0 : x * Math.log2(x / (backgroundFrequencies[i] || 0.01))));
        return r.map(x => x * sum);
    };
}

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

export default function MotifTile({ motif, index, species, selectedExperimentID, selectedPeakID }: { motif: any, index: number, species: string, selectedExperimentID: string, selectedPeakID: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [motifppm, setMotifppm] = useState(motif.pwm);
    const [showQCStates, setShowQCStates] = useState(false);
    const [reverseComplement, setReverseComplement] = useState(false);
    const backgroundFrequencies = motif.background_frequencies || motifppm[0].map((_: any) => 1.0 / motifppm[0].length);
    const ll = logLikelihood(backgroundFrequencies);
    const pwm = useMemo(() => motifppm.map(ll), [motifppm]);

    const isGreyedOut =
        poorPeakCentrality(motif) || poorPeakEnrichment(motif);

    // Theme
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.only("xs"))
    const isSM = useMediaQuery(theme.breakpoints.only("sm"))
    const isMD = useMediaQuery(theme.breakpoints.only("md"))
    const isLG = useMediaQuery(theme.breakpoints.only("lg"))
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleReverseComplement = () => {
        setReverseComplement(prev => !prev);
        setMotifppm(rc(motifppm));
    };

    const QCState = useMemo(() => {
        return <QCStates motif={motif} selectedPeakID={selectedPeakID} pwm={pwm} />
    }, [motif, selectedPeakID, pwm]);

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
                                (svgRef.current = el)
                            }
                            width={
                                (isXS || isSM) ? 232
                                    : 325
                            }
                            height={
                                (isXS || isSM) ? 102
                                    : 183
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
                        <TableDiv motif={motif} />
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
                    onClick={() => handleReverseComplement()}
                >
                    {reverseComplement ? "Show Original" : "Show Reverse Complement"}
                </Button>
                <FullScreenDialog
                    species={species}
                    consensusRegex={motif.consensus_regex}
                    experimentID={selectedExperimentID}
                    fileID={selectedPeakID}
                />
                <Button
                    variant="outlined"
                    startIcon={showQCStates ? <VisibilityOff /> : <Visibility />}
                    onClick={() => setShowQCStates(prev => !prev)}
                >
                    {showQCStates ? "Hide QC" : "Show QC"}
                </Button>
            </Box>
            {showQCStates && selectedPeakID && QCState}
            {isDialogOpen && <DownloadDialog motif={motif} motifppm={motifppm} selectedPeakID={selectedPeakID} species={species} svgRef={svgRef} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />}
        </Box>
    );
}

function TableDiv({ motif }: { motif: any }) {
    return (
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
    )
}

function DownloadDialog({ motif, motifppm, selectedPeakID, species, svgRef, isDialogOpen, setIsDialogOpen }: { motif: any, motifppm: number[][], selectedPeakID: string, species: string, svgRef: React.RefObject<SVGSVGElement | null>, isDialogOpen: boolean, setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [exportMotif, setExportMotif] = useState(true);
    const [exportLogo, setExportLogo] = useState(false);
    const [exportPeakSites, setExportPeakSites] = useState(false);
    // handlers
    const handleDownload = async (
        name: string,
        ppm: number[][],
        svgElement: SVGSVGElement | null
    ) => {
        if (exportMotif) {
            downloadData(
                meme([{
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
    return (
        <Dialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            aria-labelledby="export-dialog-title"
            disableScrollLock
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
                            />}
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
                                svgRef.current
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
                        if (exportLogo && svgRef.current) {
                            downloadSVGElementAsSVG(
                                { current: svgRef.current },
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
    )
}

function QCStates({ motif, selectedPeakID, pwm }: { motif: any, selectedPeakID: string, pwm: number[][] }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    return (
        <Box mt={3}>
            <Grid container spacing={2} mt={3}>
                <Grid item xs={12} md={6}>
                    <CentralityPlot
                        peak_centrality={motif.peak_centrality}
                        width={isMobile ? 300 : 500}
                        height={isMobile ? 150 : 300}
                    />
                </Grid>

                {0 > 1 && <Grid item xs={12} md={6}>
                    <ATACPlot
                        name={motif.name}
                        accession={selectedPeakID}
                        pwm={pwm}
                    />
                </Grid>}
                <Grid item xs={12} md={6}>
                    <ConservationPlot
                        name={motif.name}
                        accession={selectedPeakID}
                        pwm={pwm}
                        width={isMobile ? 300 : 500}
                        height={isMobile ? 150 : 300}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}