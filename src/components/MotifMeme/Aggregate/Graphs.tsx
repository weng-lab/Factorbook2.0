import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { MultiXLineChart, LegendEntry } from "jubilant-carnival";
import JSZip from "jszip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useAggregateData, useHistoneMetadata } from "./hooks";
import { GraphProps, GraphSetProps, CollapsibleGraphsetProps } from "./types";
import { MARK_COLORS, MARK_TYPES, MARK_TYPE_ORDER } from "./marks";
import { associateBy, groupBy } from "queryz";
import { shadeHexColor } from "@/utilities/misc";
import { downloadBlob, svgDataE } from "@/components/tf/geneexpression/utils";

export const Graph: React.FC<GraphProps> = ({
  proximal_values,
  distal_values,
  dataset,
  is_forward_reverse,
  title,
  limit,
  xlabel,
  ylabel,
  height,
  yMax,
  padBottom,
  hideTitle,
  sref,
  lref,
  yMin,
  is_stranded_motif,
  semiTransparent,
}) => {
  // Ensure proximal_values and distal_values are arrays
  const validProximalValues = Array.isArray(proximal_values)
    ? proximal_values
    : [];
  const validDistalValues = Array.isArray(distal_values) ? distal_values : [];

  // Ensure proximal_values and distal_values have the same length
  const minLength = Math.min(
    validProximalValues.length,
    validDistalValues.length
  );
  const adjustedProximalValues = validProximalValues.slice(0, minLength);
  const adjustedDistalValues = validDistalValues.slice(0, minLength);

  // Calculate max and min values for yDomain
  const max = useMemo(
    () =>
      Math.max(...adjustedProximalValues, ...adjustedDistalValues, yMax ?? 5),
    [adjustedDistalValues, adjustedProximalValues, yMax]
  );
  const min = useMemo(
    () =>
      yMin ?? Math.min(...adjustedProximalValues, ...adjustedDistalValues, 0),
    [adjustedDistalValues, adjustedProximalValues, yMin]
  );
  const range = max - min;
  const color = MARK_COLORS[dataset.target] || "#000000";
  const darkColor = useMemo(() => shadeHexColor(color, -0.4), [color]);

  // Ensure max and min are valid numbers
  const validMax = isNaN(max) ? 0 : max;
  const validMin = isNaN(min) ? 0 : min;

  return (
    <>
      {!hideTitle && (
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          style={{
            marginBottom:
              dataset && dataset.target === "PhyloP 100-way" ? "0em" : "-1em",
          }}
        >
          {title || dataset.target}
        </Typography>
      )}
      <MultiXLineChart
        xDomain={{ start: -(limit || 2000), end: limit || 2000 }}
        yDomain={{
          start: padBottom ? validMin - range / 5 : validMin,
          end: validMax + range / 5,
        }}
        lineProps={{
          strokeWidth: 4,
          strokeOpacity: semiTransparent ? 0.6 : 1.0,
        }}
        data={[
          { data: adjustedProximalValues, label: "proximal", color },
          { data: adjustedDistalValues, label: "distal", color: darkColor },
        ]}
        innerSize={{ width: 400, height: height || 280 }}
        xAxisProps={{
          fontSize: 15,
          title: xlabel || "distance from summit (bp)",
        }}
        yAxisProps={{ fontSize: 12, title: ylabel || "fold change signal" }}
        plotAreaProps={{
          withGuideLines: true,
          guideLineProps: { hideHorizontal: true },
        }}
        legendProps={{
          size: { width: 135, height: 55 },
          headerProps: {
            numberFormat: (x: number) =>
              x !== undefined && x !== null ? Math.round(x).toString() : "",
          },
        }}
        ref={sref}
      >
        {/* {children} */}
      </MultiXLineChart>
      <svg viewBox="0 0 400 40" style={{ marginTop: "-0.4em" }} ref={lref}>
        <g transform="translate(95,0)">
          <LegendEntry
            label={{
              color,
              label: is_forward_reverse
                ? "motif strand"
                : is_stranded_motif
                ? "(+) strand motif"
                : "TSS-proximal",
              value: "",
            }}
            simple
            size={{ width: 150, height: 25 }}
            rectProps={{ height: 7, y: 9 }}
          />
        </g>
        <g transform="translate(210,0)">
          <LegendEntry
            label={{
              color: darkColor,
              label: is_forward_reverse
                ? "complement strand"
                : is_stranded_motif
                ? "(-) strand motif"
                : "TSS-distal",
              value: "",
            }}
            simple
            size={{ width: 150, height: 25 }}
            rectProps={{ height: 7, y: 9 }}
          />
        </g>
      </svg>
    </>
  );
};

const CollapsibleGraphSet: React.FC<CollapsibleGraphsetProps> = ({
  title,
  graphs,
}) => {
  const [collapsed, setCollapsed] = useState(
    title !== "Activating histone marks"
  );
  const refs = useRef<(SVGSVGElement | null)[]>(graphs.map(() => null));
  const lrefs = useRef<(SVGSVGElement | null)[]>(graphs.map(() => null));

  const download = useCallback(() => {
    const z = new JSZip();
    graphs.forEach((g, i) => {
      const svgContent =
        refs.current[i] && lrefs.current[i]
          ? svgDataE(
              [
                refs.current[i] as SVGSVGElement,
                lrefs.current[i] as SVGSVGElement,
              ],
              [[0, g.height || 0]]
            )
          : "<svg></svg>";
      z.file(`${g.dataset.target}.svg`, svgContent);
    });
    z.generateAsync({ type: "blob" }).then((c) =>
      downloadBlob(c, "histone-aggregate-plots.zip")
    );
  }, [graphs, refs]);

  return (
    <>
      <Typography
        variant="h5"
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        {title}&nbsp;
        <IconButton>
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Typography>
      <Divider />
      <Grid container spacing={2}>
        {!collapsed &&
          graphs.map((graph, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Graph
                lref={(e) => (lrefs.current[i] = e)}
                sref={(e) => (refs.current[i] = e)}
                {...graph}
              />
            </Grid>
          ))}
      </Grid>
      {!collapsed && (
        <Button variant="contained" color="primary" onClick={download}>
          Export Plots as SVG
        </Button>
      )}
    </>
  );
};

const GraphSet: React.FC<GraphSetProps> = ({ tfAccession }) => {
  const { data, loading } = useAggregateData(tfAccession);
  const metadata = useHistoneMetadata(
    data
      ? data.histone_aggregate_values.map(
          (x: any) => x.histone_dataset_accession
        )
      : [],
    loading
  );

  if (loading || !data || metadata.loading || !metadata.data)
    return <CircularProgress />;

  const values = associateBy(
    data.histone_aggregate_values,
    (x: any) => x.histone_dataset_accession,
    (x) => x
  );
  const marks = associateBy(
    metadata.data.peakDataset.datasets,
    (x: any) => x.target,
    (x) => x
  );
  const typeGroups = groupBy(
    [...marks.keys()],
    (x) => MARK_TYPES[x],
    (x) => ({
      dataset: marks.get(x)!,
      proximal_values: values.get(marks.get(x)!.accession)!.proximal_values,
      distal_values: values.get(marks.get(x)!.accession)!.distal_values,
    })
  );

  return (
    <div style={{ marginTop: "2em" }}>
      {MARK_TYPE_ORDER.filter((type) => typeGroups.get(type)).map((type) => (
        <CollapsibleGraphSet title={type} graphs={typeGroups.get(type)!} />
      ))}
    </div>
  );
};

export default GraphSet;
