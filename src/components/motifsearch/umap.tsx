import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  ZoomIn,
  ZoomOut,
  PanTool,
  Edit,
  HighlightAlt,
} from "@mui/icons-material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { DNALogo } from "logojs-react";
import { downloadSVG } from "@/components/tf/geneexpression/utils";
import { ParentSize } from "@visx/responsive";
import { downloadData } from "@/utilities/svgdata";
import { MMotif, pwmArray, meme, rc } from "./motifutil";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Chart, Point } from "./scatterplot";

// Define MetaData to include `tooltipValues` and `pwm` properties
interface MetaData {
  tooltipValues?: {
    accession: string;
    dbd: string;
    factor: string;
  };
  pwm: { A: number; C: number; G: number; T: number }[];
}

// Color definitions
const colors = {
  1: "#FFA500",
  2: "#FF0000",
  3: "#008000",
  4: "#0000FF",
  5: "#A52A2A",
  6: "#FFD700",
  7: "#90EE90",
};

// Type guard to check if PWM is in expected object array format
function isPWMObjectArray(
  pwm: { A: number; C: number; G: number; T: number }[] | number[][]
): pwm is { A: number; C: number; G: number; T: number }[] {
  return (
    (pwm as { A: number; C: number; G: number; T: number }[])[0].A !== undefined
  );
}

// Define the formatPWM function outside any component so it can be reused
function formatPWM(
  pwm: { A: number; C: number; G: number; T: number }[] | number[][]
): number[][] {
  if (isPWMObjectArray(pwm)) {
    // Convert { A: number, C: number, G: number, T: number }[] to number[][]
    return pwm.map((item) => [item.A, item.C, item.G, item.T]);
  } else {
    // PWM is already in number[][] format
    return pwm;
  }
}

// MotifRow component
const MotifRow: React.FC<MMotif> = (x) => {
  const r = useRef<SVGSVGElement>(null);
  const [rrc, setRC] = useState(false);
  const formattedPWM = formatPWM(pwmArray(x.pwm));

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <DNALogo
          ppm={rrc ? rc(formattedPWM) : formattedPWM}
          height={100}
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

// Define DataTable columns
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

// Main UMAP component
const MotifUMAP: React.FC<{ url: string; title: string }> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [selectMode, setSelectMode] = useState<"select" | "pan">("select");
  const [data, setData] = useState<MMotif[]>([]);
  const [selection, setSelection] = useState<MMotif[]>([]);
  const [zoom, setZoom] = useState({ scaleX: 1, scaleY: 1 });
  const [showMiniMap, setShowMiniMap] = useState(false);

  useEffect(() => {
    fetch(props.url)
      .then((x) => x.blob())
      .then((x) => x.arrayBuffer())
      .then((x) => ungzip(x))
      .then((x) => JSON.parse(new TextDecoder().decode(x)))
      .then((x) => setData(x));
  }, [props.url]);

  // Data transformation for scatter plot
  const scatterData = useMemo(() => {
    if (!data) return [];

    return data.map((x) => ({
      x: x.coordinates[0],
      y: x.coordinates[1],
      r: 4, // Increased radius of scatter points for larger appearance
      color: x.color,
      opacity:
        selection.length === 0
          ? 1
          : selection.some(
              (s) =>
                s.coordinates[0] === x.coordinates[0] &&
                s.coordinates[1] === x.coordinates[1]
            )
          ? 1
          : 0.01,
      metaData: {
        accession: x.accession,
        dbd: x.dbd,
        factor: x.factor,
        pwm: x.pwm,
        sites: x.sites,
        e: x.e,
        coordinates: x.coordinates,
        color: x.color,
        tooltipValues: {
          accession: x.accession,
          dbd: x.dbd,
          factor: x.factor,
        },
      },
    })) as Point<MetaData>[];
  }, [data, selection]);

  const umapLoading = data.length === 0;

  const points = useMemo(
    () =>
      data.map((x) => ({
        x: x.coordinates[0],
        y: x.coordinates[1],
        svgProps: { fill: x.color },
      })),
    [data]
  );

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => ({
      scaleX: prevZoom.scaleX * 1.2,
      scaleY: prevZoom.scaleY * 1.2,
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => ({
      scaleX: prevZoom.scaleX * 0.8,
      scaleY: prevZoom.scaleY * 0.8,
    }));
  }, []);

  const toggleMiniMap = useCallback(() => {
    setShowMiniMap((prev) => !prev);
  }, []);

  const handleSelectionChange = (selectedPoints: Point<MetaData>[]) => {
    const selectedData = selectedPoints
      .map((s) => s.metaData as MMotif)
      .filter((metaData): metaData is MMotif => metaData !== undefined);

    setSelection(selectedData);
  };

  const handleReset = useCallback(() => {
    setZoom({
      scaleX: 1,
      scaleY: 1,
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setSelectMode("pan");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setSelectMode("select");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const graphRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const map = useMemo(() => {
    return {
      show: showMiniMap,
      position: {
        right: 50,
        bottom: 50,
      },
      ref: graphContainerRef,
    };
  }, [showMiniMap]);

  useEffect(() => {
    const graphElement = graphRef.current;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    if (graphElement) {
      graphElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (graphElement) {
        graphElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return umapLoading ? (
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
      <Grid container spacing={1}>
        <Grid xs={4}>
          <Stack
            overflow={"hidden"}
            padding={1}
            sx={{
              border: "2px solid",
              borderColor: "grey.400",
              borderRadius: "8px",
              height: "80vh",
              width: "80vh", // Increased height for larger plot area
              position: "relative",
            }}
            ref={graphContainerRef}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              mt={1}
              sx={{
                backgroundColor: "#dbdefc",
                borderRadius: "8px",
                zIndex: 10,
              }}
            >
              <Button endIcon={selection.length !== 0 && <Visibility />}>
                {`${selection.length} Motifs Selected`}
              </Button>
              <Button onClick={() => setSelection([])}>Clear Selection</Button>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{ position: "relative", maxHeight: 800 }} // Increased max height
            >
              <Box sx={{ width: 800, height: 800 }} ref={graphRef}>
                <Chart
                  width={800} // Increased width
                  height={800} // Increased height
                  pointData={scatterData}
                  loading={umapLoading}
                  selectionType={selectMode}
                  onSelectionChange={handleSelectionChange}
                  zoomScale={zoom}
                  miniMap={map}
                  leftAxisLable="UMAP-2"
                  bottomAxisLabel="UMAP-1"
                  tooltipBody={(point) => {
                    const formattedPWM = point.metaData?.pwm
                      ? formatPWM(point.metaData.pwm)
                      : null;
                    return (
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        {formattedPWM && (
                          <DNALogo ppm={formattedPWM} height={40} />
                        )}
                        {point.metaData?.tooltipValues && (
                          <>
                            <Typography variant="body2">
                              <strong>Accession:</strong>{" "}
                              {point.metaData.tooltipValues.accession}
                            </Typography>
                            <Typography variant="body2">
                              <strong>DBD:</strong>{" "}
                              {point.metaData.tooltipValues.dbd}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Factor:</strong>{" "}
                              {point.metaData.tooltipValues.factor}
                            </Typography>
                          </>
                        )}
                      </Box>
                    );
                  }}
                />
              </Box>
            </Stack>

            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={5}
              sx={{
                position: "absolute",
                left: 3,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <Tooltip title="Drag to select">
                <IconButton
                  aria-label="edit"
                  onClick={() => setSelectMode("select")}
                  sx={{
                    color: selectMode === "select" ? "primary.main" : "default",
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Drag to pan, or hold Shift and drag">
                <IconButton
                  aria-label="pan"
                  onClick={() => setSelectMode("pan")}
                  sx={{
                    color: selectMode === "pan" ? "primary.main" : "default",
                  }}
                >
                  <PanTool />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton aria-label="zoom-in" onClick={handleZoomIn}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton aria-label="zoom-out" onClick={handleZoomOut}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Button
                sx={{ height: "30px", textTransform: "none" }}
                size="small"
                variant="outlined"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Stack>
            <Tooltip title="Toggle Minimap">
              <IconButton
                sx={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  zIndex: 10,
                  width: "auto",
                  height: "auto",
                  color: showMiniMap ? "primary.main" : "default",
                }}
                size="small"
                onClick={toggleMiniMap}
              >
                <HighlightAlt />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid item container xs={5.5} ml={40}>
          {" "}
          {/* Adjust ml value for spacing */}
          <Grid item xs={10}>
            <DataTable
              columns={COLUMNS(props.title)}
              rows={selection}
              emptyText="Drag on the UMAP to make a selection"
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
      </Grid>
    </Box>
  );
};

export default MotifUMAP;
