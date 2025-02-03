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
  Stack,
} from "@mui/material";
import {
  Download as DownloadIcon,
  SaveAlt as SaveAltIcon,
} from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import { ViolinPlotMousedOverState } from "./_violin/types";
import {
  downloadTSV,
  downloadSVG,
  spacedColors,
  tissueColors,
} from "@/components/tf/geneexpression/utils";
import ViolinPlot from "./_violin/violin";
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
    () => [...biosampleTypes].sort((a, b) => b.localeCompare(a)),
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

  //find the longest label on the x axis
  const height = useMemo(() => {
    // Create a hidden SVG to measure label dimensions
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    let maxWidth = 0;

    [...toPlot.keys()].forEach((label) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = label;
      text.setAttribute("style", "font-size: 12px; visibility: hidden;");
      svg.appendChild(text);
      const bbox = text.getBBox();
      if (bbox.width > maxWidth) {
        maxWidth = bbox.width;
      }
      svg.removeChild(text);
    });

    document.body.removeChild(svg);
    return (maxWidth * 10);

  }, [width, toPlot])

  const color = useCallback(spacedColors(sortedKeys.length), [sortedKeys]);

  const tissueCol = new Map(
    sortedKeys.map((x, i) => {
      const tissue = subGrouped.get(x)![0]["tissue"];
      return [
        x,
      tissueColors[tissue] ?? tissueColors.missing
          
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
                  `${x.biosample}\t${x.tissue}\t${x.biosample_type}\t${x.accession
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
      {assayTermNames.size > 1 && (
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable" // Allows the tabs to scroll when necessary
            scrollButtons="auto" // Displays navigation buttons for overflow
            aria-label="Gene expression tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent:
                  assayTermNames.size === 1 ? "center" : "flex-start", // Center if one tab
              },
              "& .MuiTab-root": {
                textTransform: "none", // Keep the original case for the text
                whiteSpace: "nowrap", // Prevent text wrapping
                overflow: "hidden", // Handle overflow gracefully
                textOverflow: "ellipsis", // Truncate long text
                maxWidth: "200px", // Set a reasonable maximum width for tabs
                fontSize: "0.9rem", // Adjust font size for better fit
                padding: "6px 12px", // Adjust padding for better alignment
              },
            }}
          >
            {[...assayTermNames].map((a, index) => (
              <Tab
                key={index}
                label={
                  a === "in vitro differentiated cells"
                    ? "In Vitro Cells" // Shortened version for better fit
                    : a === "Total RNA-Seq"
                      ? "Total RNA-Seq"
                      : a
                }
              />
            ))}
          </Tabs>
        </AppBar>
      )}
      <Box sx={{ marginTop: "1em" }}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Paper
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "1em",
                maxWidth: "100%", // Ensure it does not exceed the container
                overflow: "hidden", // Prevent overflow of content
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Select a biosample type:
              </Typography>
              {sortedBiosampleTypes.map((t, i) => {
                const capitalizeWords = (str: string) =>
                  str.replace(/\b\w/g, (char) => char.toUpperCase());

                return (
                  <MenuItem
                    key={t}
                    onClick={() => setBiosampleType(i)}
                    selected={i === biosampleType}
                  >
                    {t === "in vitro differentiated cells" ? (
                      <>
                        <i>In Vitro</i>&nbsp;Differentiated Cells
                      </>
                    ) : (
                      capitalizeWords(`${t}${t !== "in vitro differentiated cells" ? "s" : ""}`)
                    )}
                  </MenuItem>
                );
              })}

            </Paper>

          </Grid>
          <Grid item sm={0.5}></Grid>
          <Grid item xs={12} sm={8.5}>
            <Stack>
              <Paper sx={{ boxShadow: "none" }}>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "1em" }}
                >
                  {props.gene_name} expression in{" "}
                  {sortedBiosampleTypes[biosampleType]}
                  {sortedBiosampleTypes[biosampleType] !==
                    "in vitro differentiated cells" && "s"}
                  : RNA-seq
                </Typography>
                <br />
                {toPlot.size > 0 ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: 5
                        }}
                      >
                        <StyledButton
                          startIcon={<SaveAltIcon />}
                          text={`Download all ${[...assayTermNames][value]
                            } expression data for ${props.gene_name}`}
                          href="#"
                          onClick={download}
                          sx={{
                            display: "flex",
                            maxWidth: "100%",
                          }}
                        />
                        <StyledButton
                          startIcon={<SaveAltIcon />}
                          text="Export plot as SVG"
                          href="#"
                          onClick={() =>
                            ref.current &&
                            downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)
                          }
                          sx={{
                            display: "flex",
                            maxWidth: "100%"
                          }}
                        />
                      </Box>
                      <svg
                        viewBox={`0 0 ${width} ${(width / 3) + (height)}`}
                        style={{ width: "100%", marginTop: "1em" }}
                        ref={ref}
                      >
                        <ViolinPlot
                          data={toPlot}
                          title="log₁₀ TPM"
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
                    </>
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
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default GeneExpressionPage;
