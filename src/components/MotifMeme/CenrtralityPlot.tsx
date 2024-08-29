import React, { useMemo, useRef } from "react";
import { Button, Typography } from "@mui/material";
import { MultiXLineChart } from "jubilant-carnival";
import { downloadSVG } from "@/utilities/svgdata";
import { CentralityPlotProps } from "./Types";

const CentralityPlot: React.FC<CentralityPlotProps> = ({ peak_centrality }) => {
  const pcX = useMemo(
    () =>
      Object.keys(peak_centrality)
        .map((s) => +s)
        .filter((m: number) => m >= -300 && m <= 300)
        .sort((a, b) => a - b),
    [peak_centrality]
  );

  const pcY = useMemo(
    () =>
      pcX
        .map((p) => peak_centrality[p])
        .map((p, i, pcY) => {
          let sum = p;
          let count = 1;
          for (
            let j = Math.max(0, i - 3);
            j < Math.min(pcY.length, i + 3);
            j++
          ) {
            sum = sum + pcY[j];
            count += 1;
          }
          return sum / count;
        }),
    [pcX, peak_centrality]
  );

  const ref = useRef<SVGSVGElement>(null);

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Peak Centrality
      </Typography>
      <MultiXLineChart
        xDomain={{ start: -300, end: 300 }}
        yDomain={{ start: 0, end: Math.max(...pcY) * 1.2 }}
        lineProps={{ strokeWidth: 4 }}
        data={[{ data: pcY, label: "motif density", color: "#000088" }]}
        innerSize={{ width: 400, height: 220 }}
        xAxisProps={{ fontSize: 15, title: "distance from peak summit (bp)" }}
        yAxisProps={{ fontSize: 15, title: "motif density" }}
        plotAreaProps={{
          withGuideLines: true,
          guideLineProps: { hideHorizontal: true },
        }}
        legendProps={{
          size: { width: 135, height: 25 },
          headerProps: {
            numberFormat: (x: number) => Math.round(x).toString(),
          },
        }}
        ref={ref}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => downloadSVG(ref, "peak-centrality.svg")}
        sx={{ mt: 2 }}
      >
        Export SVG
      </Button>
    </>
  );
};

export default CentralityPlot;
