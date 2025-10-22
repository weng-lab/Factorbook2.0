"use client";

import React, { useState, SetStateAction, useMemo } from "react";
import { Grid, Pagination, PaginationItem, Divider, Skeleton, CircularProgress } from "@mui/material";
import {
  Box,
  Typography,
  Button,
  styled,
  useTheme,
  TextField,
  Link,
  Modal,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { DNALogo } from "logojs-react";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { useMotifsInPeak } from "./hooks";
import {
  MotifQueryDataOccurrence,
  MotifQueryDataOccurrenceMotif,
  PeakQueryResponse,
  PeakResult,
  TomtomMatchQueryData,
} from "../types";
import { PEAK_QUERY, TOMTOM_MATCH_QUERY } from "../queries";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledSearchBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});
const LargeTextField = styled(TextField)(({ theme }) => ({
  minWidth: "700px",
  "& .MuiInputBase-root": {
    height: "32px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "5px",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const UploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>(({ isDragging }) => ({
  padding: "16px",
  border: "2px dashed #ccc",
  borderRadius: "8px",
  backgroundColor: isDragging ? "#e0d4f7" : "#F3E8FF",
  textAlign: "center",
  marginTop: "16px",
}));

export type GenomicRange = {
  chromosome?: string;
  start?: number;
  end?: number;
};

export const parseBedFile = async (file: File | null): Promise<GenomicRange[]> => {
  const reader = new FileReader();
  const ret: GenomicRange[] = await new Promise((resolve, reject) => {
    reader.onload = () => {
      const lines = reader.result;
      if (typeof lines === "string") {
        resolve(lines.split("\n").map((line: string) => line.split("\t")).map((a: string[]): GenomicRange => ({
          chromosome: a[0], // chr
          start: parseInt(a[1]), // start
          end: parseInt(a[2]), // end
        })));
      }
    }
    reader.onerror = () => {
      reject(reader.error);
      console.log("Error reading file");
    }
    if (file) {
      reader.readAsText(file);
    }
  });
  return ret;
}

const PEAKS_COLUMNS = (): DataTableColumn<PeakResult>[] => {
  const cols: DataTableColumn<PeakResult>[] = [
    {
      header: "Chromosome",
      value: (row: PeakResult) => row.chrom,
    },
    {
      header: "Start",
      value: (row: PeakResult) => row.chrom_start,
      render: (row: PeakResult) => row.chrom_start.toLocaleString(),
    },
    {
      header: "End",
      value: (row: PeakResult) => row.chrom_end,
      render: (row: PeakResult) => row.chrom_end.toLocaleString(),
    },
    {
      header: "Biosample",
      value: (row: PeakResult) => row.biosample,
    },
    {
      header: "File Accession",
      value: (row: PeakResult) => row.file_accession,
      render: (row: PeakResult) => (
        <Link
          style={{ color: "#8169BF" }}
          rel="noopener noreferrer"
          target="_blank"
          href={`https://www.encodeproject.org/files/${row.file_accession}/`}
        >
          {row.file_accession}
        </Link>
      ),
    },
    {
      header: "log₁₀(q value)",
      value: (row: PeakResult) => row.q_value.toFixed(2),
    },
  ];
  //if (includeFactor) cols.splice(4, 0, { header: 'Factor', value: row => row.target });
  /*cols.push({
    header: "Motifs found",
    value: () => "",
    render: (row: PeakResult) => (
      <MotifCell
        chromosome={row.chrom}
        start={row.chrom_start}
        end={row.chrom_end}
      />
    ),
  } as any);*/
  return cols;
};

const MotifCell: React.FC<{
  chromosome: string;
  start: number;
  end: number;
}> = ({ chromosome, start, end }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: occurrences,
    status,
    error,
  } = useMotifsInPeak({ chromosome, start, end });
  const loading = status === "pending";
  return (
    <div>
      {loading && (
        <CircularProgress size={10} />
      )}
      {error && <span>Error!</span>}
      {!loading &&
        !error &&
        occurrences &&
        (occurrences.length > 0 ? (
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "arial, sans-serif",
              color: "#069",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={() => setModalOpen(true)}
          >
            {occurrences.length >= 30 ? ">30" : occurrences.length}
          </button>
        ) : (
          0
        ))}
      {!loading && !error && occurrences && modalOpen && (
        <>
          <MotifsModal
            open={modalOpen}
            setOpen={setModalOpen}
            chromosome={chromosome}
            start={start}
            end={end}
            occurrences={occurrences}
          />
        </>
      )}
    </div>
  );
};
const PWMCell: React.FC<{
  peaks_accession: string;
  motif: MotifQueryDataOccurrenceMotif;
}> = ({ peaks_accession, motif: { pwm, id } }) => {
  const { data, error, loading } = useQuery<TomtomMatchQueryData>(
    TOMTOM_MATCH_QUERY,
    {
      variables: {
        peaks_accessions: peaks_accession,
        ids: id,
      },
    }
  );
  let matchLine = <></>;
  if (!loading && !error && data) {
    const match = data.target_motifs
      .slice()
      .filter((x) => x.e_value < 1e-5)
      .sort((a, b) => a.e_value - b.e_value)[0];
    if (match === undefined) {
      matchLine = <span>(no external database match)</span>;
    } else {
      const jasparName = match.jaspar_name ? `/${match.jaspar_name}` : "";
      const source = match.target_id.startsWith("MA") ? "JASPAR" : "HOCOMOCO";
      matchLine = <span>{`${match.target_id}${jasparName} (${source})`}</span>;
    }
  }
  return (
    <>
      <DNALogo ppm={pwm} height={"50px"} />
      <br />
      {matchLine}
    </>
  );
};

