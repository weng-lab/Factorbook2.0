import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import { PEAK_QUERY } from "../../queries";
import { useApolloClient } from "@apollo/client";
import { groupBy } from "lodash";
import {
  PeakIntersectionMergerProps,
  PeakWithSNP,
  IntersectionViewProps,
  GenomicRange,
} from "../../types";
import DataTable from "@weng-lab/psychscreen-ui-components";

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

const PeakIntersectionMerger: React.FC<PeakIntersectionMergerProps> = (
  props
) => {
  const [progress, setProgress] = useState(0);
  const client = useApolloClient();

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
    <Box>
      <Typography variant="h6">
        Searching for intersecting ChIP-seq peaks...
      </Typography>
      <CircularProgress
        variant="determinate"
        value={(progress * 100.0) / props.snps.length}
      />
    </Box>
  );
};

const PeakIntersection: React.FC<IntersectionViewProps> = (props) => {
  const [results, setResults] = useState<PeakWithSNP[] | null>(null);
  const [page, setPage] = useState(0);

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
    <Box>
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
            fontSize: "13px",
            fontFamily: "Helvetica Neue",
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
            fontFamily: "Helvetica Neue",
          },
        }}
      >
        <Tab
          sx={{ textTransform: "none", fontSize: "16px" }}
          label="Summary View"
        />
        <Tab
          sx={{ textTransform: "none", fontSize: "16px" }}
          label="Complete List"
        />
      </Tabs>

      <Box mt={2}>
        {page === 0 ? (
          <Box>
            <Typography variant="h6">Summary View</Typography>
            {/* Render summary view content here */}
          </Box>
        ) : (
          <Box>
            <Typography variant="h6">Complete List</Typography>
            {/* Render complete list content here */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PeakIntersection;
