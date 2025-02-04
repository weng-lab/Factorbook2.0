"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  MutableRefObject,
} from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Divider,
  SelectChangeEvent,
  useTheme,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid2 for MUI v2
import { ApiContext } from "@/apicontext";
import { Logo, DNAAlphabet } from "logojs-react";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  DEEP_LEARNED_MOTIFS_SELEX_QUERY,
  DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
} from "../queries";
import {
  DeepLearnedSELEXMotifsQueryResponse,
  DeepLearnedSELEXMotifsMetadataQueryResponse,
} from "../types";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/motifsearch/motifutil";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";
import SelexLinePlot from "./lineplot";
import SelexBarPlot from "./barplot";

// Add custom colors to Alphabet A and T
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

const DeepLearnedSelexMotifs: React.FC<{ factor: string; species: string }> = ({
  factor,
  species,
}) => {
  const client = useContext(ApiContext)?.client;
  const [motif, setMotif] = useState<string | undefined>(undefined);
  const { data, loading } =
    useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
      DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
      {
        client,
        variables: {
          tf: factor,
          species: species.toLowerCase(),
          selex_round: [1, 2, 3, 4, 5, 6, 7],
        },
      }
    );

  const studies = useMemo(
    () => [...new Set(data?.deep_learned_motifs?.map((d) => d.source))],
    [data]
  );
  const assays = useMemo(
    () => [...new Set(data?.deep_learned_motifs?.map((d) => d.assay))],
    [data]
  );

  const selexMotifs = useMemo(
    () =>
      data
        ? assays
          .map((a) =>
            studies.map((s) => {
              const motifs = data.deep_learned_motifs.filter(
                (m) => m.source === s && m.assay === a
              );
              const proteinTypes = motifs.map((m) => m.protein_type);
              return [...new Set(proteinTypes)].map((pt) => ({
                protein_type: pt,
                study: s,
                assay: a,
              }));
            })
          )
          .flat(2)
        : [],
    [data, assays, studies]
  );

  useEffect(() => {
    if (selexMotifs && selexMotifs.length > 0) {
      setMotif(
        `${selexMotifs[0].protein_type}:${selexMotifs[0].study}:${selexMotifs[0].assay}`
      );
    }
  }, [selexMotifs]);

  const handleMotifChange = (event: SelectChangeEvent<string>) => {
    setMotif(event.target.value);
  };

  if (loading || !data)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  const dropDownOptions = selexMotifs.map((s) => ({
    key: `${s.protein_type}:${s.study}:${s.assay}`,
    value: `${s.protein_type}:${s.study}:${s.assay}`,
    text: `${s.study} - ${s.assay} - ${s.protein_type}`,
    content: (
      <>
        <Typography mr={2}><b>Study:</b> {s.study} - <b>Assay:</b> {s.assay} - <b>Protein Type:</b> {s.protein_type}</Typography>
      </>
    ),
  }));

  return (
    <Box sx={{ padding: "1em", marginTop: "1em", marginLeft: "2em" }}>
      {dropDownOptions.length > 0 && (
        <FormControl>
          <InputLabel id="motif-select-label">Select Motif</InputLabel>
          <Select
            labelId="motif-select-label"
            value={motif ?? ""}
            label="Select Motif"
            onChange={handleMotifChange}
            sx={{
              borderRadius: "24px",
            }}
          >
            {dropDownOptions.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.content}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {motif && (
        <SelexMotifsForAssayStudyAndProteinType
          protein_type={motif.split(":")[0]}
          study={motif.split(":")[1]}
          assay={motif.split(":")[2]}
          tf={factor}
          species={species}
        />
      )}
    </Box>
  );
};

const SelexMotifsForAssayStudyAndProteinType: React.FC<{
  protein_type: string;
  study: string;
  assay: string;
  tf: string;
  species: string;
}> = ({ protein_type, study, assay, tf, species }) => {
  const client = useContext(ApiContext)?.client;
  const { data, loading } = useQuery<DeepLearnedSELEXMotifsQueryResponse>(
    DEEP_LEARNED_MOTIFS_SELEX_QUERY,
    {
      client,
      variables: {
        tf,
        species: species.toLowerCase(),
        selex_round: [1, 2, 3, 4, 5, 6, 7],
        protein_type,
        assay,
        source: study,
      },
    }
  );

  if (loading || !data)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {data?.deep_learned_motifs && (
        <DeepLearnedSelexMotif
          protein_type={protein_type}
          study={study}
          assay={assay}
          data={data.deep_learned_motifs
            .slice()
            .sort((a, b) => a.selex_round - b.selex_round)}
        />
      )}
    </>
  );
};

const DownloadableMotif: React.FC<{ ppm: number[][]; name: string }> = ({
  ppm,
  name,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [reverseComplement, setReverseComplement] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportMotif, setExportMotif] = useState(true);
  const [exportLogo, setExportLogo] = useState(false);
  const motifppm = reverseComplement ? rc(ppm) : ppm;

  if (!ppm || ppm.length === 0) {
    return null;
  }

  const handleExport = async () => {
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
    if (exportLogo && svgRef.current) {
      downloadSVGElementAsSVG(svgRef, `${name}-logo.svg`);
    }
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ textAlign: "center", marginBottom: 2, padding: "2p" }}>
      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveAltIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Export
        </Button>
        <Button
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          onClick={() => setReverseComplement(!reverseComplement)}
        >
          Reverse Complement
        </Button>
      </Box>
      <Logo
        ppm={motifppm}
        alphabet={DNAAlphabet}
        ref={svgRef as MutableRefObject<SVGSVGElement>}
        width={300}
        height={300}
      />
      {/** @todo deduplicate with download dialog in motif/[accession]/page.tsx */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="export-dialog-title"
        PaperProps={{
          sx: {
            width: "25vw",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle id="export-dialog-title">Export as</DialogTitle>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const DeepLearnedSelexMotif: React.FC<{
  study: string;
  assay: string;
  protein_type: string;
  data: {
    selex_round: number;
    ppm: number[][];
    fractional_enrichment: number;
    roc_curve: number[][];
    selex?: any;
  }[];
}> = ({ study, assay, protein_type, data }) => {
  const theme = useTheme();

  const downloadSVGElement = (
    ref: MutableRefObject<SVGSVGElement | null>,
    filename: string
  ) => {
    if (ref.current) {
      downloadSVGElementAsSVG(ref, filename);
    }
  };

  return (
    <Box>
      <Typography variant="h5" align="left" mt={2} gutterBottom>
        <b>
          {assay.replaceAll("-", " ")} motifs for{" "}
          {protein_type === "full"
            ? " full length protein"
            : " DNA binding domain protein"}{" "}
          found in {study.replace("_", " ")} study
        </b>
      </Typography>
      <Stack
        divider={<Divider />}
      >
        <Grid container spacing={3}>
          {/* LINE PLOT */}
          <Grid xs={3}>
            <SelexLinePlot
              data={data}
              downloadSVGElement={downloadSVGElement}
            />
          </Grid>
          {/* BAR PLOT */}
          <Grid xs={3}>
            <SelexBarPlot
              data={data}
              downloadSVGElement={downloadSVGElement}
            />
          </Grid>
        </Grid>
        {/* CYCLES */}
        <Grid container spacing={3}>
          {data.map((d, i) => (
            <Grid xs={3}>
              <Box key={`logo${i}`} sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "brown" }}>
                  Cycle {d.selex_round}
                </Typography>
                {d.ppm && d.ppm.length > 0 && (
                  <>
                    <DownloadableMotif ppm={d.ppm} name={study} />
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default DeepLearnedSelexMotifs;