const MOTIFS_COLS: DataTableColumn<MotifQueryDataOccurrence>[] = [
  {
    header: "Chromosome",
    value: (row) => row.genomic_region.chromosome,
  },
  {
    header: "Start",
    value: (row) => row.genomic_region.start,
    render: (row) => row.genomic_region.start.toLocaleString(),
  },
  {
    header: "Peaks file",
    value: (row) => row.peaks_accession,
  },
  {
    header: "PWM",
    value: () => "",
    render: (row) => (
      <PWMCell peaks_accession={row.peaks_accession} motif={row.motif} />
    ),
  },
  {
    header: "q value",
    value: (row) => row.q_value.toFixed(2),
  },
];

type MotifsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chromosome: string;
  start: number;
  end: number;
  occurrences: MotifQueryDataOccurrence[];
};
const MotifsModal: React.FC<MotifsModalProps> = ({
  open,
  setOpen,
  chromosome,
  start: peakStart,
  end: peakEnd,
  occurrences,
}) => {
  const motifs = useMemo(
    () =>
      occurrences
        .slice()
        .sort((a, b) => a.genomic_region.start - b.genomic_region.start) || [],
    [occurrences]
  );
  const [page, setPage] = useState(1);
  const width = 500;
  const height = 25;
  const start = Math.min(peakStart, motifs[0]?.genomic_region.start || 0);
  const end = Math.max(
    peakEnd,
    motifs[motifs.length - 1]?.genomic_region.end || 0
  );
  const rangeSize = end - start;
  const pageSize = 4;
  const pageStart = Math.min(motifs.length - 1, (page - 1) * pageSize);
  const pageEnd = Math.min(motifs.length, (page - 1 + 1) * pageSize);
  const pageRangeStart = motifs[pageStart]?.genomic_region.start || 0;
  const pageRangeEnd = motifs[pageEnd - 1]?.genomic_region.end || 0;
  const pagePxStart = ((pageRangeStart - start) / rangeSize) * width;
  const pagePxEnd = ((pageRangeEnd - start) / rangeSize) * width;
  const firstY = height * 0.8;
  const secondY = firstY + height * 2;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const pageMotifs = motifs.slice(pageStart, pageEnd);
  const overlaps = (
    range: [number, number],
    instance: MotifQueryDataOccurrence
  ) =>
    instance.genomic_region.start < range[1] &&
    instance.genomic_region.end > range[0];
  let groupRange: [number, number] | undefined = undefined;
  let groups: MotifQueryDataOccurrence[][] = [];
  let group: MotifQueryDataOccurrence[] = [];
  for (let i = 0; i < pageMotifs.length; i++) {
    const instance = pageMotifs[i];
    if (groupRange === undefined) {
      groupRange = [instance.genomic_region.start, instance.genomic_region.end];
    }
    if (overlaps(groupRange, instance)) {
      group.push(instance);
      groupRange[1] = instance.genomic_region.end;
    } else {
      groups.push(group);
      group = [instance];
      groupRange = [instance.genomic_region.start, instance.genomic_region.end];
    }
  }
  groups.push(group);
  const peakView = (
    <svg width={width} height={height * 5}>
      <text textAnchor={"start"} dominantBaseline="hanging" x={0} y={0}>
        {start.toLocaleString()}
      </text>
      <text textAnchor={"end"} dominantBaseline="hanging" x={width} y={0}>
        {end.toLocaleString()}
      </text>
      <rect
        width={width}
        height={height}
        y={firstY}
        rx="5"
        style={{
          fill: "grey",
          strokeWidth: 3,
          stroke: "none",
        }}
      />
      <g>
        {motifs.map((instance, i) => {
          const motifStart = instance.genomic_region.start - start;
          const motifEnd = instance.genomic_region.end - start;
          const pxStart = (width * motifStart) / rangeSize;
          const pxEnd = (width * motifEnd) / rangeSize;
          return (
            <rect
              key={i}
              width={pxEnd - pxStart}
              height={height}
              x={pxStart}
              y={firstY}
              style={{ fill: "red", opacity: "50%" }}
            />
          );
        })}
      </g>
      <line
        x1={pagePxStart}
        x2={0}
        y1={firstY + height}
        y2={secondY}
        style={{ stroke: "black", strokeWidth: "1px" }}
      />
      <line
        x1={pagePxEnd}
        x2={width}
        y1={firstY + height}
        y2={secondY}
        style={{ stroke: "black", strokeWidth: "1px" }}
      />
      <rect
        width={width}
        height={height}
        y={secondY}
        rx="5"
        style={{
          fill: "grey",
          strokeWidth: 3,
          stroke: "none",
        }}
      />
      <g>
        {groups.flatMap((group, groupi) =>
          group.map((instance, i) => {
            const rangeSize = pageRangeEnd - pageRangeStart;
            const start = instance.genomic_region.start - pageRangeStart;
            const end = instance.genomic_region.end - pageRangeStart;
            const pxStart = (width * start) / rangeSize;
            const pxEnd = (width * end) / rangeSize;
            return (
              <rect
                key={groupi * 100 + i}
                x={pxStart}
                width={pxEnd - pxStart}
                y={secondY + i * (height / group.length)}
                height={height / group.length}
                rx={5}
                style={{
                  fill: "red",
                  opacity: "50%",
                  stroke: "darkred",
                  strokeWidth: "1px",
                }}
              />
            );
          })
        )}
      </g>
      <text
        textAnchor={"start"}
        dominantBaseline="baseline"
        x={0}
        y={secondY + height * 1.8}
      >
        {pageRangeStart.toLocaleString()}
      </text>
      <text
        textAnchor={"end"}
        dominantBaseline="baseline"
        x={width}
        y={secondY + height * 1.8}
      >
        {pageRangeEnd.toLocaleString()}
      </text>
    </svg>
  );

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <>
        <Box sx={style}>
          <Typography variant="h4">
            Motifs found in {chromosome}:{peakStart.toLocaleString()}-
            {peakEnd.toLocaleString()}
          </Typography>
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            {peakView}
          </div>
          <br />
          {motifs && (
            <DataTable
              searchable
              columns={MOTIFS_COLS}
              rows={motifs}
              sortColumn={1}
              key={"tfpeaks" + page}
              hidePageMenu
              sortDescending
              itemsPerPage={pageSize}
              page={page - 1}
            />
          )}
          <br />
          {motifs && (
            <Pagination
              sx={{ alignItems: "center", marginLeft: "250px" }}
              renderItem={(item) => (
                <PaginationItem
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#8169BF",
                    },
                  }}
                  {...item}
                />
              )}
              onChange={handleChange}
              count={Math.ceil(motifs.length / pageSize)}
              page={+page}
              color="secondary"
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      </>
    </Modal>
  );
};

