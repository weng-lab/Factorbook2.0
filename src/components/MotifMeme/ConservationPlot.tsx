import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { Graph } from "./Aggregate/Graphs";
import { downloadSVG } from "@/utilities/svgdata";

const ConservationPlot: React.FC<{
  name: string;
  accession: string;
  pwm: number[][];
}> = ({ name, accession, pwm }) => {
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(
      `https://screen-beta-api.wenglab.org/motif_conservation/conservation-aggregate/all/${accession}-${name}.sum.npy`
    )
      .then((x) => x.json())
      .then((x) => {
        setData(x.slice(16));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [accession, name]);

  if (loading) return <CircularProgress />;
  if (!data || data.length === 0) return <div>No data available</div>;

  const max = Math.max(...data);
  const min = Math.min(...data);

  return (
    <div>
      <Graph
        dataset={{ target: "conservation", accession }}
        proximal_values={data}
        distal_values={data}
        is_forward_reverse
        xlabel="distance from motif (bp)"
        ylabel="conservation"
        height={220}
        yMax={max * 1.2}
        padBottom
        hideTitle
        sref={ref}
      />
      <Button
        variant="contained"
        onClick={() => downloadSVG(ref, "conservation.svg")}
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

export default ConservationPlot;
