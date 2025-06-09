import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid2,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import {
  SaveAlt as SaveAltIcon,
  ArrowDropDown
} from "@mui/icons-material";
import { formatFactorName } from "@/utilities/misc";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import {
  downloadTSV,
  tissueColors,
  downloadSVG
} from "@/components/tf/geneexpression/utils";
import { groupBy } from "queryz";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/psychscreen-ui-components";

type DataPoint = {
  tissue?: string
  expId?: string
  fileId?: string
  label?: string;
  outlier?: boolean;
}

function getOutlierFlags(values: number[]): boolean[] {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  return values.map(v => v < lowerFence || v > upperFence);
}

const GeneExpressionPage: React.FC<GeneExpressionPageProps> = (props) => {
  const [RNAtype, setRNAtype] = useState(0);
  const [biosample, setBiosample] = useState("tissue");
  const [scale, setScale] = useState<"log" | "linear">("log");

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const downloadOptions = ['Download Data', 'Download Plot as SVG'];

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleDownloadSVG = () => {
    if (!svgRef.current) return

    downloadSVG(svgRef, `${props.gene_name}-violin-plot`)
  };

  const handleRNATypeChange = (event: React.SyntheticEvent, newValue: number) => {
    setBiosample("tissue");
    setRNAtype(newValue);
  };

  const handleScaleChange = (event: React.SyntheticEvent, scale: "log" | "linear") => {
    setScale(scale)
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    if (index === 0) {
      download()
    } else if (index === 1) {
      handleDownloadSVG()
    }
    setOpen(false);
  };

  const downloadAll = () => {
    download();
    handleDownloadSVG();
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
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
    const currentAssay = assayTerm_Names[RNAtype];
    const biosamples = new Set(
      data?.gene_dataset
        .filter((x) => x.assay_term_name === currentAssay)
        .map((x) => x.biosample_type) || []
    );
    return Array.from(biosamples).sort((a, b) => b.localeCompare(a));
  }, [data, assayTerm_Names, RNAtype]);

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
          .filter((g) => g.assay_term_name === [...assayTermNames][RNAtype])
          .filter((x) => x.gene_quantification_files.length > 0) || [],
        (x) => x.biosample_type,
        (x) => x
      ),
    [data, RNAtype]
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
      const rawValues = subGrouped.get(key)
        ?.flatMap((d) =>
          d.gene_quantification_files.map(f => f.quantifications[0]?.tpm)
        )
        .filter((x): x is number => x !== undefined) ?? [];

      const values = rawValues.map(x => scale === "log" ? Math.log10(x + 0.01) : x);
      const outlierFlags = getOutlierFlags(values);

      const tissue = subGrouped.get(key)?.[0]?.tissue;
      const expId = subGrouped.get(key)?.[0]?.accession;
      const fileId = subGrouped.get(key)?.[0]?.gene_quantification_files[0].accession;
      const violinColor = tissue && tissueColors[tissue]
        ? tissueColors[tissue]
        : tissueColors.missing;

      const label = key
        .replace(/-positive/gi, "+")
        .replace(/alpha-beta/gi, "αβ")
        .replace(/\b\w/g, char => char.toUpperCase());

      const data: ViolinPoint<DataPoint & { outlier: boolean }>[] = values.map((value, i) => {
        const metaData: DataPoint & { outlier: boolean } = {
          label,
          fileId,
          expId,
          outlier: outlierFlags[i],
          ...(biosample !== "tissue" && tissue ? { tissue } : {})
        };

        return values.length < 3
          ? { value, radius: 4, metaData }
          : { value, metaData };
      });

      return [{ label, data, violinColor }];
    }),
    [sortedKeys, subGrouped, tissueColors, scale]
  );

  return (
    <Stack spacing={2} sx={{ width: "100%", height: "100%" }}>
      <Typography
        variant="h5"
      >
        {props.gene_name} expression in{" "}
        {biosample}
        {biosample !==
          "in vitro differentiated cells" && "s"}
        : RNA-seq
      </Typography>
      <Grid2 container display={"flex"} justifyContent={"space-between"} alignItems={"flex-end"}>
        <Grid2 size={{ xs: 4, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Biosample Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={biosample}
              label="BiosampleType"
              onChange={handleChange}
              size="small"
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
        <Grid2 size={{ xs: 12, md: 8 }} order={{ xs: 3, md: 2 }} mt={{ xs: 2, md: 0 }}>
          <Stack direction={"row"} justifyContent={{ xs: "space-between", md: "space-around" }}>
            {assayTermNames.size > 1 && (
              <FormControl>
                <FormLabel>RNA-seq Type</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={RNAtype}
                  exclusive
                  onChange={handleRNATypeChange}
                  aria-label="RNA-seq Type"
                  size="small"
                >
                  {[...assayTermNames].map((name, index) => {
                    let displayName = name.charAt(0).toUpperCase() + name.slice(1);

                    if (isXs) {
                      if (name.toLowerCase() === "polya plus rna-seq") {
                        displayName = "PolyA+";
                      } else if (name.toLowerCase() === "total rna-seq") {
                        displayName = "Total";
                      }
                    }

                    return (
                      <ToggleButton
                        key={index}
                        value={index}
                        sx={{ textTransform: "none" }}
                      >
                        {displayName}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Scale</FormLabel>
              <ToggleButtonGroup
                color="primary"
                value={scale}
                exclusive
                onChange={handleScaleChange}
                aria-label="RNA-seq Type"
                size="small"
              >
                <ToggleButton key={"log"} value={"log"} sx={{ textTransform: "none" }}>Log</ToggleButton>
                <ToggleButton key={"linear"} value={"linear"} sx={{ textTransform: "none" }}>Linear</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 8, md: 2 }} display={"flex"} justifyContent={"flex-end"} order={{ xs: 2, md: 3 }}>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            sx={{
              width: 'fit-content',
              minWidth: 'fit-content',
            }}
          >
            <Button onClick={downloadAll} startIcon={<SaveAltIcon />}>Download</Button>
            <Button
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              onClick={handleToggle}
            >
              <ArrowDropDown />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1 }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'right top' : 'right bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {downloadOptions.map((option, index) => (
                        <MenuItem
                          key={option}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem
                        key={"all"}
                        onClick={downloadAll}
                      >
                        Download All
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper >
        </Grid2>
      </Grid2>
      {violinData.length <= 0 ? (
        <Skeleton variant="rounded" width={"100%"} height={600} />
      ) : (
        <Box
          padding={1}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative", width: "100%", height: { xs: "800px", md: "600px" } }}
          ref={containerRef}
        >
          <ViolinPlot
            distributions={violinData}
            loading={violinData.length <= 0}
            violinProps={{
              bandwidth: "scott",
              showAllPoints: true,
              jitter: 10,
            }}
            labelOrientation={isXs ? "horizontal" : "leftDiagonal"}
            axisLabel={scale === "log" ? "log₁₀ TPM" : "TPM"}
            svgRef={svgRef}
            horizontal={isXs}
            pointTooltipBody={(point) => {
              const formatKey = (key: string) =>
                key.replace(/^./, (str) => str.toUpperCase());

              return (
                <Box>
                  {point.metaData?.outlier && (
                    <div>
                      <strong>Outlier</strong>
                    </div>
                  )}
                  <div>
                    <strong>Label:</strong> {point.metaData?.label}
                  </div>
                  <div>
                    <strong>Value:</strong> {point.value.toFixed(2)}
                  </div>
                  {point.metaData?.tissue && (
                    <div>
                      <strong>Tissue:</strong> {formatKey(point.metaData.tissue)}
                    </div>
                  )}
                  {point.metaData?.expId && (
                    <div>
                      <strong>Experiment ID:</strong> {point.metaData.expId}
                    </div>
                  )}
                  {point.metaData?.fileId && (
                    <div>
                      <strong>File ID:</strong> {point.metaData.fileId}
                    </div>
                  )}
                </Box>
              );
            }}

          />
        </Box>
      )}
    </Stack>
  );
};

export default GeneExpressionPage;
