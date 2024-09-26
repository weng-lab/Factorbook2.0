import React, { useMemo, useState, useCallback, forwardRef } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { Tooltip, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { curveMonotoneX } from "d3-shape";
import { MARK_COLORS } from "./marks"; // Path to your marks.ts file
import { Box } from "@mui/material";
import { Line } from "@visx/shape";

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
  proximal: number;
  distal: number;
}

const Graph = forwardRef<SVGSVGElement, GraphProps>(
  (
    {
      proximal_values = [],
      distal_values = [],
      dataset,
      title,
      limit = 2000, // Set default limit if not provided
      xlabel = "distance from summit (bp)", // Correct axis label
      ylabel = "fold change signal", // Correct axis label
      height = 300,
      yMax,
      padBottom = false,
      hideTitle = false,
    },
    ref
  ) => {
    const width = 400; // Adjust width
    const margin = { top: 20, right: 20, bottom: 50, left: 60 }; // Increase bottom margin for x-axis label

    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const {
      showTooltip,
      hideTooltip,
      tooltipLeft,
      tooltipTop,
      tooltipData: tooltipContent,
    } = useTooltip<TooltipData>();

    const color = MARK_COLORS[dataset.target] || "#000000"; // Apply color based on target

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

    const bisectData = bisector((d: number, i: number) => i).center;

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x);

        // Get the index of the nearest data point
        const index = Math.floor(
          ((x0 + limit) / (2 * limit)) * proximal_values.length
        );

        if (index >= 0 && index < proximal_values.length) {
          const proximal = proximal_values[index] ?? 0;
          const distal = distal_values[index] ?? 0;

          setTooltipData({ x: x0, proximal, distal });

          showTooltip({
            tooltipData: { x: x0, proximal, distal },
            tooltipLeft: xScale(index - proximal_values.length / 2),
            tooltipTop: yScale(proximal),
          });
        }
      },
      [proximal_values, distal_values, limit, xScale, yScale, showTooltip]
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

            {/* Proximal Line */}
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

            {/* Distal Line */}
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

            {/* Tooltip vertical line */}
            {tooltipData && (
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: height - margin.bottom }}
                stroke="gray"
                strokeWidth={1}
                pointerEvents="none"
              />
            )}

            {/* X and Y Axes */}
            <AxisBottom
              top={height - margin.bottom}
              scale={xScale}
              numTicks={5}
              label={xlabel} // X-axis label
              tickLabelProps={() => ({ fontSize: 12, textAnchor: "middle" })}
            />
            <AxisLeft
              left={margin.left}
              scale={yScale}
              numTicks={5}
              label={ylabel} // Y-axis label
              tickLabelProps={() => ({ fontSize: 12, textAnchor: "end" })}
            />
          </Group>
        </svg>

        {tooltipContent && (
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
              <strong>{`Proximal: ${tooltipContent.proximal.toFixed(
                2
              )}`}</strong>
            </div>
            <div>
              <strong>{`Distal: ${tooltipContent.distal.toFixed(2)}`}</strong>
            </div>
          </Tooltip>
        )}
      </Box>
    );
  }
);

export default Graph;