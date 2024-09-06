import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Box, Typography } from "@mui/material";
import { LinePath } from "@visx/shape";
import { curveBasis } from "d3-shape";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { RawLogo, DNAAlphabet } from "logojs-react";
import { downloadSVG } from "@/utilities/svgdata";

interface ConservationPlotProps {
  name: string;
  accession: string;
  pwm: number[][];
  width?: number; // Custom width
  height?: number; // Custom height
}

const ConservationPlot: React.FC<ConservationPlotProps> = ({
  name,
  accession,
  pwm,
  width = 500, // Set default width
  height = 300, // Set default height
}) => {
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(500); // Handles zooming
  const svgRef = useRef<SVGSVGElement>(null);

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<{
      xValue: number;
      proximal: number;
      distal: number;
    }>();

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(
      `https://screen-beta-api.wenglab.org/motif_conservation/conservation-aggregate/all/${accession}-${name}.sum.npy`
    )
      .then((x) => x.json())
      .then((x) => {
        setData(x.slice(16)); // Adjust data as needed
        setLoading(false);
      });
  }, [accession, name]);

  const setLimitS = useCallback((newLimit: number) => {
    if (newLimit < 10) newLimit = 10;
    if (newLimit > 500) newLimit = 500;
    setLimit(newLimit);
  }, []);

  const max = useMemo(() => (data ? Math.max(...data) : 0), [data]);
  const min = useMemo(() => (data ? Math.min(...data) : 0), [data]);

  const margin = { top: 40, right: 20, bottom: 50, left: 150 };

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [-limit, limit],
        range: [0, width - margin.left - margin.right],
      }),
    [limit, width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [min, max * 1.2],
        range: [height - margin.top - margin.bottom, 0],
      }),
    [min, max, height]
  );

  const handleMouseOver = (event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const svgRect = svgRef.current?.getBoundingClientRect();
    const graphX = x - (svgRect?.left || 0); // Get X relative to graph

    const index = Math.floor(
      xScale.invert(graphX - margin.left) + data!.length / 2
    );

    // Ensure the index is within bounds and show the tooltip
    if (index >= 0 && index < data!.length) {
      const proximal = parseFloat(data![index].toFixed(2));
      const distal = parseFloat(data![data!.length - 1 - index].toFixed(2)); // Assuming distal is reverse of proximal

      showTooltip({
        tooltipData: { xValue: index - data!.length / 2, proximal, distal },
        tooltipLeft: graphX, // Correctly position tooltip relative to graph
        tooltipTop: yScale(proximal) + margin.top, // Adjust for better positioning
      });
    } else {
      hideTooltip();
    }
  };

  if (loading || !data) return <div>Loading...</div>;
  if (!data || data.length === 0) return null;

  return (
    <Box position="relative">
      <Typography variant="h6" align="center" gutterBottom>
        Evolutionary Conservation: phyloP 100-way
      </Typography>
      <svg width={width} height={height} ref={svgRef}>
        <defs>
          <clipPath id="clipPath">
            <rect
              x="0"
              y="0"
              width={width - margin.left - margin.right}
              height={height - margin.top - margin.bottom}
            />
          </clipPath>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <LinePath
            data={data ?? undefined} // Safely handle data null check
            x={(d, i) => xScale(i - data!.length / 2)}
            y={(d) => yScale(d)}
            stroke="#444444"
            strokeWidth={2}
            curve={curveBasis}
            clipPath="url(#clipPath)"
          />
          <AxisLeft
            scale={yScale}
            label="Conservation Score"
            labelOffset={70}
            labelProps={{ fontSize: 12, fill: "#000", textAnchor: "middle" }}
            tickLabelProps={() => ({
              fontSize: 10,
              fill: "#000",
              textAnchor: "end",
              dy: "0.33em",
            })}
          />
          <AxisBottom
            scale={xScale}
            top={height - margin.bottom - margin.top}
            label="Distance from Motif (bp)"
            labelOffset={35}
            labelProps={{ fontSize: 12, fill: "#000", textAnchor: "middle" }}
            tickLabelProps={() => ({
              fontSize: 10,
              fill: "#000",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <g
            transform={`translate(${
              xScale(0) - (pwm.length * (xScale(1) - xScale(0))) / 2
            }, ${yScale(0) - 100})`}
          >
            <RawLogo
              values={pwm}
              alphabet={DNAAlphabet}
              x={0}
              y={0}
              glyphWidth={xScale(1) - xScale(0)}
              stackHeight={100}
            />
          </g>
          <rect
            width={width - margin.left - margin.right}
            height={height - margin.top - margin.bottom}
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
            <strong>Proximal:</strong> {tooltipData.proximal}
          </div>
          <div style={{ fontSize: "12px", color: "black" }}>
            <strong>Distal:</strong> {tooltipData.distal}
          </div>
        </TooltipWithBounds>
      )}
      <Box display="flex" justifyContent="center" mt={1}>
        <Button
          variant="contained"
          onClick={() => downloadSVG(svgRef, "conservation.svg")}
          sx={{ marginRight: 2 }}
        >
          Export SVG
        </Button>
        <Button
          onClick={() => setLimitS(Math.floor(limit / 2))}
          sx={{ marginRight: 1 }}
        >
          +
        </Button>
        <Button onClick={() => setLimitS(Math.floor(limit * 2))}>-</Button>
      </Box>
    </Box>
  );
};

export default ConservationPlot;
