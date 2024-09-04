import React, { useMemo, useState } from "react";
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
}

interface TooltipData {
  x: number;
  y: number;
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

  const bisectDate = bisector((d: number) => d).left;

  const handleMouseMove = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = xScale.invert(x);
    const index = bisectDate(proximal_values, x0, 1);
    const y = proximal_values[index];
    setTooltipData({ x: x0, y });

    showTooltip({
      tooltipData: { x: x0, y },
      tooltipLeft: xScale(x0),
      tooltipTop: yScale(y),
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
          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            numTicks={5}
            label={xlabel}
            stroke="#000"
            tickStroke="#000"
          />
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
            <strong>{`x: ${tooltipContent.x}`}</strong>
          </div>
          <div>
            <strong>{`y: ${tooltipContent.y}`}</strong>
          </div>
        </Tooltip>
      )}
    </div>
  );
};
