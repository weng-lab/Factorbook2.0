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
  Stack
} from "@mui/material";
//import { Chart, Scatter } from "jubilant-carnival";
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
import { ParentSize } from '@visx/responsive';
import { Chart } from './scatterplot'

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
          href={`/transcriptionfactor/human/${
            x.factor.split("phospho")[0]
          }/Function`}
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
            href={`https://www.encodeproject.org/experiments/${x.accession}`}
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
  const [selectMode, setSelectMode] = useState<"select" | "pan">("select")
  const [zoom, setZoom] = useState({ scaleX: 1, scaleY: 1 });
  const [showMiniMap, setShowMiniMap] = useState(false);
  const graphContainerRef = useRef(null);
  const graphRef = useRef(null);
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

  const map = useMemo(() => {
    return {
        show: showMiniMap,
        position: {
            right: 50,
            bottom: 50, 
        },
        ref: graphContainerRef
    };
  }, [showMiniMap]);

  const umapLoading = data.length === 0

  const scatterData = useMemo(() => {
    if (!data) return [];
   
    return data.map((x) => {
      return {
        x: x.coordinates[0],
        y: x.coordinates[1],
        r: 2,
        color: x.color,
        opacity: 1,
        metaData: {
          accession: x.accession,
          dbd: x.dbd,
          factor: x.factor,
          pwm: x.pwm,
          e: x.e,
          sites: x.sites

        }
      };
    });
  }, [data]);
  const handleSelectionChange = (selectedPoints: any) => {
    console.log(selectedPoints)
    
  };

  

  return data.length === 0 ? (
    <CircularProgress />
  ) : (
    <>
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
      <Stack sx={{paddingX:15}}>
      <Grid mt={2} container spacing={2}>
        <Grid item>
            <Stack direction="row" spacing={5}>
                <ParentSize>
                  {({ width, height }) => {
                    const squareSize = Math.min(width, height);
                    return (
                      <Stack overflow={"hidden"} padding={1} sx={{ border: '2px solid', borderColor: 'grey.400', borderRadius: '8px', height: '57vh', position: 'relative' }} ref={graphContainerRef}>
                        
                        <Stack justifyContent="center" alignItems="center" direction="row" sx={{ position: "relative", maxHeight: height }}>
                          <Box sx={{ width: squareSize, height: squareSize }} ref={graphRef}>
                            <Chart
                              width={squareSize - 25}
                              height={squareSize - 25}
                              pointData={scatterData}
                              loading={umapLoading}
                              selectionType={selectMode}
                              onSelectionChange={handleSelectionChange}
                              zoomScale={zoom}
                              miniMap={map}
                              leftAxisLable="UMAP-2"
                              bottomAxisLabel="UMAP-1"
                            />
                          </Box>
                        </Stack>
                        
                      </Stack>
                    )}
                  }
                </ParentSize>
              
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
            
            

          </Stack>
    </Grid>
    </Grid>
    </Stack>
    </>
  );
};

export default MotifUMAP;
