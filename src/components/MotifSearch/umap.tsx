import React, { useEffect, useMemo, useRef, useState } from "react";
import { ungzip } from "pako";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Chart, Scatter } from "jubilant-carnival";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { DNALogo } from "logojs-react";
import { downloadSVG } from "@/components/tf/geneexpression/utils";

import { downloadData } from "@/utilities/svgdata";
import { MMotif, pwmArray, meme, rc, lower5, upper5, range } from "./motifutil";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

const MotifIconsRow: React.FC<MMotif> = (x) => {
  const r = useRef<SVGSVGElement>(null);
  const [rrc, setRC] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <FileDownloadOutlinedIcon onClick={() => downloadSVG(r, "logo.svg")}>
          Download
        </FileDownloadOutlinedIcon>
        <SwapHorizIcon onClick={() => setRC(!rrc)}>
          Reverse Complement
        </SwapHorizIcon>
      </Grid>
    </Grid>
  );
};

const COLUMNS = (title: string) => {
  return [
    {
      header: "",
      value: (x: MMotif) =>
        isPWMObjectArray(x.pwm) ? x.pwm[0].A : x.pwm[0][0],
      FunctionalRender: MotifIconsRow,
    },
    {
      header: "Motif",
      value: (x: MMotif) =>
        isPWMObjectArray(x.pwm) ? x.pwm[0].A : x.pwm[0][0],
      FunctionalRender: MotifRow,
    },
    {
      header: "Assayed TF",
      value: (x: MMotif) => x.factor.split("phospho")[0],
      render: (x: MMotif) => (
        <Link
          style={{ color: "#8169BF" }}
          href={`/transcriptionfactor/human/${x.factor
            .split("phospho")[0]
            .toLowerCase()}/function`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {x.factor}
        </Link>
      ),
    },
    {
      header: "Experiment",
      value: (x: MMotif) => x.accession,
      render: (x: MMotif) => {
        if (title === "selex") return <>{x.accession}</>;
        return (
          <Link
            style={{ color: "#8169BF" }}
            href={`https://www.encodeproject.org/experiments/${x.accession.toLowerCase()}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {x.accession}
          </Link>
        );
      },
    },
  ];
};

const MotifUMAP: React.FC<{ url: string; title: string }> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
        svgProps: { fill: x.color },
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

  const uref = useRef<SVGSVGElement>(null);

  return data.length === 0 ? (
    <CircularProgress />
  ) : (
    <Box sx={{ padding: isMobile ? 2 : isTablet ? 3 : 4 }}>
      <br />
      <Alert
        icon={
          <InfoOutlinedIcon fontSize="inherit" style={{ color: "#5056A9" }} />
        }
        severity="info"
        sx={{
          borderRadius: "24px",
          border: "1px solid rgba(79, 55, 138, 0.16)",
          padding: isMobile ? "6px" : "8px",
          background: "#F2F0FF",
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h6"}
          gutterBottom
          style={{
            fontFamily: "Helvetica Neue",
            color: "#5056A9",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          <b>
            This view displays a UMAP projection of{" "}
            {points.length.toLocaleString()} motifs discovered by{" "}
            {props.title === "meme"
              ? "MEME on ChIP-seq datasets"
              : "the ZMotif neural network on HT-SELEX datasets"}
            .
          </b>{" "}
          <>
            Hold shift, click, and drag to view information about motif clusters
            in this view or to export them for downstream analysis.
          </>
        </Typography>
      </Alert>
      <br />
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Chart
            marginFraction={0.12}
            innerSize={
              isMobile
                ? { width: 300, height: 300 }
                : isTablet
                ? { width: 600, height: 600 }
                : { width: 1100, height: 900 }
            }
            domain={domain}
            xAxisProps={{
              ticks: range(domain.x.start, domain.x.end, 5),
              title: "UMAP-1",
            }}
            yAxisProps={{
              ticks: range(domain.y.start, domain.y.end, 5),
              title: "UMAP-2",
            }}
            scatterData={[points]}
            plotAreaProps={{
              freeformSelection: true,
              onFreeformSelectionEnd: (_, i) =>
                setSelection(i[0].map((x) => data[x])),
            }}
            ref={uref}
          >
            <Scatter data={points} />
          </Chart>
          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            onClick={() => downloadSVG(uref, "umap.svg")}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#8169BF",
              color: "white",
              marginTop: isMobile ? 2 : 4,
            }}
          >
            Export Plot as SVG
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <DataTable
            columns={COLUMNS(props.title)}
            rows={selection}
            emptyText="Shift, click, and drag on the UMAP to make a selection"
            itemsPerPage={isMobile ? 3 : 5}
            sortColumn={1}
            tableTitle="Motifs"
          />
          {selection.length > 0 && (
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#8169BF",
                color: "white",
                marginTop: isMobile ? 2 : 4,
              }}
              onClick={() =>
                downloadData(meme(selection), "motif-collection.meme")
              }
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
