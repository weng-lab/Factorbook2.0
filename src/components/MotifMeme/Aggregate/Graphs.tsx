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
  const validProximalValues = Array.isArray(proximal_values)
    ? proximal_values
    : [];
  const validDistalValues = Array.isArray(distal_values) ? distal_values : [];

  const minLength = Math.min(
    validProximalValues.length,
    validDistalValues.length
  );
  const adjustedProximalValues = validProximalValues.slice(0, minLength);
  const adjustedDistalValues = validDistalValues.slice(0, minLength);

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

  return (
    <>
      {!hideTitle && (
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          style={{
            marginBottom: dataset.target === "PhyloP 100-way" ? "0em" : "-1em",
          }}
        >
          {title || dataset.target}
        </Typography>
      )}
      <MultiXLineChart
        xDomain={{ start: -(limit || 2000), end: limit || 2000 }}
        yDomain={{
          start: padBottom ? min - range / 5 : min,
          end: max + range / 5,
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
              x !== undefined ? Math.round(x).toString() : "",
          },
        }}
        ref={sref}
      />
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
