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
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ApiContext } from "@/ApiContext";
import { Logo, DNAAlphabet } from "logojs-react";
import { scaleLinear, scaleBand, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { LinePath, Bar } from "@visx/shape";
import { LegendOrdinal } from "@visx/legend";
import { AxisBottom, AxisLeft } from "@visx/axis";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  DEEP_LEARNED_MOTIFS_SELEX_QUERY,
  DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
} from "./Queries";
import {
  DeepLearnedSELEXMotifsQueryResponse,
  DeepLearnedSELEXMotifsMetadataQueryResponse,
} from "./types";
import { downloadData, downloadSVG } from "../../../../../utilities/svgdata";
import { meme, MMotif } from "@/components/MotifSearch/MotifUtil";
import { reverseComplement } from "../../../../../components/tf/geneexpression/utils";

const colors = {
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
  const [open, setOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    meme: true,
    logo: false,
  });

  const handleExport = () => {
    if (exportOptions.meme) {
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
    if (exportOptions.logo) {
      downloadSVG(svg, "logo.svg");
    }
    setOpen(false);
  };

  if (!ppm || ppm.length === 0) {
    return null; // or render a message indicating that no data is available
  }

  const motifppm = reverseComplement ? reverseComplement(ppm) : ppm;

  return (
    <Box sx={{ textAlign: "center", marginBottom: 2 }}>
      <Button
        variant="outlined"
        startIcon={<SwapHorizIcon />}
        onClick={() => setReverseComplement(!reverseComplement)}
        sx={{
          borderRadius: "20px",
          color: "#8169BF",
          borderColor: "#8169BF",
        }}
      >
        Reverse Complement
      </Button>
      <Logo ppm={motifppm} alphabet={DNAAlphabet} ref={svg} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveAltIcon />}
        onClick={() => setOpen(true)}
        sx={{
          marginTop: 2,
          backgroundColor: "#8169BF",
          borderRadius: "20px",
        }}
      >
        Export
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Export as</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={exportOptions.meme}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    meme: e.target.checked,
                  })
                }
                sx={{
                  color: "#8169BF",
                  "&.Mui-checked": {
                    color: "#8169BF",
                  },
                }}
              />
            }
            label="Motif (MEME)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={exportOptions.logo}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    logo: e.target.checked,
                  })
                }
                sx={{
                  color: "#8169BF",
                  "&.Mui-checked": {
                    color: "#8169BF",
                  },
                }}
              />
            }
            label="Logo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#8169BF" }}>
            Cancel
          </Button>
          <Button onClick={handleExport} sx={{ backgroundColor: "#8169BF" }}>
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
      data[0]?.roc_curve?.map((r) => ({
        x: r[0],
        y: r[1],
      })) || [],
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
        range: [0, width],
      }),
    [domain, width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [domain.y.start, domain.y.end],
        range: [height, 0],
      }),
    [domain, height]
  );

  const barXScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.selex_round),
        range: [0, width],
        padding: 0.3,
      }),
    [data, width]
  );

  const barYScale = useMemo(
    () =>
      scaleLinear({
        domain: [barplotDomain.y.start, barplotDomain.y.end],
        range: [height, 0],
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
              <Typography variant="h6" color="primary">
                Cycle {d.selex_round}
              </Typography>
              {d.ppm && d.ppm.length > 0 && (
                <DownloadableMotif ppm={d.ppm} name={study} />
              )}
            </Box>
          ))}
        </Grid>
        <Grid item xs={6}>
          <svg ref={lineref} width={width} height={height}>
            <Group>
              <AxisLeft scale={yScale} />
              <AxisBottom scale={xScale} top={height} />
              <LinePath
                data={points}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke="#000"
                strokeWidth={2}
              />
            </Group>
          </svg>
          <svg ref={llegendref} viewBox="0 0 400 40">
            <g transform="translate(130,15)">
              <text x={0} y={0} fill="black">
                Cycle
              </text>
            </g>
            {data.map((d, i) => (
              <g transform={`translate(${170 + i * 30},0)`} key={i}>
                <LegendOrdinal
                  scale={colorScale}
                  labelFormat={(label) => `${label}`}
                >
                  {(labels) =>
                    labels.map((label) => (
                      <g key={`legend-${label.text}`}>
                        <rect
                          fill={label.value}
                          height={7}
                          width={7}
                          y={9}
                          x={0}
                        />
                        <text
                          x={15}
                          y={15}
                          fill="black"
                          fontSize="10"
                          fontFamily="Arial"
                        >
                          {label.text}
                        </text>
                      </g>
                    ))
                  }
                </LegendOrdinal>
              </g>
            ))}
          </svg>
          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            color="primary"
            onClick={() => {
              downloadSVG(lineref, "lineplot.svg");
              downloadSVG(llegendref, "lineplot.legend.svg");
            }}
            sx={{
              marginTop: 2,
              backgroundColor: "#8169BF",
              borderRadius: "20px",
            }}
          >
            Download
          </Button>
          <svg ref={barref} width={width} height={height}>
            <Group>
              <AxisLeft scale={barYScale} />
              <AxisBottom scale={barXScale} top={height} />
              {data.map((d, i) => (
                <Bar
                  key={`bar-${i}`}
                  x={barXScale(d.selex_round)}
                  y={barYScale(d.fractional_enrichment)}
                  height={height - barYScale(d.fractional_enrichment)}
                  width={barXScale.bandwidth()}
                  fill={colorScale(d.selex_round)}
                />
              ))}
            </Group>
          </svg>
          <svg ref={blegendref} viewBox="0 0 400 40">
            <g transform="translate(130,15)">
              <text x={0} y={0} fill="black">
                Cycle
              </text>
            </g>
            {data.map((d, i) => (
              <g transform={`translate(${170 + i * 30},0)`} key={i}>
                <LegendOrdinal
                  scale={colorScale}
                  labelFormat={(label) => `${label}`}
                >
                  {(labels) =>
                    labels.map((label) => (
                      <g key={`legend-${label.text}`}>
                        <rect
                          fill={label.value}
                          height={7}
                          width={7}
                          y={9}
                          x={0}
                        />
                        <text
                          x={15}
                          y={15}
                          fill="black"
                          fontSize="10"
                          fontFamily="Arial"
                        >
                          {label.text}
                        </text>
                      </g>
                    ))
                  }
                </LegendOrdinal>
              </g>
            ))}
          </svg>
          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            color="primary"
            onClick={() => {
              downloadSVG(barref, "barplot.svg");
              downloadSVG(blegendref, "barplot.legend.svg");
            }}
            sx={{
              marginTop: 2,
              backgroundColor: "#8169BF",
              borderRadius: "20px",
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
