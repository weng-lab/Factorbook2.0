import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Paper,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { groupBy } from 'queryz';
import { Download as DownloadIcon } from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import { ViolinPlotMousedOverState } from './violin/types';
import {
  downloadTSV,
  downloadSVG,
  spacedColors,
} from "@/components/tf/geneexpression/utils";
import ViolinPlot from './violin/violin';
import styled from "@emotion/styled";

export const StyledButton = styled(Button)(() => ({
  textTransform: "none" as any,
}));

type GeneQuantificationFile = {
  accession: string;
  quantifications: {
    tpm?: number;
  }[];
};

type GeneDataset = {
  accession: string;
  biosample: string;
  biosample_type: string;
  tissue: string;
  gene_quantification_files: GeneQuantificationFile[];
};

type Quantification = {
  value: number;
};

const GeneExpressionPage: React.FC<GeneExpressionPageProps> = (props) => {
  console.log(props,"ge props")
  const [polyA, setPolyA] = useState(false);
  const { data, loading } = useGeneExpressionData(
    props.assembly,
    formatFactorName(
      props.gene_name,
      props.assembly
    ),
    polyA ? "polyA plus RNA-seq" : "total RNA-seq"
  );
  console.log("data",data)
  const [mousedOver, setMousedOver] = useState<ViolinPlotMousedOverState>({ inner: null, outer: null });
  const biosampleTypes = new Set(
    data?.gene_dataset.map((x: GeneDataset) => x.biosample_type) || []
  );
  const [biosampleType, setBiosampleType] = useState(2);
  const sortedBiosampleTypes = useMemo(
    () => [...biosampleTypes].sort().filter(x => x !== 'in vitro differentiated cells'),
    [biosampleTypes]
);
const ref = useRef<SVGSVGElement>(null);

const grouped = useMemo(
    () =>
        groupBy(
            data?.gene_dataset.filter(x => x.gene_quantification_files.length > 0) || [],
            x => x.biosample_type,
            x => x
        ),
    [data]
);
const subGrouped = useMemo(
    () =>
        groupBy(
            grouped.get(sortedBiosampleTypes[biosampleType]) || [],
            x => (sortedBiosampleTypes[biosampleType] === 'tissue' ? x.tissue : x.biosample),
            x => x
        ),
    [grouped, sortedBiosampleTypes, biosampleType]
);
const sortedKeys = useMemo(
    () =>
        [...subGrouped.keys()]
            .filter(
                x =>
                    x !== null &&
                    subGrouped
                        .get(x)!
                        .flatMap(x => x.gene_quantification_files)
                        .filter(x => x.quantifications[0]?.tpm !== undefined).length > 2
            )
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    [subGrouped]
);
const toPlot = useMemo(
    () =>
        new Map(
            sortedKeys
                .map(
                    x =>
                        [
                            x,
                            new Map([
                                [
                                    'all',
                                    subGrouped
                                        .get(x)!
                                        .flatMap(x =>
                                            x.gene_quantification_files.map(x => x.quantifications[0]?.tpm)
                                        )
                                        .filter(x => x !== undefined)
                                        .map(x => Math.log10(x! + 0.01)),
                                ],
                            ]),
                        ] as [string, Map<string, number[]>]
                )
                .filter(x => x[1].get('all')!.length > 1)
        ),
    [sortedKeys, subGrouped]
);

console.log("toplot",toPlot)
const domain: [number, number] = useMemo(() => {
    const values = [...toPlot.values()].flatMap(x => x.get('all')!);
    return [Math.log10(0.01), Math.max(...values, 4.5)];
}, [toPlot]);
const width = useMemo(() => {
    const keys = [...toPlot.keys()].length;
    return (28 + (keys < 27 ? 27 : keys)) * 200;
}, [toPlot]);
const color = useCallback(spacedColors(sortedKeys.length), [sortedKeys]);
  const download = useCallback(() => {
    downloadTSV(
      "cell type\ttissue ontology\tbiosample type\texperiment accession\tfile accession\tTPM\n" +
        (
          data?.gene_dataset.flatMap((x: GeneDataset) =>
            x.gene_quantification_files.flatMap((q: GeneQuantificationFile) =>
              q.quantifications
                .filter((x) => x.tpm !== undefined)
                .map(
                  (v) =>
                    `${x.biosample}\t${x.tissue}\t${x.biosample_type}\t${
                      x.accession
                    }\t${q.accession}\t${v.tpm!.toFixed(2)}`
                )
            )
          ) || []
        ).join("\n"),
      `factorbook-${props.gene_name}-expression.tsv`
    );
  }, [props.gene_name, data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setPolyA(newValue);
  };

  return loading ? (
    <CircularProgress style={{ marginTop: "7em" }} />
  ) : (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" color="default">
        <Tabs
          value={polyA}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Poly-A enriched" value={true} />
          <Tab label="Total RNA-seq" value={false} />
        </Tabs>
      </AppBar>
      <Grid container>
        <Grid item xs={3}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Select a biosample type:
            </Typography>
            {sortedBiosampleTypes.map((t, i) => (
              <MenuItem
                key={t}
                onClick={() => setBiosampleType(i)}
                selected={i === biosampleType}
              >
                {t}s
              </MenuItem>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Typography variant="h5" style={{ marginLeft: "5em" }}>
              {props.gene_name} expression in{" "}
              {sortedBiosampleTypes[biosampleType]}s: RNA-seq
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              style={{ marginLeft: "7.5em" }}
              onClick={download}
            >
              Download all {polyA ? "poly-A enriched" : "total RNA-seq"}{" "}
              expression data for {props.gene_name}
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              style={{ marginLeft: "7.5em" }}
              onClick={() =>
                ref.current &&
                downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)
              }
            >
              Export plot as SVG
            </StyledButton>
            {toPlot.size > 0 ? (
            <svg viewBox={`0 0 ${width} ${width / 2}`} style={{ width: '100%' }} ref={ref}>
              <ViolinPlot
                  data={toPlot}
                  title="log10 TPM"
                  width={width}
                  height={width / 2}
                  colors={new Map(sortedKeys.map((x, i) => [x, color(i)]))}
                  domain={domain}
                  tKeys={28}
                  onViolinMousedOut={() => setMousedOver({ inner: null, outer: null })}
                  onViolinMousedOver={setMousedOver}
                  mousedOver={mousedOver}
              />
            </svg>
            ) : (
              <Paper
                style={{ marginLeft: "6.5em", width: "70%", padding: "1em" }}
              >
                <Typography variant="body1" color="error">
                  There is no expression data available for the assay and
                  biosample combination you have selected. Please use the menus
                  above and to the left of this message to select a different
                  combination.
                </Typography>
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneExpressionPage;
