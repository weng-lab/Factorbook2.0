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
  Stack,
  Skeleton,
} from "@mui/material";
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

export const colors: { [key: number]: string } = {
  1: "#e6725f",
  2: "#46d29a",
  3: "#e09b50",
  4: "#a84ddb",
  5: "#A52A2A",
  6: "#FFD700",
  7: "#90EE90",
};

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

  if (loading ||  !data)
    return (
      <>
        {/* HEADER */}
        <Skeleton variant="rounded" width={"30%"} height="57px" />
        <br />
        <Stack divider={<Divider sx={{ marginY: 2 }} />} spacing={3}>

          {/* LINE & BAR PLOTS */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
            <Box>
              <Skeleton variant="rounded" width={300} height={300} />
            </Box>
            <Box>
              <Skeleton variant="rounded" width={300} height={300} />
            </Box>
          </Box>

          {/* CYCLES */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "space-between" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ flex: "1 1 auto", textAlign: "flex-start" }}>
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton variant="rounded" width={300} height={200} />
              </Box>
            ))}
          </Box>
        </Stack>
      </>
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
    <Box>
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
      <>
        <Stack divider={<Divider sx={{ marginY: 2 }} />} spacing={3} mt={2}>
          {/* LINE & BAR PLOTS */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
            <Box>
              <Skeleton variant="rounded" width={300} height={300} />
            </Box>
            <Box>
              <Skeleton variant="rounded" width={300} height={300} />
            </Box>
          </Box>

          {/* CYCLES */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "space-between" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ flex: "1 1 auto", textAlign: "flex-start" }}>
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton variant="rounded" width={300} height={200} />
              </Box>
            ))}
          </Box>
        </Stack>
      </>
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
    <Box sx={{ justifyContent: "center", marginBottom: 2, marginTop: 1 }}>
      <Box sx={{ justifyContent: "center"}}>
      <Logo
        ppm={motifppm}
        alphabet={DNAAlphabet}
        ref={svgRef as MutableRefObject<SVGSVGElement>}
        width={300}
        height={200}
      />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
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

  const [hoveredCycle, setHoveredCycle] = useState<number | null>(null);

  const onHover = (cycle: number | null) => {
    setHoveredCycle(cycle);
  };

  const downloadSVGElement = (
    ref: MutableRefObject<SVGSVGElement | null>,
    filename: string
  ) => {
    if (ref.current) {
      downloadSVGElementAsSVG(ref, filename);
    }
  };

  return (
    <Stack divider={<Divider sx={{ marginY: 2 }} />} spacing={3}>
      {/* LINE & BAR PLOTS */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-start" }}>
        <Box>
          <SelexLinePlot data={data} downloadSVGElement={downloadSVGElement} onHover={onHover} />
        </Box>
        <Box>
          <SelexBarPlot data={data} downloadSVGElement={downloadSVGElement} onHover={onHover} />
        </Box>
      </Box>
      {/* CYCLES */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-start" }}>
        {data.map((d, i) => (
          <Box 
            key={`logo${i}`} 
            sx={{
              textAlign: "flex-start",
              backgroundColor: hoveredCycle === d.selex_round ? `${colors[d.selex_round]}40` : "transparent",
              transition: "background-color 0.3s ease-in-out",
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="h6">Cycle {d.selex_round}</Typography>
            {d.ppm && d.ppm.length > 0 && <DownloadableMotif ppm={d.ppm} name={study} />}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default DeepLearnedSelexMotifs;
