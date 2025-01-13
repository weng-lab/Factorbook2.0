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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid2 for MUI v2
import { ApiContext } from "@/apicontext";
import { Logo, DNAAlphabet } from "logojs-react";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { LinePath, Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Text } from "@visx/text";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  DEEP_LEARNED_MOTIFS_SELEX_QUERY,
  DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
} from "./queries";
import {
  DeepLearnedSELEXMotifsQueryResponse,
  DeepLearnedSELEXMotifsMetadataQueryResponse,
} from "./types";
import { downloadData, downloadSVGElementAsSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/motifsearch/motifutil";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";

// Add custom colors to Alphabet A and T
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

const colors: { [key: number]: string } = {
  1: "#FFA500",
  2: "#FF0000",
  3: "#008000",
  4: "#0000FF",
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
  }));

  return (
    <Box sx={{ padding: "1em", marginTop: "1em", marginLeft: "2em" }}>
      {dropDownOptions.length > 0 && (
        <FormControl fullWidth>
          <InputLabel id="motif-select-label">Select Motif</InputLabel>
          <Select
            labelId="motif-select-label"
            value={motif ?? ""}
            label="Select Motif"
            onChange={handleMotifChange}
          >
            {dropDownOptions.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.text}
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
    <Box sx={{ textAlign: "center", marginBottom: 2 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      ></Box>
      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          onClick={() => setReverseComplement(!reverseComplement)}
          sx={{
            borderRadius: "20px",
            borderColor: "#8169BF",
            color: "#8169BF",
            marginRight: 2,
          }}
        >
          Reverse Complement
        </Button>
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
          Export
        </Button>
      </Box>
      <Logo
        ppm={motifppm}
        alphabet={DNAAlphabet}
        ref={svgRef as MutableRefObject<SVGSVGElement>}
        width={400}
        height={250}
      />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="export-dialog-title"
      >
        <DialogTitle id="export-dialog-title">Export as</DialogTitle>
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
            onClick={handleExport}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#8169BF",
              color: "white",
            }}
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
  const points = useMemo(
    () =>
      data.flatMap((d) =>
        d.roc_curve.map((r) => ({
          x: r[0],
          y: r[1],
          round: d.selex_round,
        }))
      ),
    [data]
  );

  const domain = useMemo(
    () => ({
      x: {
        start: 0,
        end: 1,
      },
      y: {
        start: 0,
        end: 1,
      },
    }),
    []
  );

  const barplotDomain = useMemo(
    () => ({
      x: {
        start: Math.min(...data.map((x) => x.selex_round)) - 1,
        end: Math.max(...data.map((x) => x.selex_round)) + 1,
      },
      y: {
        start: 0.0,
        end: Math.max(...data.map((x) => x.fractional_enrichment)) * 1 + 0.1,
      },
    }),
    [data]
  );

  const lineGraphHeight = 400;
  const lineGraphWidth = 600;
  const barGraphHeight = 400;
  const barGraphWidth = 600;
  const margin = { top: 20, right: 90, bottom: 70, left: 70 };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [domain.x.start, domain.x.end],
        range: [margin.left, lineGraphWidth - (isMobile ? 0 : margin.right)],
      }),
    [domain, lineGraphWidth, margin, isMobile]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [domain.y.start, domain.y.end],
        range: [lineGraphHeight - margin.bottom, margin.top],
      }),
    [domain, lineGraphHeight, margin]
  );

  const barXScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.selex_round),
        range: [margin.left, barGraphWidth - (isMobile ? 0 : margin.right)],
        paddingInner: 0.5,
        paddingOuter: 0.3,
      }),
    [data, barGraphWidth, margin, isMobile]
  );

  const barYScale = useMemo(
    () =>
      scaleLinear({
        domain: [barplotDomain.y.start, barplotDomain.y.end],
        range: [barGraphHeight - margin.bottom, margin.top],
      }),
    [barplotDomain, barGraphHeight, margin]
  );

  const lineref = useRef<SVGSVGElement | null>(null);
  const barref = useRef<SVGSVGElement | null>(null);

  const downloadSVGElement = (
    ref: MutableRefObject<SVGSVGElement | null>,
    filename: string
  ) => {
    if (ref.current) {
      downloadSVGElementAsSVG(ref, filename);
    }
  };

  const presentCycles = data.map((d) => d.selex_round);

  return (
    <Box sx={{ padding: "1em" }}>
      <Typography variant="h5" align="center">
        {assay.replaceAll("-", " ")} motifs for{" "}
        {protein_type === "full"
          ? " full length protein"
          : " DNA binding domain protein"}{" "}
        found in {study.replace("_", " ")} study
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          {data.map((d, i) => (
            <Box key={`logo${i}`} sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "brown" }}>
                Cycle {d.selex_round}
              </Typography>
              {d.ppm && d.ppm.length > 0 && (
                <>
                  <DownloadableMotif ppm={d.ppm} name={study} />
                  <Divider sx={{ my: 2 }} />
                </>
              )}
            </Box>
          ))}
        </Grid>
        <Grid xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <svg ref={lineref} width={lineGraphWidth} height={lineGraphHeight}>
              <Group left={isMobile ? 0 : margin.left} top={margin.top}>
                <AxisLeft
                  scale={yScale}
                  label="Formyl peptide receptor"
                  labelProps={{
                    fontSize: 12,
                    fill: "black",
                    textAnchor: "middle",
                    transform: "translate(-60, 0) rotate(-90)",
                  }}
                  tickValues={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tickLabelProps={() => ({
                    fontSize: 10,
                    fill: "black",
                    textAnchor: "end",
                    dx: "-0.25em",
                    dy: "0.25em",
                  })}
                />
                <AxisBottom
                  scale={xScale}
                  top={lineGraphHeight - margin.bottom}
                  label="Tetratricopeptide Repeat"
                  labelProps={{
                    fontSize: 12,
                    fill: "black",
                    textAnchor: "middle",
                    transform: "translate(0, 40)",
                  }}
                  tickValues={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tickLabelProps={() => ({
                    fontSize: 10,
                    fill: "black",
                    textAnchor: "middle",
                    dy: "0.25em",
                  })}
                />
                {data.map((d, i) => (
                  <LinePath
                    key={i}
                    data={points.filter((p) => p.round === d.selex_round)}
                    x={(p) => xScale(p.x)}
                    y={(p) => yScale(p.y)}
                    stroke={colors[d.selex_round]}
                    strokeWidth={2}
                  />
                ))}
                <Text
                  x={310}
                  y={370}
                  fontSize={14}
                  textAnchor="middle"
                  fill="black"
                >
                  Tetratricopeptide Repeat
                </Text>
                <Text
                  x={-170}
                  y={-40}
                  fontSize={14}
                  textAnchor="middle"
                  fill="black"
                  transform="rotate(-90)"
                >
                  Formyl Peptide Receptor
                </Text>
              </Group>
            </svg>
            <Box sx={{ display: "flex", marginTop: 1 }}>
              {presentCycles.map((cycle) => (
                <Typography
                  key={cycle}
                  variant="body1"
                  sx={{ color: colors[cycle], marginRight: 2 }}
                >
                  Cycle {cycle}
                </Typography>
              ))}
            </Box>
            <Button
              variant="contained"
              startIcon={<SaveAltIcon />}
              onClick={() => downloadSVGElement(lineref, "lineplot.svg")}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#8169BF",
                color: "white",
                marginTop: "10px",
              }}
            >
              Export Line Plot
            </Button>
            <svg ref={barref} width={barGraphWidth} height={barGraphHeight}>
              <Group left={isMobile ? 0 : margin.left} top={margin.top}>
                <AxisLeft
                  scale={barYScale}
                  label="Fractional Enrichment"
                  labelProps={{
                    fontSize: 12,
                    fill: "black",
                    textAnchor: "middle",
                    transform: "translate(-60, 0) rotate(-90)",
                  }}
                  tickLabelProps={() => ({
                    fontSize: 10,
                    fill: "black",
                    textAnchor: "end",
                    dx: "-0.25em",
                    dy: "0.25em",
                  })}
                />
                <AxisBottom
                  scale={barXScale}
                  top={barGraphHeight - margin.bottom}
                  label="Cycle"
                  labelProps={{
                    fontSize: 12,
                    fill: "black",
                    textAnchor: "middle",
                    transform: "translate(0, 40)",
                  }}
                  tickLabelProps={() => ({
                    fontSize: 10,
                    fill: "black",
                    textAnchor: "middle",
                    dy: "0.25em",
                  })}
                />
                {data.map((d, i) => (
                  <React.Fragment key={i}>
                    <Bar
                      x={barXScale(d.selex_round)}
                      y={barYScale(d.fractional_enrichment)}
                      height={
                        barGraphHeight -
                        margin.bottom -
                        barYScale(d.fractional_enrichment)
                      }
                      width={barXScale.bandwidth()}
                      fill={colors[d.selex_round]}
                    />
                    <Text
                      x={barXScale(d.selex_round)! + barXScale.bandwidth() / 2}
                      y={barYScale(d.fractional_enrichment) - 5}
                      fontSize={12}
                      fill={colors[d.selex_round]}
                      textAnchor="middle"
                    >
                      {d.fractional_enrichment.toFixed(2)}
                    </Text>
                  </React.Fragment>
                ))}
                <Text
                  x={220}
                  y={370}
                  fontSize={14}
                  textAnchor="middle"
                  fill="black"
                >
                  Cycle
                </Text>
                <Text
                  x={-170}
                  y={-30}
                  fontSize={14}
                  textAnchor="middle"
                  fill="black"
                  transform="rotate(-90)"
                >
                  Fractional Enrichment
                </Text>
              </Group>
            </svg>
            <Box sx={{ display: "flex", marginTop: 1 }}>
              {presentCycles.map((cycle) => (
                <Typography
                  key={cycle}
                  variant="body1"
                  sx={{ color: colors[cycle], marginRight: 2 }}
                >
                  Cycle {cycle}
                </Typography>
              ))}
            </Box>
            <Button
              variant="contained"
              startIcon={<SaveAltIcon />}
              onClick={() => downloadSVGElement(barref, "barplot.svg")}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#8169BF",
                color: "white",
                marginTop: "10px",
              }}
            >
              Export Bar Plot
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeepLearnedSelexMotifs;
