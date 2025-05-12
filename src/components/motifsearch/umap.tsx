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
  Typography,
  Box,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Visibility,
} from "@mui/icons-material";
import {
  DataTable,
  DataTableColumn,
  ScatterPlot,
  Point
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
import { MetaData } from "./types";
import LoadingMemeUmap from "@/app/motif/human/meme-umap/loading";
import Grid from "@mui/material/Grid2"

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
  const r = useRef<SVGSVGElement>(null); // Reference for the DNA logo
  const [rrc, setRC] = useState(false); // State for Reverse Complement

  // Format PWM dynamically based on reverse complement state
  const formattedPWM = useMemo(() => {
    const pwm = formatPWM(pwmArray(x.pwm));
    return rrc ? rc(pwm) : pwm; // Reverse complement logic
  }, [x.pwm, rrc]);

  const handleReverseComplement = useCallback(() => {
    setRC((prev) => !prev); // Toggle reverse complement
  }, []);

  return (
    <Grid container spacing={2} alignItems="center">
      {/* Left-side Buttons */}
      <Grid size={2}>
        <Tooltip title="Reverse Complement">
          <IconButton onClick={handleReverseComplement}>
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download Logo">
          <IconButton
            onClick={() =>
              downloadSVG(r, `${x.accession}_${rrc ? "rc" : ""}_logo.svg`)
            }
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      {/* DNA Logo */}
      <Grid size={10}>
        <DNALogo ppm={formattedPWM} height={100} ref={r} />
      </Grid>
    </Grid>
  );
};

// Define DataTable columns
const COLUMNS = (title: string): DataTableColumn<MMotif>[] => {
  return [
    {
      header: "Motif",
      value: (x: MMotif) =>
        isPWMObjectArray(x.pwm) ? x.pwm[0].A : x.pwm[0][0],
      render: MotifRow,
    },
    {
      header: "Assayed TF",
      value: (x: MMotif) => x.factor.split(/phospho/i)[0],
      render: (x: MMotif) => (
        <Link
          style={{ color: "#8169BF" }}
          href={`/tf/human/${x.factor.split(/phospho/i)[0]
            }/function`}
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
  const [data, setData] = useState<MMotif[]>([]);
  const [selection, setSelection] = useState<MMotif[]>([]);
  const graphContainerRef = useRef<HTMLDivElement>(null);

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
      r: 2,
      color: x.color,
      shape: "circle",
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

  const handleSelectionChange = (selectedPoints: Point<MetaData>[]) => {
    const selectedData = selectedPoints
      .map((s) => s.metaData as MMotif)
      .filter((metaData): metaData is MMotif => metaData !== undefined);

    setSelection(selectedData);
  };

  const map = {
    position: {
      right: 50,
      bottom: 50,
    }
  };

  return umapLoading ? (
    LoadingMemeUmap()
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
            Click and drag around points to view information about motif clusters
            in this view or to export them for downstream analysis.
          </>
        </Typography>
      </Alert>
      <br />
      <Grid container spacing={5} alignItems={"flex-start"}>
        <Grid size={isMobile || isTablet ? 12 : 6}>
          <Stack overflow={"hidden"} padding={1} sx={{ border: '2px solid', borderColor: 'grey.400', borderRadius: '8px', height: '60vh', position: 'relative' }} ref={graphContainerRef}>
            <Stack direction="row" justifyContent="space-between" mt={1} sx={{ backgroundColor: '#dbdefc', borderRadius: '8px', zIndex: 10 }}>
              <Button endIcon={selection.length !== 0 && <Visibility />}>
                {`${selection.length} Motifs Selected`}
              </Button>
              <Button onClick={() => setSelection([])}>Clear Selection</Button>
            </Stack>
            <ScatterPlot
              pointData={scatterData}
              loading={umapLoading}
              selectable
              onSelectionChange={handleSelectionChange}
              miniMap={map}
              leftAxisLabel="UMAP-2"
              bottomAxisLabel="UMAP-1"
              tooltipBody={(point) => {
                const formattedPWM = point.metaData?.pwm
                  ? formatPWM(point.metaData.pwm)
                  : null;
                return (
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    {formattedPWM && (
                      <DNALogo ppm={formattedPWM} height={100} />
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
          </Stack>
        </Grid>
        <Grid size={isMobile || isTablet ? 12 : 6}>
          <Box
            sx={{
              maxHeight: isMobile ? "auto" : "auto", // Adjust height for mobile and desktop
              overflow: isMobile ? "auto" : "auto", // Enable scrolling for smaller screens
              border: "1px solid",
              borderRadius: "8px",
              padding: isMobile ? 1 : 2,
              backgroundColor: isMobile ? "#f9f9f9" : "inherit", // Optional: Set a background color for clarity
            }}
          >
            <div style={{ fontSize: isMobile ? "10px" : "14px" }}>
              <DataTable
                columns={COLUMNS(props.title)} // Use fewer columns if needed on mobile
                rows={selection}
                emptyText="Drag on the UMAP to make a selection"
                itemsPerPage={isMobile ? 3 : 5} // Adjust items per page for smaller screens
                sortColumn={1}
                tableTitle="Motifs"
              />
            </div>

            {selection.length > 0 && (
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#8169BF",
                  color: "white",
                  marginTop: isMobile ? 2 : 4,
                  width: isMobile ? "100%" : "auto", // Make the button full width on mobile
                }}
                onClick={() =>
                  downloadData(meme(selection), "motif-collection.meme")
                }
              >
                Download these motifs
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotifUMAP;
