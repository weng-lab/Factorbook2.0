import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  MenuItem,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid2
} from "@mui/material";
import {
  SaveAlt as SaveAltIcon,
} from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import {
  downloadTSV,
  downloadSVG,
  tissueColors,
} from "@/components/tf/geneexpression/utils";
import { groupBy } from "queryz";
import LoadingExpression from "./loading";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/psychscreen-ui-components";

type DataPoint = {
  tissue?: string
}

const GeneExpressionPage: React.FC<GeneExpressionPageProps> = (props) => {
  const [value, setValue] = useState(0);
  const [biosample, setBiosample] = useState("tissue");

  const ref = useRef<SVGSVGElement>(null);

  const { data } = useGeneExpressionData(
    props.assembly,
    formatFactorName(
      props.assembly === "GRCh38"
        ? props.gene_name.split(/phospho/i)[0].toUpperCase()
        : props.gene_name.split(/phospho/i)[0],
      props.assembly
    )
  );

  const handleChange = (event: SelectChangeEvent) => {
    setBiosample(event.target.value);
  };

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
    setBiosample("tissue");
    setValue(newValue);
  };

  // Get sorted list of unique assay names
  const assayTerm_Names = useMemo(
    () =>
      Array.from(
        new Set(data?.gene_dataset.map((x) => x.assay_term_name) || [])
      ),
    [data]
  );

  // Compute biosample types only for selected assay
  const biosampleTypesForSelectedAssay = useMemo(() => {
    const currentAssay = assayTerm_Names[value];
    const biosamples = new Set(
      data?.gene_dataset
        .filter((x) => x.assay_term_name === currentAssay)
        .map((x) => x.biosample_type) || []
    );
    return Array.from(biosamples).sort((a, b) => b.localeCompare(a));
  }, [data, assayTerm_Names, value]);

  const assayTermNames = new Set(
    data?.gene_dataset.map((x) => x.assay_term_name) || []
  );

  const sortedBiosampleTypes = useMemo(
    () => [...biosampleTypesForSelectedAssay].sort((a, b) => b.localeCompare(a)),
    [biosampleTypesForSelectedAssay]
  );

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
        grouped.get(biosample) || [],
        (x) =>
          biosample === "tissue"
            ? x.tissue
            : x.biosample,
        (x) => x
      ),
    [grouped, biosample]
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

  const violinData: Distribution<DataPoint>[] = useMemo(() =>
    sortedKeys.flatMap((key) => {
      const values = subGrouped.get(key)
        ?.flatMap((d) =>
          d.gene_quantification_files.map(f => f.quantifications[0]?.tpm)
        )
        .filter((x): x is number => x !== undefined)
        .map(x => Math.log10(x + 0.01)) ?? [];

      const tissue = subGrouped.get(key)?.[0]?.tissue;
      const violinColor = tissue && tissueColors[tissue]
        ? tissueColors[tissue]
        : tissueColors.missing;

      // Capitalize each word in the key
      const label = key.replace(/\b\w/g, char => char.toUpperCase());

      const data: ViolinPoint<DataPoint>[] = values.map(value => (
        values.length < 3
          ? { value, radius: 4, tissue }
          : { value, tissue }
      ));

      return [{ label, data, violinColor }];
    }),
    [sortedKeys, subGrouped, tissueColors]
  );

  return violinData.length <= 0 ? (
    LoadingExpression()
  ) : (
    <Box sx={{ width: "100%", height: "100%" }}>
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
      <Stack spacing={2}>
        <Typography
          variant="h5"
          sx={{ marginTop: "1em" }}
        >
          {props.gene_name} expression in{" "}
          {biosample}
          {biosample !==
            "in vitro differentiated cells" && "s"}
          : RNA-seq
        </Typography>
        <Grid2 container display={"flex"} justifyContent={"space-between"}>
          <Grid2 size={2}>
            <FormControl fullWidth sx={{ height: "100%" }}>
              <InputLabel id="demo-simple-select-label">Biosample Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={biosample}
                label="BiosampleType"
                onChange={handleChange}
                sx={{ height: "100%" }}
              >
                {sortedBiosampleTypes.map((t, i) => {
                  const capitalizeWords = (str: string) =>
                    str.replace(/\b\w/g, (char) => char.toUpperCase());

                  return (
                    <MenuItem key={i} value={t}>
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
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={6}>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"} sx={{ height: "100%" }}>
              <Button
                variant="contained"
                startIcon={<SaveAltIcon />}
                onClick={download}
              >
                {`Download all ${[...assayTermNames][value]} expression data for ${props.gene_name}`}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveAltIcon />}
                onClick={() => ref.current && downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)}
              >
                Export plot as SVG
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
        <Box
          padding={1}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative", width: "100%", height: "600px" }}
        >
          <ViolinPlot
            distributions={violinData}
            loading={violinData.length <= 0}
            violinProps={{
              bandwidth: "scott",
              showAllPoints: true,
              jitter: 10,
            }}
            labelOrientation="leftDiagonal"
            axisLabel="log₁₀ TPM"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default GeneExpressionPage;
