import React, { useRef, useEffect, useState, useCallback } from "react";
import { CircularProgress, Button } from "@mui/material";
//import Graph from "./aggregate/graphs";
import { downloadSVG } from "@/utilities/svgdata";

const ATACPlot: React.FC<{
  name: string;
  accession: string;
  pwm: number[][];
}> = ({ name, accession, pwm }) => {
  const [ data, setData ] = useState<any | null>(null);
    const [ loading, setLoading ] = useState(true);
    useEffect( () => {
        setLoading(true);
        setData(null);
        fetch(`https://screen-beta-api.wenglab.org/dnase_aggregate/motif-aggregate/${accession}.DNase-aggregate.json.gz`)
            .then(x => x.json())
            .then(x => { setData(x); setLoading(false) });
    }, [ accession, name ]);

    const [limit, setLimit] = useState(1000);

    const svgRef = useRef<SVGSVGElement>(null);
    const setLimits = useCallback((limit: number) => {
        if (limit < 10) limit = 10;
        if (limit > 1000) limit = 1000;
        setLimit(limit);
    }, []);

    console.log(data && data[name],"data")
  
  if (loading) return <CircularProgress />;

  if (!data || data.length === 0) return null;
  if (!data[name]) return null;
  return (
    <div>
      
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
