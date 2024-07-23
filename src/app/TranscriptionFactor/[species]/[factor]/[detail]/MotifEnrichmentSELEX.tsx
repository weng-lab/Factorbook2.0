"use client";

import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ApiContext } from "@/ApiContext";
import { Logo, DNAAlphabet } from "logojs-react";
import { scaleLinear, scaleBand, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { LinePath, Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  DEEP_LEARNED_MOTIFS_SELEX_QUERY,
  DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
} from "./Queries";
import {
  DeepLearnedSELEXMotifsQueryResponse,
  DeepLearnedSELEXMotifsMetadataQueryResponse,
} from "./types";
import { downloadData, downloadSVG } from "@/utilities/svgdata";
import { meme, MMotif } from "@/components/MotifSearch/MotifUtil";
import { reverseComplement as rc } from "@/components/tf/geneexpression/utils";

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

  useEffect(() => {
    if (selexMotifs && selexMotifs.length === 1) {
      setMotif(
        `${selexMotifs[0].protein_type}:${selexMotifs[0].study}:${selexMotifs[0].assay}`
      );
    }
  }, [selexMotifs]);

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
            value={motif}
            label="Select Motif"
            onChange={(e) => setMotif(e.target.value as string)}
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
  const svg = useRef<SVGSVGElement>(null);
  const [reverseComplement, setReverseComplement] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportMotif, setExportMotif] = useState(true);
  const [exportLogo, setExportLogo] = useState(false);
  const motifppm = reverseComplement ? rc(ppm) : ppm;

  if (!ppm || ppm.length === 0) {
    return null; // or render a message indicating that no data is available
  }

  const handleExport = () => {
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
    if (exportLogo) {
      downloadSVG(svg, "logo.svg");
    }
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ textAlign: "center", marginBottom: 2 }}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-start", marginBottom: 2 }}
      >
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
      </Box>
      <Logo
        ppm={motifppm}
        alphabet={DNAAlphabet}
        ref={svg}
        width={450} // Adjusted width to a medium size
        height={225} // Adjusted height to a medium size
      />
      <Button
        variant="contained"
        startIcon={<SaveAltIcon />}
        onClick={() => setIsDialogOpen(true)}
        sx={{
          borderRadius: "20px",
          backgroundColor: "#8169BF",
          color: "white",
          marginTop: "10px",
        }}
      >
        Export
      </Button>
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
        start:
          Math.floor(Math.min(...points.map((point) => point.x)) / 0.1) * 0.1,
        end: Math.ceil(Math.max(...points.map((point) => point.x)) / 0.1) * 0.1,
      },
      y: {
        start: Math.floor(Math.min(...points.map((point) => point.y)) / 1) * 1,
        end: Math.ceil(Math.max(...points.map((point) => point.y)) / 1) * 1,
      },
    }),
    [points]
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

  const height = 400;
  const width = 600;

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [domain.x.start, domain.x.end],
        range: [25, width - 50], // Add half the previous padding (25)
      }),
    [domain, width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [domain.y.start, domain.y.end],
        range: [height - 50, 0],
      }),
    [domain, height]
  );

  const barXScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.selex_round),
        range: [0, width - 50],
        padding: 0.3,
      }),
    [data, width]
  );

  const barYScale = useMemo(
    () =>
      scaleLinear({
        domain: [barplotDomain.y.start, barplotDomain.y.end],
        range: [height - 50, 0],
      }),
    [barplotDomain, height]
  );

  const colorScale = useMemo(
    () =>
      scaleOrdinal<number, string>({
        domain: data.map((d) => d.selex_round),
        range: Object.values(colors),
      }),
    [data]
  );

  const lineref = useRef<SVGSVGElement>(null);
  const llegendref = useRef<SVGSVGElement>(null);
  const barref = useRef<SVGSVGElement>(null);
  const blegendref = useRef<SVGSVGElement>(null);

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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <svg ref={lineref} width={width} height={height}>
            <Group left={50} top={20}>
              <AxisLeft
                scale={yScale}
                label="FPR"
                labelProps={{
                  fontSize: 12,
                  fill: "black",
                  textAnchor: "middle",
                  transform: "translate(-40, 0) rotate(-90)",
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
                scale={xScale}
                top={height - 20}
                label="TPR"
                labelProps={{
                  fontSize: 12,
                  fill: "black",
                  textAnchor: "middle",
                  transform: "translate(0, 30)",
                }}
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
            </Group>
          </svg>
          <svg ref={llegendref} width={width} height={50}>
            <Group transform="translate(130,15)">
              {data.map((d, i) => (
                <Group
                  key={i}
                  transform={`translate(${i * 50},0)`}
                  style={{ textAnchor: "middle" }}
                >
                  <rect fill={colors[d.selex_round]} height={7} width={7} />
                  <text
                    x={15}
                    y={15}
                    fill="black"
                    fontSize="14" // Increased font size
                    fontFamily="Arial"
                  >
                    Cycle {d.selex_round}
                  </text>
                </Group>
              ))}
            </Group>
          </svg>
          <Button
            variant="contained"
            onClick={() => {
              downloadSVG(lineref, "lineplot.svg");
              downloadSVG(llegendref, "lineplot.legend.svg");
            }}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#8169BF",
              color: "white",
              marginTop: "10px",
            }}
          >
            Download
          </Button>
          <svg ref={barref} width={width} height={height}>
            <Group left={50} top={20}>
              <AxisLeft
                scale={barYScale}
                label="Fractional Enrichment"
                labelProps={{
                  fontSize: 12,
                  fill: "black",
                  textAnchor: "middle",
                  transform: "translate(-40, 0) rotate(-90)",
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
                top={height - 20}
                label="Cycle"
                labelProps={{
                  fontSize: 12,
                  fill: "black",
                  textAnchor: "middle",
                  transform: "translate(0, 30)",
                }}
                tickLabelProps={() => ({
                  fontSize: 10,
                  fill: "black",
                  textAnchor: "middle",
                  dy: "0.25em",
                })}
              />
              {data.map((d, i) => (
                <Bar
                  key={`bar-${i}`}
                  x={barXScale(d.selex_round)}
                  y={barYScale(d.fractional_enrichment)}
                  height={height - 20 - barYScale(d.fractional_enrichment)}
                  width={barXScale.bandwidth()}
                  fill={colors[d.selex_round]}
                />
              ))}
            </Group>
          </svg>
          <svg ref={blegendref} width={width} height={50}>
            <Group transform="translate(130,15)">
              {data.map((d, i) => (
                <Group
                  key={i}
                  transform={`translate(${i * 50},0)`}
                  style={{ textAnchor: "middle" }}
                >
                  <rect fill={colors[d.selex_round]} height={7} width={7} />
                  <text
                    x={15}
                    y={15}
                    fill="black"
                    fontSize="14" // Increased font size
                    fontFamily="Arial"
                  >
                    Cycle {d.selex_round}
                  </text>
                </Group>
              ))}
            </Group>
          </svg>
          <Button
            variant="contained"
            onClick={() => {
              downloadSVG(barref, "barplot.svg");
              downloadSVG(blegendref, "barplot.legend.svg");
            }}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#8169BF",
              color: "white",
              marginTop: "10px",
            }}
          >
            Download
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeepLearnedSelexMotifs;
