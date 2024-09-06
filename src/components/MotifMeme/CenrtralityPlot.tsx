import React, { useRef, useMemo } from "react";
import { Button, Box, Typography } from "@mui/material";
import { LinePath } from "@visx/shape";
import { curveBasis } from "d3-shape";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { downloadSVG } from "@/utilities/svgdata";

interface CentralityPlotProps {
  peak_centrality: Record<number, number>;
  width?: number; // Add optional width
  height?: number; // Add optional height
}

const CentralityPlot: React.FC<CentralityPlotProps> = ({
  peak_centrality,
  width = 500, // Set default width if not passed
  height = 300, // Set default height if not passed
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const pcX = useMemo(
    () =>
      Object.keys(peak_centrality)
        .map((s) => +s)
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
        range: [0, width - 100],
      }),
    [pcX, width]
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: [0, max], range: [height - 80, 0] }),
    [max, height]
  );

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<{
      xValue: number;
      yValue: number;
    }>();

  const handleMouseOver = (event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const xValue = Math.round(xScale.invert(x - 50));
    const index = pcX.indexOf(xValue);

    if (index !== -1) {
      const yValue = parseFloat(pcY[index].toFixed(2));

      if (!isNaN(yValue)) {
        showTooltip({
          tooltipData: { xValue, yValue },
          tooltipLeft: x,
          tooltipTop: yScale(yValue) + 20,
        });
      }
    }
  };

  return (
    <Box position="relative">
      <Typography variant="h6" align="center" gutterBottom>
        Centrality Plot
      </Typography>
      <svg width={width} height={height} ref={svgRef}>
        <Group left={50} top={20}>
          <LinePath
            data={pcY}
            x={(d, i) => xScale(pcX[i])}
            y={yScale}
            stroke="#0000FF"
            strokeWidth={2}
            curve={curveBasis}
          />
          <AxisLeft scale={yScale} />
          <AxisBottom scale={xScale} top={height - 80} />
          <rect
            width={width - 100}
            height={height - 80}
            fill="transparent"
            onMouseMove={handleMouseOver}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>
      {tooltipData && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
          <div style={{ fontSize: "12px", color: "black" }}>
            <strong>X:</strong> {tooltipData.xValue}
          </div>
          <div style={{ fontSize: "12px", color: "black" }}>
            <strong>Density:</strong> {tooltipData.yValue}
          </div>
        </TooltipWithBounds>
      )}
      <Box display="flex" justifyContent="center" mt={1}>
        <Button
          variant="contained"
          onClick={() => downloadSVG(svgRef, "centrality.svg")}
          sx={{ marginRight: 2 }}
        >
          Export SVG
        </Button>
      </Box>
    </Box>
  );
};

export default CentralityPlot;
