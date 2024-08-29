import React, { useRef } from "react";
import { Button } from "@mui/material";
import { Graph } from "./Aggregate/Graphs";
import { downloadSVG } from "@/utilities/svgdata";

const CentralityPlot: React.FC<{ peak_centrality: Record<number, number> }> = ({
  peak_centrality,
}) => {
  const pcX = Object.keys(peak_centrality)
    .map((s) => +s)
    .sort((a, b) => a - b);
  const pcY = pcX.map((p) => peak_centrality[p]);
  const ref = useRef<SVGSVGElement>(null);

  return (
    <div>
      <Graph
        dataset={{ target: "peak_centrality", accession: "" }}
        proximal_values={pcY}
        distal_values={pcY}
        is_forward_reverse={false}
        xlabel="distance from peak summit (bp)"
        ylabel="motif density"
        height={220}
        yMax={Math.max(...pcY) * 1.2}
        padBottom
        hideTitle
        sref={ref}
      />
      <Button
        variant="contained"
        onClick={() => downloadSVG(ref, "peak-centrality.svg")}
        sx={{
          marginTop: "1em",
          backgroundColor: "#8169BF",
          color: "white",
          "&:hover": {
            backgroundColor: "#6954A1",
          },
        }}
      >
        Export SVG
      </Button>
    </div>
  );
};

export default CentralityPlot;
