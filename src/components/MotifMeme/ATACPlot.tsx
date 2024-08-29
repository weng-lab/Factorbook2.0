import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Graph } from "./Aggregate/Graphs"; // Adjust the import path as necessary
import { downloadSVG } from "@/utilities/svgdata"; // Adjust the import path as necessary

const ATACPlot: React.FC<{
  name: string;
  accession: string;
  pwm: number[][];
  atac_data?: number[]; // Add the optional atac_data prop
}> = ({ name, accession, pwm, atac_data }) => {
  const [data, setData] = useState<number[] | null>(atac_data || null); // Initialize with atac_data if provided
  const [loading, setLoading] = useState(!atac_data); // If atac_data is provided, no need to load

  const sref = useRef<SVGSVGElement>(null);

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
        .catch(() => setLoading(false)); // Handle errors gracefully
    }
  }, [accession, name, atac_data]);

  // Function to handle SVG download
  const handleDownload = useCallback(() => {
    if (sref.current) {
      downloadSVG(sref, `${name}-atac.svg`);
    }
  }, [sref, name]);

  if (loading) return <CircularProgress />;

  // Render nothing if there's no data
  if (!data || data.length === 0) return null;

  return (
    <div>
      <Graph
        proximal_values={data}
        distal_values={[]} // Assuming the first graph uses only proximal values
        dataset={{ accession, target: name }} // Add the dataset prop
        title="ATAC-seq Plot"
        width={500}
        height={300}
        xAxisProps={{ fontSize: 12, title: "Position" }}
        yAxisProps={{ fontSize: 12, title: "ATAC-seq Signal" }}
        sref={sref} // Use sref instead of ref
      />
      <Button variant="contained" color="primary" onClick={handleDownload}>
        Export SVG
      </Button>
    </div>
  );
};

export default ATACPlot;
