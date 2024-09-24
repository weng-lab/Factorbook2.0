import React, { RefObject, useState } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { Tooltip, useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { curveMonotoneX } from "d3-shape";

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
  svgRef?: RefObject<SVGSVGElement>;
}

interface TooltipData {
  x: number;
  yProximal: number;
  yDistal: number;
}

export const Graph: React.FC<GraphProps> = ({
  proximal_values,
  distal_values,
  dataset,
  title,
  limit = 2000,
  xlabel,
  ylabel,
  height = 300,
  yMax,
  padBottom,
  hideTitle,
}) => {
  const width = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const {
    showTooltip,
    hideTooltip,
    tooltipLeft,
    tooltipTop,
    tooltipData: tooltipContent,
  } = useTooltip<TooltipData>();

  const xScale = scaleLinear({
    domain: [-(limit || 2000), limit || 2000],
    range: [margin.left, width - margin.right],
  });

  const yScale = scaleLinear({
    domain: [
      padBottom ? Math.min(...proximal_values, ...distal_values) : 0,
      yMax || Math.max(...proximal_values, ...distal_values),
    ],
    range: [height - margin.bottom, margin.top],
  });

  const bisectIndex = bisector((d: number, index: number) => index).left;

  const handleMouseMove = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = xScale.invert(x);
    const index = bisectIndex(proximal_values, x0, 1);

    const yProximal = proximal_values[index];
    const yDistal = distal_values[index];

    setTooltipData({ x: x0, yProximal, yDistal });

    showTooltip({
      tooltipData: { x: x0, yProximal, yDistal },
      tooltipLeft: xScale(x0),
      tooltipTop: yScale(yProximal), // You can adjust to show whichever value you prefer
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Group>
          {!hideTitle && (
            <text
              x={width / 2}
              y={margin.top}
              textAnchor="middle"
              fontSize={16}
            >
              {title || dataset.target}
            </text>
          )}
          {/* Proximal Values Line */}
          <LinePath
            data={proximal_values}
            x={(d, i) => xScale(i - proximal_values.length / 2)}
            y={(d) => yScale(d)}
            stroke="#000088"
            strokeWidth={2}
            curve={curveMonotoneX}
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
          {/* Distal Values Line */}
          <LinePath
            data={distal_values}
            x={(d, i) => xScale(i - distal_values.length / 2)}
            y={(d) => yScale(d)}
            stroke="#FF0000"
            strokeWidth={2}
            curve={curveMonotoneX}
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
          {/* X Axis */}
          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            numTicks={5}
            label={xlabel}
            stroke="#000"
            tickStroke="#000"
          />
          {/* Y Axis */}
          <AxisLeft
            left={margin.left}
            scale={yScale}
            numTicks={5}
            label={ylabel}
            stroke="#000"
            tickStroke="#000"
          />
        </Group>
      </svg>
      {/* Tooltip */}
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
            <strong>{`Proximal: ${tooltipContent.yProximal}`}</strong>
          </div>
          <div>
            <strong>{`Distal: ${tooltipContent.yDistal}`}</strong>
          </div>
        </Tooltip>
      )}
    </div>
  );
};
