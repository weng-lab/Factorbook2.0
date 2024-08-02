import React from "react";
import { Box, Typography } from "@mui/material";
import {
  XYChart,
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
} from "@visx/xychart";

const data = [
  { x: "2020-01-01", y: 50 },
  { x: "2020-02-01", y: 10 },
  { x: "2020-03-01", y: 20 },
];

const accessors = {
  xAccessor: (d: { x: string | number | Date }) => new Date(d.x),
  yAccessor: (d: { y: any }) => d.y,
};

const PeaksCentrality = () => {
  return (
    <Box>
      <Typography variant="h6">Centrality Plot</Typography>
      <XYChart
        height={300}
        xScale={{ type: "time" }}
        yScale={{ type: "linear" }}
      >
        <AnimatedGrid />
        <AnimatedAxis orientation="bottom" />
        <AnimatedAxis orientation="left" />
        <AnimatedLineSeries dataKey="Line 1" data={data} {...accessors} />
      </XYChart>
    </Box>
  );
};

export default PeaksCentrality;
