import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
import {
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Modal,
  Input,
  Tooltip,
  Menu,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Info as InfoIcon,
  Download as DownloadIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import { Logo, DNAAlphabet } from "logojs-react";
import { groupBy } from "queryz";

import { downloadData, downloadSVG } from "utilities/svgdata";
import CopyToClipboardButton from "components/copytoclipboardbutton";
import QCMessage from "./qcmessage";

import CentralityPlot from "./peakscentrality";
import { MemeMotif } from "./types";
import { useMotifData } from "./hooks";
import { ATACPlot, ConservationPlot } from "./plots";
import { TOMTOMMessage } from "components/shared";
import { TOMTOMMatch } from "components/shared/types";
import { useHistory, useParams } from "react-router-dom";
import DownloadMemeOccurrences from "./downloadmemeoccurrences";
import { ApiContext } from "apicontext";
import { meme, MMotif } from "components/motifsearch/umap";
import MNasePlot from "./plots/mnase";

DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

const TransparentAlphabet = DNAAlphabet.map((letter: any) => ({
  ...letter,
  fillOpacity: 0.3,
}));

const MethylAlphabet = [
  { regex: "M", color: "#008864" },
  { regex: "W", color: "#008888" },
];

const MethylTransparentAlphabet = MethylAlphabet.map((letter) => ({
  ...letter,
  fillOpacity: 0.3,
}));

export const reverseComplement = (ppm: number[][]): number[][] =>
  ppm && ppm[0] && ppm[0].length === 4
    ? ppm.map((inner) => inner.slice().reverse()).reverse()
    : ppm
        .map((entry) => [
          entry[3],
          entry[2],
          entry[1],
          entry[0],
          entry[5],
          entry[4],
        ])
        .reverse();

function logLikelihood(
  backgroundFrequencies: number[]
): (r: number[]) => number[] {
  return (r: number[]): number[] => {
    let sum = 0.0;
    r.map(
      (x, i) =>
        (sum +=
          x === 0 ? 0 : x * Math.log2(x / (backgroundFrequencies[i] || 0.01)))
    );
    return r.map((x) => x * sum);
  };
}

const Motif: React.FC<{
  eacc?: string;
  motif: MemeMotif;
  methyl?: boolean;
  peaks_accession: string;
  tomtom?: TOMTOMMatch[];
  ct?: string;
}> = ({ motif, methyl, peaks_accession, tomtom, eacc, ct }) => {
  const history = useHistory();
  const { species, factor } = useParams<{
    species?: string;
    factor?: string;
  }>();

  const redirect = useCallback(
    (accession: string, eacc: string, regex: string) =>
      history.push(
        `/${species}/${factor}/mememotif/${eacc}/${accession}/${regex}`
      ),
    [history, species, factor]
  );
  const [isReverseComplement, setReverseComplement] = useState(false);
  const [isConsensusSeqModalOpen, setConsensusSeqModalOpen] = useState(false);
  const [peakCentralityPlot, showPeakCentralityPlot] = useState(false);
  const [epigeneticSignalPlot, showEpigeneticSignalPlot] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const togglePeakCentralityPlot = useCallback(
    () => showPeakCentralityPlot(!peakCentralityPlot),
    [peakCentralityPlot]
  );
  const toggleEpigeneticSignal = useCallback(
    () => showEpigeneticSignalPlot(!epigeneticSignalPlot),
    [epigeneticSignalPlot]
  );

  const clients = useContext(ApiContext);
  const streamMemeService = (clients.restEndpoints as any).streamMemeService;

  const svg = useRef<any>(null);
  const toggleReverseComplement = useCallback(
    () => setReverseComplement(!isReverseComplement),
    [isReverseComplement]
  );
  const ppm = isReverseComplement ? reverseComplement(motif.pwm) : motif.pwm;
  const poorCentrality = motif.flank_z_score < 0 || motif.flank_p_value > 0.05;
  const poorPeakEnrichment =
    motif.shuffled_z_score < 0 || motif.shuffled_p_value > 0.05;
  const logoWidth = (ppm.length * 95) / 30;
  const transparentAlphabet = methyl
    ? [...TransparentAlphabet, ...MethylTransparentAlphabet]
    : TransparentAlphabet;
  const opaqueAlphabet = methyl
    ? [...DNAAlphabet, ...MethylAlphabet]
    : DNAAlphabet;

  const backgroundFrequencies =
    motif.background_frequencies || ppm[0].map((_) => 1.0 / ppm[0].length);
  const ll = useMemo(
    () => logLikelihood(backgroundFrequencies),
    [backgroundFrequencies]
  );
  const pwm = useMemo(() => ppm.map(ll), [ppm, ll]);
  const yMax = Math.max(...pwm.map((xx) => xx.reduce((x, v) => x + v, 0.0)));
  const tomtomMatch = useMemo(
    () => tomtom?.slice().sort((a, b) => a.e_value - b.e_value)[0],
    [tomtom]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        {(poorCentrality || poorPeakEnrichment) && (
          <Box sx={{ paddingBottom: "10px" }}>
            {poorCentrality && (
              <QCMessage message="poor peak centrality" icon="warning sign" />
            )}
            {poorPeakEnrichment && (
              <QCMessage
                error
                message="poor peak enrichment"
                icon="warning sign"
              />
            )}
          </Box>
        )}
        <Box>
          <Logo
            yAxisMax={yMax}
            backgroundFrequencies={backgroundFrequencies}
            alphabet={
              poorCentrality || poorPeakEnrichment
                ? transparentAlphabet
                : opaqueAlphabet
            }
            ppm={ppm}
            ref={svg}
            width={`${logoWidth}%`}
          />
          <br />
          <TOMTOMMessage tomtomMatch={tomtomMatch} />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Tooltip title="The statistical significance of the motif. The E-value is an estimate of the expected number that one would find in a similarly sized set of random sequences (sequences where each position is independent and letters are chosen according to the background letter frequencies).">
                  <InfoIcon />
                </Tooltip>
              </TableCell>
              <TableCell>E-value</TableCell>
              <TableCell>{motif.e_value || "< 1e-300"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Tooltip title="The number of optimal IDR thresholded peaks which contained at least one occurrence of this motif according to FIMO.">
                  <InfoIcon />
                </Tooltip>
              </TableCell>
              <TableCell>Occurrences</TableCell>
              <TableCell>
                {motif.original_peaks_occurrences.toLocaleString()} /{" "}
                {motif.original_peaks.toLocaleString()} peaks
              </TableCell>
            </TableRow>
            {!poorCentrality && !poorPeakEnrichment && (
              <TableRow>
                <TableCell>
                  <Tooltip title="Downloads all sites of this motif within this set of ChIP-seq peaks as identified by FIMO.">
                    <InfoIcon />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Download Peak Sites
                  <br />({species === "human" ? "hg38" : "mm10"} genome)
                </TableCell>
                <TableCell>
                  <a
                    href={`https://screen-beta-api.wenglab.org/factorbook_downloads/hq-occurrences/${peaks_accession}_${motif.name}.gz`}
                    download
                  >
                    <DownloadIcon />
                  </a>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Grid>
      <Modal
        open={isConsensusSeqModalOpen}
        onClose={() => setConsensusSeqModalOpen(false)}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Consensus sequence</Typography>
          <Input
            value={motif.consensus_regex}
            spellCheck={false}
            sx={{ width: "80%" }}
          />
          &nbsp;
          <CopyToClipboardButton text={motif.consensus_regex} />
          <Button
            color="primary"
            onClick={() => setConsensusSeqModalOpen(false)}
          >
            Done
          </Button>
        </Box>
      </Modal>
      {downloading && (
        <DownloadMemeOccurrences
          peaks_accession={peaks_accession}
          consensus_regex={motif.consensus_regex}
          onComplete={() => setDownloading(false)}
          onError={() => setDownloading(false)}
          streamMemeOccurrencesService={streamMemeService}
        />
      )}
      <Grid item xs={12}>
        <Menu>
          <Button
            onClick={() =>
              downloadData(
                meme([
                  {
                    accession: peaks_accession,
                    pwm: motif.pwm,
                    factor: motif.name,
                    sites: motif.sites,
                    e: motif.e_value,
                  } as any as MMotif,
                ]),
                `${motif.name}.meme`
              )
            }
          >
            <DownloadIcon /> export motif (MEME)
          </Button>
          <Button onClick={() => downloadSVG(svg, "logo.svg")}>
            <DownloadIcon /> export logo (SVG)
          </Button>
          <Button onClick={toggleReverseComplement}>
            <SwapHorizIcon /> reverse complement
          </Button>
          {(ct === "K562" || ct === "GM12878") && (
            <Button onClick={toggleEpigeneticSignal}>
              <IconButton>
                <SwapHorizIcon /> epigenetic signal profile
              </IconButton>
            </Button>
          )}
          <Button
            onClick={() => setConsensusSeqModalOpen(true)}
            sx={{ display: "none" }}
          >
            <SwapHorizIcon /> show consensus sequence
          </Button>
          <Button
            onClick={() =>
              redirect(peaks_accession, eacc || "_", motif.consensus_regex)
            }
          >
            <SwapHorizIcon /> show genomic sites
          </Button>
          <Button onClick={togglePeakCentralityPlot}>
            <SwapHorizIcon />
            {peakCentralityPlot ? "hide QC" : "show QC"}
          </Button>
        </Menu>
        {peakCentralityPlot && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CentralityPlot peak_centrality={motif.peak_centrality} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ATACPlot
                name={motif.name}
                accession={peaks_accession}
                pwm={pwm}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ConservationPlot
                name={motif.name}
                accession={peaks_accession}
                pwm={pwm}
              />
            </Grid>
          </Grid>
        )}
        {epigeneticSignalPlot && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">
                Epigenetic Signal around Motif Sites
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              {(ct === "K562" || ct === "GM12878") && (
                <MNasePlot name={motif.name} celltype={ct!} pwm={pwm} />
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const Motifs: React.FC<{
  eacc?: string;
  peaks_accession: string;
  methyl?: boolean;
  ct?: string;
}> = ({ peaks_accession, methyl, eacc, ct }) => {
  const { data, loading } = useMotifData(peaks_accession);
  const motifs = useMemo(
    () =>
      [...(data?.meme_motifs || [])].sort(
        (a, b) =>
          b.flank_z_score +
          b.shuffled_z_score -
          a.flank_z_score -
          a.shuffled_z_score
      ),
    [data]
  );
  const tomtom = useMemo(
    () =>
      groupBy(
        data?.target_motifs || [],
        (x) => x.motifid,
        (x) => x
      ),
    [data]
  );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return motifs === undefined || motifs.length === 0 ? (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Message negative>
        <Typography variant="h6" align="center">
          No data available yet.
        </Typography>
      </Message>
    </Box>
  ) : (
    <Grid container spacing={2}>
      {motifs.map((m, i) => (
        <React.Fragment key={i + peaks_accession}>
          <Motif
            key={i + peaks_accession}
            motif={m}
            peaks_accession={peaks_accession}
            methyl={methyl}
            tomtom={tomtom.get(m.id)}
            eacc={eacc}
            ct={ct}
          />
          <Divider />
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default Motifs;
