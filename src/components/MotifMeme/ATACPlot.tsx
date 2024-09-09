import React, { useRef, useEffect, useState } from "react";
import { CircularProgress, Button } from "@mui/material";
import { Graph } from "./Aggregate/Graphs";
import { downloadSVG } from "@/utilities/svgdata";

const ATACPlot: React.FC<{
  name: string;
  accession: string;
  pwm: number[][];
  atac_data?: number[];
}> = ({ name, accession, pwm, atac_data }) => {
  const [data, setData] = useState<number[] | null>(atac_data || null);
  const [loading, setLoading] = useState(!atac_data);

  const svgRef = useRef<SVGSVGElement>(null); // Define the ref for the SVG element

  useEffect(() => {
    if (!atac_data) {
      setLoading(true);
      setData(null);
      fetch(
        `https://screen-beta-api.wenglab.org/dnase_aggregate/motif-aggregate/${accession}.DNase-aggregate.json.gz`
      )
        .then((x) => x.json())
        .then((x) => {
          setData(x);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [accession, atac_data]);

  if (loading) return <CircularProgress />;

  if (!data || data.length === 0) return null;

  return (
    <div>
      <Graph
        proximal_values={data}
        distal_values={[]}
        dataset={{ target: name }}
        title="ATAC-seq Plot"
        xlabel="Position"
        ylabel="ATAC-seq Signal"
        height={300}
        yMax={Math.max(...data) * 1.2}
        svgRef={svgRef} // Pass the ref to the Graph component
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => downloadSVG(svgRef, `${name}-atac.svg`)}
      >
        Export SVG
      </Button>
    </div>
  );
};

export default ATACPlot;
