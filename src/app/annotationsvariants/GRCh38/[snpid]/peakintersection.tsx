import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PEAK_QUERY } from "../../queries";
import { useApolloClient } from "@apollo/client";
import { groupBy } from "lodash";
import {
  PeakIntersectionMergerProps,
  PeakWithSNP,
  IntersectionViewProps,
  GenomicRange,
  SNPWithPeakCount,
} from "../../types";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import Link from "next/link";

function f(coordinates: GenomicRange): {
  chrom: string;
  chrom_start: number;
  chrom_end: number;
} {
  return {
    chrom: coordinates.chromosome!,
    chrom_start: coordinates.start!,
    chrom_end: coordinates.end!,
  };
}

// Modified to ensure lowercase URLs
const tfRoute = (species?: string, factor?: string, details?: string): string =>
  `/transcriptionfactor${species ? `/${species.toLowerCase()}` : ""}${
    species && factor ? `/${factor.toLowerCase()}` : ""
  }${species && factor && details ? `/${details.toLowerCase()}` : ""}/function`;

const PEAK_TABLE_COLUMNS: DataTableColumn<SNPWithPeakCount>[] = [
  {
    header: "SNP",
    value: (x) => x.id,
  },
  {
    header: "r squared with lead SNP",
    value: (x) => x.rSquared || 0,
  },
  {
    header: "Total intersecting peaks",
    value: (x) => x.peakCount,
  },
  {
    header: "Unique factors with intersecting peaks",
    value: (x) => x.factorCount,
  },
];

const COMPLETE_PEAK_TABLE_COLUMNS: DataTableColumn<PeakWithSNP>[] = [
  {
    header: "SNP",
    value: (x) => x.snp?.id || "",
  },
  {
    header: "SNP coordinates",
    value: (x) =>
      `${x.snp?.coordinates?.chromosome || ""}:${
        x.snp?.coordinates?.start || ""
      }`,
  },
  {
    header: "r squared with lead SNP",
    value: (x) =>
      x.snp?.rSquared !== undefined ? x.snp.rSquared.toString() : "0",
  },
  {
    header: "Peak coordinates",
    value: (x) =>
      `${x.chrom || ""}:${x.chrom_start || ""}-${x.chrom_end || ""}`,
  },
  {
    header: "Peak biosample",
    value: (x) => x.dataset?.biosample || "",
    render: (x) => (x.dataset?.biosample ? x.dataset.biosample : ""),
  },
  {
    header: "Peak factor",
    value: (x) => x.dataset?.target || "",
    render: (x) =>
      x.dataset?.target ? (
        <Link
          href={tfRoute("human", x.dataset.target)}
          style={{ color: "purple" }}
        >
          {x.dataset.target}
        </Link>
      ) : (
        ""
      ),
  },
  {
    header: "ChIP-seq experiment accession",
    value: (x) => x.experiment_accession || "",
    render: (x) =>
      x.experiment_accession ? (
        <a
          href={`https://www.encodeproject.org/experiments/${x.experiment_accession}`}
          style={{ color: "purple" }}
        >
          {x.experiment_accession}
        </a>
      ) : (
        ""
      ),
  },
  {
    header: "Peak q-value",
    value: (x) =>
      x.q_value !== undefined ? x.q_value.toString().slice(0, 4) : "N/A",
  },
];

const PeakIntersectionMerger: React.FC<PeakIntersectionMergerProps> = (
  props
) => {
  const [progress, setProgress] = useState(0);
  const client = useApolloClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const next = useCallback(
    (i: number, results: PeakWithSNP[]) => {
      if (i === props.snps.length) {
        props.onResultsReceived(results);
      } else if (!props.snps[i]?.coordinates?.chromosome) {
        next(i + 1, results);
      } else {
        client
          .query({
            query: PEAK_QUERY,
            variables: {
              assembly: props.assembly,
              range: f(props.snps[i].coordinates),
            },
          })
          .then((response) => {
            const newResults = [
              ...results,
              ...response.data.peaks.peaks.map((peak: any) => ({
                ...peak,
                snp: props.snps[i],
              })),
            ];
            setProgress(i + 1);
            next(i + 1, newResults);
          });
      }
    },
    [client, props]
  );

  useEffect(() => {
    setProgress(0);
    next(0, []);
  }, [props.snps, next]);

  return (
    <Box sx={{ padding: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"}>
        Searching for intersecting ChIP-seq peaks...
      </Typography>

      <Box sx={{ position: "relative", display: "inline-flex", marginTop: 2 }}>
        <CircularProgress
          variant="determinate"
          value={(progress * 100.0) / props.snps.length}
          color="secondary"
        />

        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >{`${((progress * 100.0) / props.snps.length).toFixed(
            0
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const PeakIntersection: React.FC<IntersectionViewProps> = (props) => {
  const [results, setResults] = useState<PeakWithSNP[] | null>(null);
  const [page, setPage] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const groupedSNPs = useMemo(() => {
    const grouped = groupBy(results || [], (x) => x.snp.id);
    return props.snps.map((snp) => ({
      ...snp,
      peakCount: grouped[snp.id]?.length || 0,
      factorCount:
        new Set(grouped[snp.id]?.map((x) => x.dataset.target)).size || 0,
    }));
  }, [results, props.snps]);

  return results === null ? (
    <PeakIntersectionMerger
      snps={props.snps}
      onResultsReceived={setResults}
      assembly={props.assembly}
    />
  ) : (
    <Box sx={{ padding: isMobile ? 2 : 4 }}>
      <Box
        sx={{
          borderColor: "#8389E0",
          borderRadius: "5px",
          padding: "5px",
          background: "var(--info-hover, #8389E00A)",
          border: "1px solid var(--info-outlinedBorder, #8389E080)",
          height: "38px",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: isMobile ? "11px" : "13px",
            marginLeft: "3px",
          }}
        >
          Searched {props.snps.length} SNPs, of which{" "}
          {groupedSNPs.filter((x) => x.peakCount > 0).length} intersect at least
          one ENCODE TF ChIP-seq peak.
        </Typography>
      </Box>

      <Tabs
        value={page}
        onChange={(_, newValue) => setPage(newValue)}
        indicatorColor="secondary"
        textColor="secondary"
        centered
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            fontSize: isMobile ? "14px" : "16px",
          },
        }}
      >
        <Tab sx={{ textTransform: "none" }} label="Summary View" />
        <Tab sx={{ textTransform: "none" }} label="Complete List" />
      </Tabs>

      <Box mt={2}>
        {page === 0 ? (
          <DataTable
            key="summary"
            columns={PEAK_TABLE_COLUMNS}
            rows={groupedSNPs}
            itemsPerPage={isMobile ? 5 : 10}
            searchable
          />
        ) : (
          <DataTable
            key="complete"
            columns={COMPLETE_PEAK_TABLE_COLUMNS}
            rows={results}
            itemsPerPage={isMobile ? 5 : 10}
            searchable
          />
        )}
      </Box>
    </Box>
  );
};

export default PeakIntersection;
