import React from "react";
import { TooltipProps } from "./types";

const Tooltip: React.FC<TooltipProps> = (props) => (
  <g transform={`translate(${props.x},${props.y})`}>
    <rect
      width={props.width}
      height={props.fontSize * (Object.keys(props.content).length + 3)}
      fill={props.fill}
      stroke={props.stroke}
      strokeWidth={2}
    />
    <text
      fontWeight="bold"
      fontSize={props.fontSize * 1.25}
      textAnchor="middle"
      x={props.width / 2}
      y={props.fontSize * 1.4}
    >
      {props.title}
    </text>
    {Object.keys(props.content).map((key, i) => (
      <React.Fragment key={i}>
        <text
          fontSize={props.fontSize * 0.9}
          x={props.width * 0.35}
          y={props.fontSize * (i + 3)}
          fontWeight="bold"
        >
          {key}:
        </text>
        <text
          fontSize={props.fontSize * 0.9}
          x={props.width * 0.55}
          y={props.fontSize * (i + 3)}
        >
          {props.content[key]}
        </text>
      </React.Fragment>
    ))}
  </g>
);
export default Tooltip;
