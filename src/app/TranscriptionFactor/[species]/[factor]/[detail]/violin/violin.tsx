import React, { useMemo, useCallback } from "react";

import { standardNormalKernel, median } from "./utils";
import { linearTransform, FRIENDLY } from "./utils";
import YAxis from "./yaxis";
import Tooltip from "./tooltip";
import Legend from "./legend";
import { ViolinPlotProps, ViolinProps, SingleViolinProps } from "./types";
// import { associateBy } from 'queryz';

const SingleViolin: React.FC<SingleViolinProps> = (props) => {
  const max = useMemo(() => Math.max(...props.rendered), [props.rendered]);
  const reversed = useMemo(
    () => [...props.rendered].reverse(),
    [props.rendered]
  );
  const leftTransform = useCallback(
    linearTransform([0, max], [props.width * 0.5, props.width * 0.2]),
    [max, props.width]
  );
  const rightTransform = useCallback(
    linearTransform([0, max], [props.width * 0.5, props.width * 0.8]),
    [max, props.width]
  );
  const verticalTransform = useCallback(
    linearTransform(
      [0, props.rendered.length],
      [props.height * 0.9, props.height * 0.1]
    ),
    [props.rendered, props.height]
  );
  const left = useMemo(
    () =>
      props.rendered.reduce(
        (acc, v, i) => acc + ` L ${leftTransform(v)} ${verticalTransform(i)}`,
        `M ${props.width / 2} ${props.height * 0.9}`
      ),
    [
      props.rendered,
      props.width,
      props.height,
      leftTransform,
      verticalTransform,
    ]
  );
  const complete = useMemo(
    () =>
      reversed.reduce(
        (acc, v, i) =>
          acc +
          ` L ${rightTransform(v)} ${verticalTransform(
            props.rendered.length - i - 1
          )}`,
        left + ` L ${props.width / 2} ${props.height * 0.1}`
      ),
    [
      reversed,
      rightTransform,
      verticalTransform,
      props.rendered,
      props.width,
      props.height,
      left,
    ]
  );

  return (
    <g transform={`translate(${props.x},0)`}>
      <path
        d={complete + `L ${props.width / 2} ${props.height * 0.9}`}
        fill={props.fill}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
        fillOpacity={props.fillOpacity}
      />
      {props.median !== undefined && (
        <rect
          x={props.width * 0.4}
          y={verticalTransform(props.median) - props.height * 0.005}
          width={props.width * 0.2}
          height={props.height * 0.01}
          fill={props.stroke}
          fillOpacity={props.fillOpacity}
        />
      )}
    </g>
  );
};

const Violin: React.FC<ViolinProps> = (props) => {
  const keys = useMemo(
    () =>
      Object.keys(props.rendered)
        .filter((x) => x !== undefined)
        .sort(),
    [props.rendered]
  );

  return (
    <g transform={`translate(${props.x},0)`}>
      {keys.map((x, i) => {
        return (
          <SingleViolin
            rendered={standardNormalKernel(
              props.rendered[Number(x)],
              props.domain
            )}
            width={props.width / keys.length}
            height={props.height}
            x={(i * props.width) / keys.length}
            fill={
              props.colors ? props.colors[x as unknown as number] : props.fill
            }
            fillOpacity={props.mousedOver === x ? 1.0 : props.fillOpacity}
            stroke={props.stroke}
            key={i}
            strokeWidth={
              +(props.strokeWidth || 1) * (props.mousedOver === x ? 2.0 : 1.0)
            }
            onMouseOver={() => props.onMousedOver && props.onMousedOver(x)}
            onMouseOut={() => props.onMousedOut && props.onMousedOut()}
            domain={props.domain}
          />
        );
      })}
    </g>
  );
};

const ViolinPlot: React.FC<ViolinPlotProps> = (props) => {
  const keys = useMemo(
    () =>
      [...props.data.keys()].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      ),
    [props.data]
  );
  /* const legendContent = useMemo<Map<string, string>>( () => associateBy(
        [ ...(props.colors?.values() || []) ], x => x, x => FRIENDLY.get(x) || x
    ), [ props.colors, props.legendKeys ]); */
  const mouseOverTitle = useMemo(
    () =>
      props.mousedOver &&
      (props.mousedOver.inner === "none" ||
      props.mousedOver.outer === props.mousedOver.inner
        ? FRIENDLY.get(props.mousedOver.outer || "") || props.mousedOver.outer
        : `${
            FRIENDLY.get(props.mousedOver.outer || "") || props.mousedOver.outer
          }`),
    [props.mousedOver]
  );
  const length = (props.tKeys || keys.length) + 4;

  return (
    <g>
      <YAxis
        title={props.title}
        width={(props.width / length) * 2}
        height={props.height / 2}
        range={props.domain}
      />
      {keys.map((x, i) => {
        
        return (
          <React.Fragment key={`${x}_${i}`}>
            <Violin
              {...(props as React.SVGProps<SVGPathElement>)}
              rendered={[...props.data.get(x)!.values()]}
              width={props.width / length}
              height={props.height / 2}
              x={((i + 2) * props.width) / length}
              key={i}
              mousedOver={
                props.mousedOver && props.mousedOver.outer === x
                  ? props.mousedOver.inner
                  : null
              }
              onMousedOver={(xx) =>
                props.onViolinMousedOver &&
                props.onViolinMousedOver({ inner: xx, outer: x })
              }
              onMousedOut={() =>
                props.onViolinMousedOut && props.onViolinMousedOut()
              }
              domain={props.domain}
              colors={[...props.data.get(x)!.values()].map(
                () => props.colors.get(x) || "#aaaaaa"
              )}
            />
            <rect
              width={(props.width / length) * 0.8}
              x={((i + 2.1) * props.width) / length}
              y={props.height * 0.48}
              height={1}
              fill="#888888"
            />
            <text
              key={x}
              fontSize="140px"
              transform="rotate(-90)"
              textAnchor="end"
              y={((i + 2.5) * props.width) / length}
              x={-props.height / 2}
              height={props.width / (length - 1)}
              fill="#000000"
              alignmentBaseline="middle"
            >
              {FRIENDLY.get(x) || x}
            </text>
          </React.Fragment>
        );
      })}
      <Legend
        x={props.width}
        y={props.height * 0.1}
        width={props.width / length}
        title={props.legendTitle || ""}
        content={{}}
        fontSize={12}
        fill="#eeeeee"
      />
      {props.mousedOver && props.mousedOver.outer !== null && (
        <Tooltip
          width={(props.width / length) * 6}
          x={
            ((keys.indexOf(props.mousedOver.outer) + (length - 1) > 2 &&
            keys.indexOf(props.mousedOver.outer) === length - 2
              ? -0.75
              : 1.75) *
              props.width) /
            length + (keys.indexOf(props.mousedOver.outer)*(props.width / length))
          }
          y={props.height * 0.1}
          fill="#eeeeee"
          stroke="#000000"
          title={mouseOverTitle || ""}
          content={{
            n:
              props.data
                .get(props.mousedOver.outer)
                ?.get("all")
                ?.length.toString() || "",
            median: median(
              props.data.get(props.mousedOver.outer)?.get("all") || [0]
            ).toFixed(2),
            maximum: Math.max(
              ...(props.data.get(props.mousedOver.outer)?.get("all") || [0])
            ).toFixed(2),
            minimum: Math.min(
              ...(props.data.get(props.mousedOver.outer)?.get("all") || [0])
            ).toFixed(2),
          }}
          fontSize={90}
        />
      )}
    </g>
  );
};
export default ViolinPlot;