const PeakSearch: React.FC = () => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [value, setValue] = useState("");
  const [regions, setRegions] = useState<GenomicRange[]>([]);
  const [isFileUpload, setFileUpload] = useState<boolean>(false)

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const parsed = await parseBedFile(selectedFile);
      setRegions(parsed);
      setFileUpload(true);
    }
  };

  const { factor, species } = useParams<{
    factor: string;
    species: string;
  }>();

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };
  const formattedRegions = useMemo(
    () =>
      regions.map((x) => ({
        chrom: x.chromosome!,
        chrom_start: x.start!,
        chrom_end: x.end!,
      })),
    [regions]
  );

  const {
    data: peaksData,
    loading,
    error,
  } = useQuery<PeakQueryResponse>(PEAK_QUERY, {
    variables: {
      assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
      range: formattedRegions,
      target: factor,
      limit: 1000,
    },
    skip: formattedRegions.length === 0,
  });

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        mt: 4,
      }}
    >
      {
        <>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              {isFileUpload ?
                <Typography variant="h4">
                  {peaksData && peaksData.peaksrange.data
                    ? `Showing ${factor} ChIP-seq peaks`
                    : `Searching ENCODE ChIP-seq peaks for ${factor}`}
                </Typography> :
                <Typography variant="h4">
                  {peaksData && peaksData.peaksrange.data
                    ? `Showing ${factor} ChIP-seq peaks in ${value}`
                    : `Searching ENCODE ChIP-seq peaks for ${factor}`}
                </Typography>
              }
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  setRegions([]);
                }}
                variant="contained"
                color="secondary"
                sx={{
                  width: "220px",
                  height: "41px",
                  padding: "8px 24px",
                  borderRadius: "24px",
                  backgroundColor: "#8169BF",
                  color: "white",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  letterSpacing: "0.46px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#7151A1",
                  },
                }}
              >
                <NavigateBeforeIcon />
                Perform New Search
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
        </>
      }
      {regions.length == 0 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <br />
          <Typography variant="h6" gutterBottom>
            {`Enter genomic coordinates (${species.toLowerCase() === "human" ? "GRCh38" : "mm10"
              }):`}
          </Typography>
          <StyledSearchBox>
            <LargeTextField
              onKeyDown={(event) => {
                if (event.key === "Tab" && !value) {
                  const defaultGenomicRegion = `chr1:${(100000000).toLocaleString()}-${(100101000).toLocaleString()}`;
                  setValue(defaultGenomicRegion);
                }
              }}
              placeholder="Enter a genomic region"
              onChange={handleChange}
              id="region-input"
              value={value}
            />{" "}
            <Button
              variant="contained"
              sx={{
                margin: "auto",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={() => {
                const chromosome = value.split(":")[0];
                const start = +value
                  .split(":")[1]
                  .split("-")[0]
                  .replaceAll(",", "");
                const end = +value
                  .split(":")[1]
                  .split("-")[1]
                  .replaceAll(",", "");
                setRegions([
                  { chromosome: chromosome, start: start!!, end: end!! },
                ]);
                setFileUpload(false)
              }}
            >
              Search
            </Button>
            <br />
            <Typography variant="body2" sx={{ marginLeft: "8px" }}>
              example: chr1:100,000,000-100,101,000
            </Typography>
          </StyledSearchBox>
          {(
            <>
              <Typography variant="h6" gutterBottom>
                You could also upload .bed files here
              </Typography>
              <UploadBox
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDragging={isDragging}
              >
                <DriveFolderUploadIcon fontSize="large" />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Drag and drop .bed files here
                  <br />
                  or
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <input
                    type="file"
                    id="file-input"
                    hidden
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-input">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        display: "block",
                        padding: "8px 16px",
                        backgroundColor: "#8169BF",
                        borderRadius: "24px",
                        textTransform: "none",
                        fontWeight: "medium",
                        color: "#FFFFFF",
                        "&:focus, &:hover, &:active": {
                          backgroundColor: "#8169BF",
                        },
                      }}
                    >
                      Browse Computer
                    </Button>
                  </label>
                </Box>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </UploadBox>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    margin: "auto",
                    backgroundColor: "#8169BF",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: "medium",
                    color: "#FFFFFF",
                    "&:focus, &:hover, &:active": {
                      backgroundColor: "#8169BF",
                    },
                  }}
                  onClick={() => handleFileUpload()}
                  disabled={!selectedFile}
                >
                  Upload File
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
      {loading && (
        <Box sx={{ mx: "auto", alignItems: "center", maxWidth: "1000px" }}>
          <Skeleton variant="rounded" width={"100%"} height={"650px"} />
        </Box>
      )}
      {peaksData && peaksData.peaksrange.data && (
        <Box sx={{ mx: "auto", alignItems: "center", maxWidth: "1000px" }}>
          <DataTable
            key="tfpeaks"
            columns={PEAKS_COLUMNS()}
            rows={peaksData.peaksrange.data}
            itemsPerPage={10}
            sortColumn={1}
            searchable
            tableTitle={`${peaksData.peaksrange.data.length} ${factor} peaks matched your input:`}
          />
        </Box>
      )}
    </Box>
  );
};

export default PeakSearch;