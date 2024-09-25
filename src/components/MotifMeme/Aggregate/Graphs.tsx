import React, { useMemo, useState, useCallback, forwardRef } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { Tooltip, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { curveMonotoneX } from "d3-shape";
import { MARK_COLORS } from "./marks";
import { Box } from "@mui/material";

interface GraphProps {
  proximal_values: number[];
  distal_values: number[];
  dataset: { target: string };
  title?: string;
  limit?: number;
  xlabel?: string;
  ylabel?: string;
  height?: number;
  yMax?: number;
  padBottom?: boolean;
  hideTitle?: boolean;
}

interface TooltipData {
  x: number;
  y: number;
}

const Graph = forwardRef<SVGSVGElement, GraphProps>(
  (
    {
      proximal_values = [],
      distal_values = [],
      dataset,
      title,
      limit = 2000, // Set default limit if not provided
      xlabel = "Position",
      ylabel = "Signal",
      height = 300,
      yMax,
      padBottom = false,
      hideTitle = false,
    },
    ref
  ) => {
    const width = 300; // Reduced width
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const {
      showTooltip,
      hideTooltip,
      tooltipLeft,
      tooltipTop,
      tooltipData: tooltipContent,
    } = useTooltip<TooltipData>();

    const color = MARK_COLORS[dataset.target] || "#000000"; // Apply color based on target

    // Fixed reference to limit
    const xScale = useMemo(
      () =>
        scaleLinear({
          domain: [-(limit || 2000), limit || 2000],
          range: [margin.left, width - margin.right],
        }),
      [limit, margin.left, margin.right, width]
    );

    const yScale = useMemo(
      () =>
        scaleLinear({
          domain: [
            padBottom ? Math.min(...proximal_values, ...distal_values) : 0,
            yMax || Math.max(...proximal_values, ...distal_values),
          ],
          range: [height - margin.bottom, margin.top],
        }),
      [
        proximal_values,
        distal_values,
        padBottom,
        yMax,
        height,
        margin.bottom,
        margin.top,
      ]
    );

    const bisectData = bisector((d: number) => d).left;

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x);
        const index = bisectData(proximal_values, x0, 1);
        const y = proximal_values[index];
        if (y !== undefined) {
          setTooltipData({ x: x0, y });
          showTooltip({
            tooltipData: { x: x0, y },
            tooltipLeft: xScale(x0),
            tooltipTop: yScale(y),
          });
        }
      },
      [proximal_values, xScale, yScale, showTooltip, bisectData]
    );

    return (
      <Box style={{ position: "relative", marginBottom: "2em" }}>
        <svg ref={ref} width={width} height={height}>
          <Group>
            {!hideTitle && (
              <text
                x={width / 2}
                y={margin.top}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
              >
                {title || dataset.target}
              </text>
            )}
            <LinePath
              data={proximal_values}
              x={(d, i) => xScale(i - proximal_values.length / 2)}
              y={(d) => yScale(d)}
              stroke={color}
              strokeWidth={2}
              curve={curveMonotoneX}
              onMouseMove={handleMouseMove}
              onMouseLeave={hideTooltip}
            />
            <LinePath
              data={distal_values}
              x={(d, i) => xScale(i - distal_values.length / 2)}
              y={(d) => yScale(d)}
              stroke={color}
              strokeWidth={2}
              opacity={0.6}
              curve={curveMonotoneX}
              onMouseMove={handleMouseMove}
              onMouseLeave={hideTooltip}
            />
            <AxisBottom
              top={height - margin.bottom}
              scale={xScale}
              numTicks={5}
              label={xlabel}
            />
            <AxisLeft
              left={margin.left}
              scale={yScale}
              numTicks={5}
              label={ylabel}
            />
          </Group>
        </svg>
        {tooltipContent && tooltipContent.y !== undefined && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
            }}
          >
            <div>
              <strong>{`x: ${tooltipContent.x.toFixed(2)}`}</strong>
            </div>
            <div>
              <strong>{`y: ${tooltipContent.y.toFixed(2)}`}</strong>
            </div>
          </Tooltip>
        )}
      </Box>
    );
  }
);

export default Graph;
