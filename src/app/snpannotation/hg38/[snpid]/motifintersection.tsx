import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MotifIntersectionMergerProps,
  MotifOccurrenceMatchWithSNP,
  IntersectionViewProps,
  GenomicRange,
  MinorAlleleFrequency,
  SNPWithMotifCount,
  RdhsOccurrenceMatch,
} from "../../types";
import { groupBy } from "lodash";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { MOTIF_QUERY, RDHS_OCCU_QUERY } from "../../queries";
import { ApiContext } from "@/apicontext";
import AnnotatedLogo from "./annotatedlogo";

const usePrevious = (value: String) => {
  const ref = useRef<String>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

function f(coordinates: GenomicRange): {
  chromosome: string;
  start: number;
  end: number;
} {
  return {
    chromosome: coordinates.chromosome!,
    start: coordinates.start!,
    end: coordinates.end!,
  };
}

const MotifIntersectionMerger: React.FC<MotifIntersectionMergerProps> = (
  props
) => {
  const [progress, setProgress] = useState(0);
  const context = useContext(ApiContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (!context) {
    console.error("ApiContext is undefined");
    return null;
  }

  const { client } = context;

  const next = useCallback(
    (i: number, results: MotifOccurrenceMatchWithSNP[]) => {
      if (i === props.snps.length) {
        props.onResultsReceived(results);
      } else if (!props.snps[i]?.coordinates?.chromosome) {
        next(i + 1, results);
      } else {
        client
          .query({
            query: props.rdhs ? RDHS_OCCU_QUERY : MOTIF_QUERY,
            variables: { range: f(props.snps[i].coordinates) },
            errorPolicy: "ignore",
          })
          .then((x) => {
            setProgress(i + 1);
            const d = props.rdhs
              ? (x.data as any).rdhs_motif_occurrences
                  .filter((x: any) => x && x.motif !== null)
                  .map((x: any) => ({ ...x, snp: props.snps[i] }))
              : (x.data as any).meme_occurrences
                  .filter((x: any) => x && x.motif !== null)
                  .map((x: any) => ({ ...x, snp: props.snps[i] }));

            next(i + 1, [...results, ...d]);
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
    <Box sx={{ padding: isMobile ? 2 : isTablet ? 3 : 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"}>
        Searching for intersecting TF motifs...
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          marginTop: isMobile ? 2 : 3,
        }}
      >
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

function fq(x: MinorAlleleFrequency): number {
  return (x.afr_af + x.amr_af + x.eas_af + x.eur_af + x.sas_af) / 5;
}

const alteredValue = (
  pwm: number[][],
  snp: number,
  ref: string,
  alt: string,
  strand: string
): number => {
  const index = strand === "+" ? snp : pwm.length - snp - 1;
  const refIndex = strand === "+" ? 0 : 3;
  const altIndex = strand === "+" ? 1 : 2;
  if (!pwm[index] || !pwm[index][altIndex] || !pwm[index][refIndex]) return 0.0;
  return Math.abs(pwm[index][altIndex] - pwm[index][refIndex]);
};

const MOTIF_TABLE_COLUMNS: DataTableColumn<SNPWithMotifCount>[] = [
  {
    header: "SNP",
    value: (x) => x.id || "",
  },
  {
    header: "r squared with lead SNP",
    value: (x) => (x.rSquared !== undefined ? x.rSquared : 0),
  },
  {
    header: "Total intersecting motifs",
    value: (x) => (x.motifCount !== undefined ? x.motifCount : 0),
  },
];

const COMPLETE_MOTIF_TABLE_COLUMNS: DataTableColumn<MotifOccurrenceMatchWithSNP>[] =
  [
    {
      header: "SNP",
      value: (x) => x.snp?.id || "",
    },
    {
      header: "SNP coordinates",
      value: (x) => {
        if (
          x.snp?.coordinates?.chromosome !== undefined &&
          x.snp?.coordinates?.start !== undefined &&
          x.snp?.coordinates?.end !== undefined
        ) {
          return `${x.snp.coordinates.chromosome}:${x.snp.coordinates.start}-${x.snp.coordinates.end}`;
        }
        return "";
      },
    },
    {
      header: "r squared with lead SNP",
      value: (x) =>
        x.snp?.rSquared !== undefined ? x.snp.rSquared.toString() : "0",
    },
    {
      header: "Annotated logo",
      value: (x) =>
        x.snp.coordinates.start &&
        x.genomic_region.start &&
        x.snp.refAllele &&
        x.snp.minorAlleleFrequency[0] &&
        x.snp.minorAlleleFrequency[0].sequence
          ? alteredValue(
              x.motif.pwm,
              x.snp.coordinates.start! - x.genomic_region.start!,
              x.snp.refAllele,
              x.snp.minorAlleleFrequency[0].sequence,
              x.strand
            )
          : 0,
      render: (x) => (
        <AnnotatedLogo
          pwm={x.motif.pwm}
          minorAlleles={x.snp.minorAlleleFrequency.map((x) => ({
            sequence: x.sequence,
            frequency: fq(x),
          }))}
          refAllele={x.snp.refAllele}
          refFrequency={x.snp.refFrequency}
          motifCoordinates={x.genomic_region}
          snpCoordinates={x.snp.coordinates}
          strand={x.strand}
        />
      ),
    },
    {
      header: "Best database match",
      value: (x) => {
        const bestMatch = x.motif.tomtom_matches
          ?.slice()
          .sort((a, b) => a.e_value - b.e_value)[0];
        return bestMatch
          ? `${bestMatch.target_id}${
              bestMatch.jaspar_name ? `/${bestMatch.jaspar_name}` : ""
            } (${bestMatch.target_id.startsWith("MA") ? "JASPAR" : "HOCOMOCO"})`
          : "--";
      },
    },
  ];

const MotifIntersectionView: React.FC<IntersectionViewProps> = (props) => {
  const [results, setResults] = useState<MotifOccurrenceMatchWithSNP[] | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [val, setVal] = useState<String>("meme");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const groupedSNPs = useMemo(() => {
    const grouped = groupBy(results || [], (x) => x.snp?.id || "");
    return props.snps.map((snp) => ({
      ...snp,
      motifCount:
        grouped[snp.id]?.filter(
          (x) =>
            x.motif?.flank_p_value < 0.05 && x.motif?.shuffled_p_value < 0.05
        ).length || 0,
    }));
  }, [results, props.snps]);

  const filteredResults = useMemo(
    () =>
      (results || []).filter(
        (x) =>
          x.motif &&
          typeof x.motif.flank_p_value === "number" &&
          typeof x.motif.shuffled_p_value === "number" &&
          x.motif.flank_p_value < 0.05 &&
          x.motif.shuffled_p_value < 0.05
      ),
    [results]
  );

  const prevVal = usePrevious(val);

  const completeViewTableColumns = useMemo(() => {
    return val === "rdhs"
      ? [
          ...COMPLETE_MOTIF_TABLE_COLUMNS,
          {
            header: "occurrence p-value",
            value: (x) =>
              x.p_value !== undefined ? x.p_value : "N/A",
          },
          {
            header: "rdhs",
            value: (x) =>
              x.rdhs !== undefined ? x.rdhs : "N/A",
          },
        ]
      : COMPLETE_MOTIF_TABLE_COLUMNS;
  }, [val]);

  return results === null || val !== prevVal ? (
    <MotifIntersectionMerger
      rdhs={val === "rdhs"}
      snps={props.snps}
      onResultsReceived={setResults}
      assembly={props.assembly}
    />
  ) : (
    <Box sx={{ padding: isMobile ? 2 : isTablet ? 3 : 4 }}>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="annotation type"
          name="annotation-type"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        >
          <FormControlLabel
            value="meme"
            control={<Radio color="secondary" />}
            label="ChIP-seq peak Motif Sites"
          />
          <FormControlLabel
            value="rdhs"
            control={<Radio color="secondary" />}
            label="rDHS Motif Sites Occurrences"
          />
        </RadioGroup>
      </FormControl>

      <Box
        sx={{
          borderColor: "#8389E0",
          borderRadius: "5px",
          padding: "5px",
          background: "var(--info-hover, #8389E00A)",
          border: "1px solid var(--info-outlinedBorder, #8389E080)",
          height: "38px",
          marginTop: isMobile ? 1 : 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: isMobile ? "11px" : "13px",
          }}
        >
          Searched {props.snps.length} SNPs, of which{" "}
          {groupedSNPs.filter((x) => x.motifCount > 0).length} intersect at
          least one TF motif.
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
            columns={MOTIF_TABLE_COLUMNS}
            rows={groupedSNPs}
            itemsPerPage={isMobile ? 5 : 7}
            sortColumn={2}
            searchable
          />
        ) : (
          <DataTable
            columns={completeViewTableColumns}
            rows={filteredResults}
            itemsPerPage={isMobile ? 3 : 5}
            searchable
          />
        )}
      </Box>
    </Box>
  );
};

export default MotifIntersectionView;
