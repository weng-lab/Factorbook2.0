import React, { useMemo, useState, useCallback, forwardRef } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { Tooltip, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { curveMonotoneX } from "d3-shape";
import { MARK_COLORS } from "./marks";
import { Box, Typography } from "@mui/material";
import { Line } from "@visx/shape";
import { TooltipProps } from "@visx/tooltip/lib/tooltips/Tooltip";

//Needed to fix type errors on vercel build
// const Tooltip: React.FC<TooltipProps> = VisxTooltip;

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

// The key change here is using forwardRef to pass the SVG ref from parent
const Graph = forwardRef<SVGSVGElement, GraphProps>(
  (
    {
      proximal_values = [],
      distal_values = [],
      dataset,
      title,
      limit = 2000,
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

    const color = MARK_COLORS[dataset.target] || "#000000"; // Default to black if target color is not found

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

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x);

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

    const handleMouseLeave = useCallback(() => {
      setTooltipData(null);
      hideTooltip();
    }, [hideTooltip]);

    return (
      <Box style={{ position: "relative", marginBottom: "2em" }}>
        <svg ref={ref} width={width} height={height}>
          <Group>
            {!hideTitle && (
              <text
                x={width / 2}
                y={margin.top - 5}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
                style={{ paddingBottom: "30px" }} // Increased padding for title
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
              onMouseLeave={handleMouseLeave}
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
              onMouseLeave={handleMouseLeave}
            />

            {tooltipData && (
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: height - margin.bottom }}
                stroke="gray"
                strokeWidth={1}
                pointerEvents="none"
              />
            )}

            <AxisBottom
              top={height - margin.bottom}
              scale={xScale}
              numTicks={5}
              label={xlabel}
              tickLabelProps={() => ({ fontSize: 12, textAnchor: "middle" })}
            />
            <AxisLeft
              left={margin.left}
              scale={yScale}
              numTicks={5}
              label={ylabel}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg width="10" height="10">
                <rect width="10" height="10" fill={color} />
              </svg>
              <strong style={{ marginLeft: "5px" }}>
                {`Proximal: ${tooltipContent.proximal.toFixed(2)}`}
              </strong>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg width="10" height="10">
                <rect width="10" height="10" fill={color} opacity={0.6} />
              </svg>
              <strong style={{ marginLeft: "5px" }}>
                {`Distal: ${tooltipContent.distal.toFixed(2)}`}
              </strong>
            </div>
          </Tooltip>
        )}

        {/* Legend Box */}
        <Box display="flex" justifyContent="center" marginTop="10px">
          <Box display="flex" alignItems="center" marginRight="20px">
            <svg width="16" height="16">
              <rect width="16" height="16" fill={color} />
            </svg>
            <Typography variant="body2" style={{ marginLeft: "8px" }}>
              TSS - Proximal
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <svg width="16" height="16">
              <rect width="16" height="16" fill={color} opacity={0.6} />
            </svg>
            <Typography variant="body2" style={{ marginLeft: "8px" }}>
              TSS - Distal
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default Graph;
