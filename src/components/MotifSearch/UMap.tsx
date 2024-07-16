import React, { useEffect, useMemo, useRef, useState } from "react";
import { ungzip } from "pako";
import { Button, CircularProgress, Typography, Box, Grid } from "@mui/material";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GlyphDot } from "@visx/glyph";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { DNALogo } from "logojs-react";
import { downloadSVG } from "@/components/tf/geneexpression/utils";
import { Link } from "react-router-dom";
import { downloadData } from "@/utilities/svgdata";
import { MMotif, pwmArray, meme, rc, lower5, upper5, range } from "./MotifUtil";

const colors = {
  1: "#FFA500",
  2: "#FF0000",
  3: "#008000",
  4: "#0000FF",
  5: "#A52A2A",
  6: "#FFD700",
  7: "#90EE90",
};

function isPWMObjectArray(
  pwm: { A: number; C: number; G: number; T: number }[] | number[][]
): pwm is { A: number; C: number; G: number; T: number }[] {
  return (
    (pwm as { A: number; C: number; G: number; T: number }[])[0].A !== undefined
  );
}

const MotifRow: React.FC<MMotif> = (x) => {
  const r = useRef<SVGSVGElement>(null);
  const [rrc, setRC] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Button onClick={() => downloadSVG(r, "logo.svg")}>Download</Button>
        <Button onClick={() => setRC(!rrc)}>Reverse Complement</Button>
      </Grid>
      <Grid item xs={10}>
        <DNALogo
          ppm={rrc ? rc(pwmArray(x.pwm)) : pwmArray(x.pwm)}
          height={50}
          ref={r}
        />
      </Grid>
    </Grid>
  );
};

const COLUMNS: DataTableColumn<MMotif>[] = [
  {
    header: "Motif",
    value: (x) => (isPWMObjectArray(x.pwm) ? x.pwm[0].A : x.pwm[0][0]),
    FunctionalRender: MotifRow,
  },
  {
    header: "Assayed TF",
    value: (x) => x.factor,
    render: (x) => <Link to={`/tf/human/${x.factor}`}>{x.factor}</Link>,
  },
  {
    header: "Experiment",
    value: (x) => x.accession,
    render: (x) => (
      <a
        href={`https://www.encodeproject.org/experiments/${x.accession}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {x.accession}
      </a>
    ),
  },
];

const MotifUMAP: React.FC<{ url: string; title: string }> = (props) => {
  const [data, setData] = useState<MMotif[]>([]);
  const [selection, setSelection] = useState<MMotif[]>([]);

  useEffect(() => {
    fetch(props.url)
      .then((x) => x.blob())
      .then((x) => x.arrayBuffer())
      .then((x) => ungzip(x))
      .then((x) => JSON.parse(new TextDecoder().decode(x)))
      .then((x) => setData(x));
  }, [props.url]);

  const points = useMemo(
    () =>
      data.map((x) => ({
        x: x.coordinates[0],
        y: x.coordinates[1],
        color: x.color,
      })),
    [data]
  );

  const domain = useMemo(
    () =>
      points.length === 0
        ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } }
        : {
            x: {
              start: lower5(Math.min(...points.map((x) => x.x)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.x)) * 1.1),
            },
            y: {
              start: lower5(Math.min(...points.map((x) => x.y)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.y)) * 1.1),
            },
          },
    [points]
  );

  const xScale = scaleLinear({
    domain: [domain.x.start, domain.x.end],
    range: [0, 1100],
  });

  const yScale = scaleLinear({
    domain: [domain.y.start, domain.y.end],
    range: [1000, 0],
  });

  const uref = useRef<SVGSVGElement>(null);

  return data.length === 0 ? (
    <CircularProgress />
  ) : (
    <Box>
      <Typography variant="h6" gutterBottom>
        This view displays a UMAP projection of {points.length.toLocaleString()}{" "}
        motifs discovered by{" "}
        {props.title === "meme"
          ? "MEME on ChIP-seq datasets"
          : "the ZMotif neural network on HT-SELEX datasets"}
        . Hold shift, click, and drag to view information about motif clusters
        in this view or to export them for downstream analysis.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <svg ref={uref} width={1100} height={1000}>
            <Group left={50} top={50}>
              <AxisLeft scale={yScale} />
              <AxisBottom scale={xScale} top={1000} />
              {points.map((point, i) => (
                <GlyphDot
                  key={`point-${i}`}
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r={4}
                  fill={point.color}
                />
              ))}
            </Group>
          </svg>
          <Button
            onClick={() => downloadSVG(uref, "umap.svg")}
            variant="contained"
            color="primary"
          >
            Export Plot as SVG
          </Button>
        </Grid>
        <Grid item xs={6}>
          <DataTable
            columns={COLUMNS}
            rows={selection}
            emptyText="Shift, click, and drag on the UMAP to make a selection"
            itemsPerPage={4}
          />
          {selection.length > 0 && (
            <Button
              onClick={() =>
                downloadData(meme(selection), "motif-collection.meme")
              }
              variant="contained"
              color="primary"
            >
              Download these motifs
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotifUMAP;
