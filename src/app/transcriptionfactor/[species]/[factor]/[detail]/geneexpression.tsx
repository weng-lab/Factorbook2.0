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
  Grid,
} from "@mui/material";
import {
  Download as DownloadIcon,
  SaveAlt as SaveAltIcon,
} from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import { ViolinPlotMousedOverState } from "./violin/types";
import {
  downloadTSV,
  downloadSVG,
  spacedColors,
  tissueColors,
} from "@/components/tf/geneexpression/utils";
import ViolinPlot from "./violin/violin";
import StyledButton from "@/components/styledbutton";
import { groupBy } from "queryz";

const GeneExpressionPage: React.FC<GeneExpressionPageProps> = (props) => {
  const [value, setValue] = useState(0);
  const { data, loading } = useGeneExpressionData(
    props.assembly,
    formatFactorName(
      props.assembly === "Human"
        ? props.gene_name.toUpperCase()
        : props.gene_name,
      props.assembly
    )
  );
  const [mousedOver, setMousedOver] = useState<ViolinPlotMousedOverState>({
    inner: null,
    outer: null,
  });
  const biosampleTypes = new Set(
    data?.gene_dataset.map((x) => x.biosample_type) || []
  );

  const assayTermNames = new Set(
    data?.gene_dataset.map((x) => x.assay_term_name) || []
  );

  const [biosampleType, setBiosampleType] = useState(0);
  const sortedBiosampleTypes = useMemo(
    () => [...biosampleTypes].sort(),
    [biosampleTypes]
  );
  const ref = useRef<SVGSVGElement>(null);

  const grouped = useMemo(
    () =>
      groupBy(
        data?.gene_dataset
          .filter((g) => g.assay_term_name === [...assayTermNames][value])
          .filter((x) => x.gene_quantification_files.length > 0) || [],
        (x) => x.biosample_type,
        (x) => x
      ),
    [data, value]
  );
  const subGrouped = useMemo(
    () =>
      groupBy(
        grouped.get(sortedBiosampleTypes[biosampleType]) || [],
        (x) =>
          sortedBiosampleTypes[biosampleType] === "tissue"
            ? x.tissue
            : x.biosample,
        (x) => x
      ),
    [grouped, sortedBiosampleTypes, biosampleType]
  );
  const sortedKeys = useMemo(
    () =>
      [...subGrouped.keys()]
        .filter(
          (x) =>
            x !== null &&
            subGrouped
              .get(x)!
              .flatMap((x) => x.gene_quantification_files)
              .filter((x) => x.quantifications[0]?.tpm !== undefined).length > 0
        )
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    [subGrouped]
  );

  const toPlot = useMemo(
    () =>
      new Map(
        sortedKeys
          .map(
            (x) =>
              [
                x,
                new Map([
                  [
                    "all",
                    subGrouped
                      .get(x)!
                      .flatMap((x) =>
                        x.gene_quantification_files.map(
                          (x) => x.quantifications[0]?.tpm
                        )
                      )
                      .filter((x) => x !== undefined)
                      .map((x) => Math.log10(x! + 0.01)),
                  ],
                ]),
              ] as [string, Map<string, number[]>]
          )
          .filter((x) => x[1].get("all")!.length > 1)
      ),
    [sortedKeys, subGrouped]
  );

  const domain: [number, number] = useMemo(() => {
    const values = [...toPlot.values()].flatMap((x) => x.get("all")!);
    return [Math.log10(0.01), Math.max(...values, 4.5)];
  }, [toPlot]);
  const width = useMemo(() => {
    const keys = [...toPlot.keys()].length;
    return (28 + (keys < 27 ? 27 : keys)) * 200;
  }, [toPlot]);
  const color = useCallback(spacedColors(sortedKeys.length), [sortedKeys]);

  const tissueCol = new Map(
    sortedKeys.map((x, i) => {
      const tissue = subGrouped.get(x)![0]["tissue"];
      return [
        x,
        sortedBiosampleTypes[biosampleType] === "tissue"
          ? tissueColors[tissue] ?? tissueColors.missing
          : color(i),
      ];
    })
  );
  const download = useCallback(() => {
    downloadTSV(
      "cell type\ttissue ontology\tbiosample type\texperiment accession\tfile accession\tTPM\n" +
        (
          data?.gene_dataset.flatMap((x) =>
            x.gene_quantification_files.flatMap((q) =>
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return loading ? (
    <CircularProgress style={{ marginTop: "7em" }} />
  ) : (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" color="default">
        {
          <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {[...assayTermNames].map((a) => {
              return <Tab label={a} />;
            })}
          </Tabs>
        }
      </AppBar>
      <Box sx={{ marginTop: "1em" }}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ backgroundColor: "#f5f5f5", padding: "1em" }}>
              <Typography variant="subtitle1" gutterBottom>
                Select a biosample type:
              </Typography>
              {sortedBiosampleTypes.map((t, i) => (
                <MenuItem
                  key={t}
                  onClick={() => setBiosampleType(i)}
                  selected={i === biosampleType}
                >
                  {t}
                  {t !== "in vitro differentiated cells" && "s"}
                </MenuItem>
              ))}
            </Paper>
            {toPlot.size > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  gap: "0.5em",
                  marginLeft: { xs: "0", sm: "-0.1em" },
                  marginTop: "1.5em",
                }}
              >
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  text={`Download all ${
                    [...assayTermNames][value]
                  } expression data for ${props.gene_name}`}
                  href="#"
                  onClick={download}
                />
                <StyledButton
                  startIcon={<SaveAltIcon />}
                  text="Export plot as SVG"
                  href="#"
                  onClick={() =>
                    ref.current &&
                    downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)
                  }
                />
              </Box>
            )}
          </Grid>
          <Grid item sm={0.5}></Grid>
          <Grid item xs={12} sm={8.5}>
            <Paper sx={{ boxShadow: "none" }}>
              <Typography
                variant="h5"
                sx={{ marginLeft: { xs: "0", sm: "3em" }, marginTop: "1em" }}
              >
                {props.gene_name} expression in{" "}
                {sortedBiosampleTypes[biosampleType]}
                {sortedBiosampleTypes[biosampleType] !==
                  "in vitro differentiated cells" && "s"}
                : RNA-seq
              </Typography>
              <br />
              {toPlot.size > 0 ? (
                <svg
                  viewBox={`0 0 ${width} ${width / 2}`}
                  style={{ width: "100%", marginTop: "1em" }}
                  ref={ref}
                >
                  <ViolinPlot
                    data={toPlot}
                    title="log10 TPM"
                    width={width}
                    height={width / 2}
                    colors={tissueCol}
                    domain={domain}
                    tKeys={28}
                    onViolinMousedOut={() =>
                      setMousedOver({ inner: null, outer: null })
                    }
                    onViolinMousedOver={setMousedOver}
                    mousedOver={mousedOver}
                  />
                </svg>
              ) : (
                <Paper
                  sx={{
                    marginLeft: { xs: "0", sm: "6.5em" },
                    width: "70%",
                    padding: "0.5em",
                  }}
                >
                  <Typography variant="body1" color="error">
                    There is no expression data available for the assay and
                    biosample combination you have selected. Please use the
                    menus above and to the left of this message to select a
                    different combination.
                  </Typography>
                </Paper>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default GeneExpressionPage;
