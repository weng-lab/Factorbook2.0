import React, { useMemo, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import { LinePath } from "@visx/shape";
import { curveBasis } from "d3-shape";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds as VisxTooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { downloadSVG } from "@/utilities/svgdata";
import { TooltipProps } from "@visx/tooltip/lib/tooltips/Tooltip";
const TooltipWithBounds: React.FC<TooltipProps> = (props) => <TooltipWithBounds {...props} />
interface CentralityPlotProps {
  peak_centrality: Record<number, number>;
  width?: number;
  height?: number;
}
function toScientificNotationElement(
  num: number,
  variant:
    | "body1"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "caption"
    | "overline" = "body1",
  sigFigs = 2
) {
  const scientific = num.toExponential(sigFigs);
  const [coefficient, exponent] = scientific.split("e");
  return (
    <Typography variant={variant}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
}


const CentralityPlot: React.FC<CentralityPlotProps> = ({
  peak_centrality,
  width = 600,
  height = 350,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const pcX = useMemo(
    () =>
      Object.keys(peak_centrality)
        .map((s) => +s)
        .filter((m: number) => m >= -300 && m <= 300)
        .sort((a, b) => a - b),
    [peak_centrality]
  );
  const pcY = useMemo(
    () => pcX.map((p) => peak_centrality[p]),
    [pcX, peak_centrality]
  );

  const max = Math.max(...pcY);
  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [pcX[0], pcX[pcX.length - 1]],
        range: [0, width - 120], // Adjusted width for axis labels
      }),
    [pcX, width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, max],
        range: [height - 80, 0], // Adjusted height for axis labels
      }),
    [max, height]
  );

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<{
      xValue: number;
      yValue: number;
    }>();

  const handleMouseOver = (event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const xValue = Math.round(xScale.invert(x - 60)); // Adjusted for left margin
    const index = pcX.indexOf(xValue);

    if (index !== -1) {
      const yValue = pcY[index]
      if (!isNaN(yValue)) {
        showTooltip({
          tooltipData: { xValue, yValue },
          tooltipLeft: x,
          tooltipTop: yScale(pcY[index]) + 20,
        });
      }
    }
  };

  return (
    <Box position="relative">
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        noWrap
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Peak Centrality
      </Typography>
      <svg width={width} height={height} ref={svgRef}>
        <Group left={60} top={20}>
          {" "}
          {/* Adjusted padding for y-axis */}
          <LinePath
            data={pcY}
            x={(d, i) => xScale(pcX[i])}
            y={yScale}
            stroke="#0000FF"
            strokeWidth={2}
            curve={curveBasis}
          />
          <AxisLeft scale={yScale} label="Motif Density" labelOffset={40} />
          <AxisBottom
            scale={xScale}
            top={height - 80}
            label="Distance from Peak Summit (bp)"
            labelOffset={20}
          />
          <rect
            width={width - 120}
            height={height - 80}
            fill="transparent"
            onMouseMove={handleMouseOver}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>
      {tooltipData && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
          <div style={{ fontSize: "16px", color: "black" }}>
            <strong>Distance:</strong> {tooltipData.xValue}
          </div>
          <div style={{ fontSize: "16px", color: "black" }}>
            <strong>Density:</strong>
            <>{toScientificNotationElement(tooltipData.yValue, "subtitle2")}</>
          </div>
        </TooltipWithBounds>
      )}
      {/* Aligning the Export SVG button to the left under the graph */}
      <Box display="flex" justifyContent="start" mt={1} ml={7}>
        <Button
          variant="contained"
          onClick={() => downloadSVG(svgRef, "centrality.svg")}
          sx={{
            backgroundColor: "#8169BF",
            color: "white",
            marginRight: 2,
          }}
        >
          Export SVG
        </Button>
      </Box>
    </Box>
  );
};

export default CentralityPlot;
