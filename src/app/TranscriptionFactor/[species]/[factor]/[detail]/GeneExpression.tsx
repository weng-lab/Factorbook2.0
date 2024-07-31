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
import { Download as DownloadIcon } from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import {
  downloadTSV,
  downloadSVG,
  spacedColors,
} from "@/components/tf/geneexpression/utils";
import { groupByThenBy } from "@/components/tf/geneexpression/violin/utils";
import { Group } from "@visx/group";
import { ViolinPlot, BoxPlot } from "@visx/stats";
import { scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import {
  withTooltip,
  Tooltip,
  defaultStyles as defaultTooltipStyles,
} from "@visx/tooltip";
import { PatternLines } from "@visx/pattern";

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
  const [polyA, setPolyA] = useState(false);
  const { data, loading } = useGeneExpressionData(
    props.assembly,
    formatFactorName(
      props.gene_name,
      props.assembly === "Human" ? "GRCh38" : "mm10"
    ),
    polyA ? "polyA plus RNA-seq" : "total RNA-seq"
  );

  const biosampleTypes = new Set(
    data?.gene_dataset.map((x: GeneDataset) => x.biosample_type) || []
  );
  const [biosampleType, setBiosampleType] = useState(2);

  const sortedBiosampleTypes = useMemo(
    () =>
      [...biosampleTypes]
        .sort()
        .filter((x) => x !== "in vitro differentiated cells"),
    [biosampleTypes]
  );

  const ref = useRef<SVGSVGElement>(null);

  const grouped = useMemo(() => {
    return groupByThenBy<GeneDataset, GeneDataset>(
      data?.gene_dataset.filter(
        (x: GeneDataset) => x.gene_quantification_files.length > 0
      ) || [],
      (x: GeneDataset) => x.biosample_type,
      (x: GeneDataset) =>
        sortedBiosampleTypes[biosampleType] === "tissue"
          ? x.tissue
          : x.biosample,
      (x: GeneDataset) => x
    );
  }, [data, sortedBiosampleTypes, biosampleType]);

  const sortedKeys = useMemo(() => {
    return Array.from(grouped.keys())
      .filter((key) => {
        const items = grouped.get(key) || new Map<string, GeneDataset[]>();
        const hasSufficientData = Array.from(items.values()).some(
          (innerArray) => {
            return innerArray.some((item: GeneDataset) =>
              item.gene_quantification_files.some(
                (file: GeneQuantificationFile) =>
                  file.quantifications[0]?.tpm !== undefined
              )
            );
          }
        );
        return hasSufficientData;
      })
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [grouped]);

  const toPlot = useMemo(() => {
    const map = new Map<string, Map<string, Quantification[]>>();
    sortedKeys.forEach((key) => {
      const innerMap = grouped.get(key) || new Map<string, GeneDataset[]>();
      innerMap.forEach((innerItems, innerKey) => {
        const data = innerItems
          .flatMap((item: GeneDataset) =>
            item.gene_quantification_files.map(
              (file: GeneQuantificationFile) => file.quantifications[0]?.tpm
            )
          )
          .filter((x): x is number => x !== undefined)
          .map((x) => ({ value: Math.log10(x + 0.01) }));
        if (data.length > 1) {
          if (!map.has(key)) {
            map.set(key, new Map());
          }
          map.get(key)!.set(innerKey, data);
        }
      });
    });
    return map;
  }, [sortedKeys, grouped]);

  const domain: [number, number] = useMemo(() => {
    const values: number[] = Array.from(toPlot.values()).flatMap((map) =>
      Array.from(map.values())
        .flat()
        .map((d) => d.value)
    );
    return [Math.log10(0.01), Math.max(...values, 4.5)];
  }, [toPlot]);

  const width = useMemo(() => {
    const keys = sortedKeys.length;
    return (28 + (keys < 27 ? 27 : keys)) * 200;
  }, [sortedKeys]);

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
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              style={{ marginLeft: "7.5em" }}
              onClick={download}
            >
              Download all {polyA ? "poly-A enriched" : "total RNA-seq"}{" "}
              expression data for {props.gene_name}
            </Button>
            <Button
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
            </Button>
            {toPlot.size > 0 ? (
              <svg
                viewBox={`0 0 ${width} ${width / 2}`}
                style={{ width: "100%" }}
                ref={ref}
              >
                <LinearGradient id="statsplot" to="#8b6ce7" from="#87f2d4" />
                <rect
                  x={0}
                  y={0}
                  width={width}
                  height={width / 2}
                  fill="url(#statsplot)"
                />
                <PatternLines
                  id="hViolinLines"
                  height={3}
                  width={3}
                  stroke="#ced4da"
                  strokeWidth={1}
                  orientation={["horizontal"]}
                />
                <Group top={40}>
                  {sortedKeys.map((key, i) => {
                    const data = (toPlot.get(key)?.get("all") || []).map(
                      (value) => ({ value })
                    );
                    const stats = {
                      median: data[Math.floor(data.length / 2)].value,
                      firstQuartile: data[Math.floor(data.length / 4)].value,
                      thirdQuartile: data[Math.floor(data.length * (3 / 4))],
                    };
                    return (
                      <g key={i}>
                        <ViolinPlot
                          data={data}
                          stroke="#dee2e6"
                          left={i * 200}
                          width={100}
                          valueScale={scaleLinear<number>({
                            range: [width / 2, 0],
                            domain,
                          })}
                          fill="url(#hViolinLines)"
                        />
                        <BoxPlot
                          boxWidth={40}
                          fill="#FFFFFF"
                          fillOpacity={0.3}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          valueScale={scaleLinear<number>({
                            range: [width / 2, 0],
                            domain,
                          })}
                        />
                      </g>
                    );
                  })}
                </Group>
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
// only for my reference
// import React, { useState, useMemo, useCallback, useRef } from "react";
// import {
//   AppBar,
//   Tabs,
//   Tab,
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   MenuItem,
//   Button,
//   Grid,
// } from "@mui/material";
// import { Download as DownloadIcon } from "@mui/icons-material";
// import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
// import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
// import { downloadTSV, downloadSVG } from "@/components/tf/geneexpression/utils";
// import { formatFactorName } from "@/utilities/misc";

// const MotifEnrichmentMEME: React.FC<GeneExpressionPageProps> = (props) => {
//   const [polyA, setPolyA] = useState(false);

//   const formattedFactorName = useMemo(() => {
//     if (!props.gene_name) {
//       console.warn("Gene name is empty or undefined.");
//       return "";
//     }
//     return formatFactorName(
//       props.gene_name,
//       props.assembly === "Human" ? "GRCh38" : "mm10"
//     );
//   }, [props.gene_name, props.assembly]);

//   const { data, loading, error } = useGeneExpressionData(
//     props.assembly,
//     formattedFactorName,
//     polyA ? "polyA plus RNA-seq" : "total RNA-seq"
//   );

//   const biosampleTypes = useMemo(() => {
//     if (!data) return [];
//     const types = new Set(data.gene_dataset.map((item) => item.biosample_type));
//     return Array.from(types).sort();
//   }, [data]);

//   const [biosampleType, setBiosampleType] = useState<string | null>(null);
//   const ref = useRef<SVGSVGElement>(null);

//   const download = useCallback(() => {
//     if (!data) return;
//     const tsvContent = data.gene_dataset
//       .map((item) =>
//         item.gene_quantification_files.map((file) =>
//           file.quantifications.map((q) => ({
//             biosample: item.biosample,
//             tissue: item.tissue,
//             biosample_type: item.biosample_type,
//             accession: item.accession,
//             file_accession: file.accession,
//             tpm: q.tpm,
//           }))
//         )
//       )
//       .flat(2)
//       .map(
//         (item) =>
//           `${item.biosample}\t${item.tissue}\t${item.biosample_type}\t${item.accession}\t${item.file_accession}\t${item.tpm}`
//       )
//       .join("\n");
//     downloadTSV(
//       `biosample\ttissue\tbiosample_type\taccession\tfile_accession\ttpm\n${tsvContent}`,
//       `factorbook-${props.gene_name}-expression.tsv`
//     );
//   }, [data, props.gene_name]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: boolean) => {
//     setPolyA(newValue);
//   };

//   if (loading) return <CircularProgress style={{ marginTop: "7em" }} />;
//   if (error)
//     return (
//       <Typography variant="body1" color="error">
//         {error.message}
//       </Typography>
//     );

//   return (
//     <Box sx={{ width: "100%" }}>
//       <AppBar position="static" color="default">
//         <Tabs
//           value={polyA}
//           onChange={handleTabChange}
//           indicatorColor="primary"
//           textColor="primary"
//           variant="fullWidth"
//         >
//           <Tab label="Poly-A enriched" value={true} />
//           <Tab label="Total RNA-seq" value={false} />
//         </Tabs>
//       </AppBar>
//       <Grid container>
//         <Grid item xs={3}>
//           <Paper>
//             <Typography variant="h6" gutterBottom>
//               Select a biosample type:
//             </Typography>
//             {biosampleTypes.map((type, index) => (
//               <MenuItem
//                 key={type}
//                 onClick={() => setBiosampleType(type)}
//                 selected={type === biosampleType}
//               >
//                 {type}
//               </MenuItem>
//             ))}
//           </Paper>
//         </Grid>
//         <Grid item xs={9}>
//           <Paper>
//             <Typography variant="h5" style={{ marginLeft: "5em" }}>
//               {props.gene_name} expression in {biosampleType}: RNA-seq
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               size="small"
//               startIcon={<DownloadIcon />}
//               style={{ marginLeft: "7.5em" }}
//               onClick={download}
//             >
//               Download all {polyA ? "poly-A enriched" : "total RNA-seq"}{" "}
//               expression data for {props.gene_name}
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               size="small"
//               startIcon={<DownloadIcon />}
//               style={{ marginLeft: "7.5em" }}
//               onClick={() =>
//                 ref.current &&
//                 downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)
//               }
//             >
//               Export plot as SVG
//             </Button>
//             {data ? (
//               <svg ref={ref} width="100%" height="400"></svg>
//             ) : (
//               <Typography variant="body1" color="error">
//                 No data available for the selected biosample type.
//               </Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default MotifEnrichmentMEME;
