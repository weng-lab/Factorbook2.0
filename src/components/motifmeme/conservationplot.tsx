import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
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
  width?: number;
  height?: number;
}

const ConservationPlot: React.FC<ConservationPlotProps> = ({
  name,
  accession,
  pwm,
  width = 600,
  height = 350,
}) => {
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(500);
  const svgRef = useRef<SVGSVGElement>(null);

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<{
      xValue: number;
      proximal: number;
      distal: number;
    }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://screen-beta-api.wenglab.org/motif_conservation/conservation-aggregate/all/${accession}-${name}.sum.npy`
        );
        const result = await response.json();
        setData(result.slice(16));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accession, name]);

  const setLimitS = useCallback((newLimit: number) => {
    setLimit(Math.min(500, Math.max(10, newLimit)));
  }, []);

  const max = useMemo(() => (data ? Math.max(...data) : 0), [data]);
  const min = useMemo(() => (data ? Math.min(...data) : 0), [data]);

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [-limit, limit],
        range: [0, width - 120],
        clamp: true,
      }),
    [limit, width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [min, max * 1.2],
        range: [height - 80, 0],
        clamp: true,
      }),
    [min, max, height]
  );

  const handleMouseOver = (event: React.MouseEvent<SVGRectElement>) => {
    if (!data) return;

    const { x } = localPoint(event) || { x: 0 };
    const svgRect = svgRef.current?.getBoundingClientRect();
    const graphX = x - (svgRect?.left || 0) - 60;
    const xValue =  Math.round(xScale.invert(x - 60)); // xScale.invert(graphX);

    const index = Math.floor(xValue + data.length / 2);

    if (index >= 0 && index < data.length) {
      const proximal = parseFloat(data[index].toFixed(2));
      const distal = parseFloat(data[data.length - 1 - index].toFixed(2));
      
      showTooltip({
        tooltipData: { xValue, proximal, distal },
        tooltipLeft: x,//  graphX + 60,
        tooltipTop: yScale(proximal) + 30,
      });
    } else {
      hideTooltip();
    }
  };

  if (loading || !data) return <Typography>Loading...</Typography>;

  return (
    <Box position="relative">
      <Box textAlign="center" mb={2}>
        <Typography
          variant="h6"
          gutterBottom
          noWrap
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Evolutionary Conservation: phyloP 100-way
        </Typography>
      </Box>
      <svg width={width} height={height} ref={svgRef}>
        <Group left={60} top={20}>
          <LinePath
            data={data ?? []}
            x={(d, i) => xScale(i - data.length / 2)}
            y={(d) => yScale(d)}
            stroke="#444444"
            strokeWidth={2}
            curve={curveBasis}
          />
          <AxisLeft
            scale={yScale}
            label="Conservation Score"
            labelOffset={40}
          />
          <AxisBottom
            scale={xScale}
            top={height - 80}
            label="Distance from Motif (bp)"
            labelOffset={20}
          />
          <g
            transform={`translate(${
              xScale(0) - (pwm.length * (xScale(1) - xScale(0))) / 2
            }, ${yScale(0) - 100}) scale(1,0.2)`}
          >
            <RawLogo
              values={pwm}
              alphabet={DNAAlphabet}
              x={0}
              y={0}
              glyphWidth={xScale(1) - xScale(0)}
              stackHeight={500}
            />
          </g>
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
          <div style={{ fontSize: "12px", color: "black" }}>
            <strong>X:</strong> {Math.round(tooltipData.xValue)}
          </div>
          <div style={{ fontSize: "12px", color: "black" }}>
            <strong>Score:</strong> {tooltipData.proximal}
          </div>
          
        </TooltipWithBounds>
      )}
      <Box display="flex" justifyContent="start" mt={1} ml={7}>
        <Button
          variant="contained"
          onClick={() => downloadSVG(svgRef, "conservation.svg")}
          sx={{ backgroundColor: "#8169BF", color: "white", marginRight: 2 }}
        >
          Export SVG
        </Button>
        <IconButton onClick={() => setLimitS(Math.floor(limit / 2))}>
          <ZoomInIcon />
        </IconButton>
        <IconButton onClick={() => setLimitS(Math.floor(limit * 2))}>
          <ZoomOutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ConservationPlot;
