import React, { useContext, useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  XYChart,
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
} from "@visx/xychart";
import { ApiContext } from "@/ApiContext";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "@/components/tf/motifenrichment/Queries";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "@/components/tf/motifenrichment/Types";

const data = [
  { x: "2020-01-01", y: 50 },
  { x: "2020-02-01", y: 10 },
  { x: "2020-03-01", y: 20 },
];

const accessors = {
  xAccessor: (d: { x: string; y: number }) => new Date(d.x),
  yAccessor: (d: { x: string; y: number }) => d.y,
};

interface Props {
  factor: string;
  species: string;
}

const MotifEnrichmentMEME: React.FC<Props> = ({ factor, species }) => {
  const apiContext = useContext(ApiContext);

  const {
    data: selexData,
    loading: selexLoading,
    error: selexError,
  } = useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
    DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
    {
      variables: {
        tf: factor,
        species: species.toLowerCase(),
        selex_round: [1, 2, 3, 4, 5, 6, 7],
      },
      context: apiContext,
    }
  );

  const [hasSelexData, setHasSelexData] = useState(false);

  useEffect(() => {
    if (selexData && selexData.deep_learned_motifs.length > 0) {
      setHasSelexData(true);
    } else {
      setHasSelexData(false);
    }
  }, [selexData]);

  if (selexLoading) return <CircularProgress />;
  if (selexError) return <Typography>Error: {selexError.message}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Motif Enrichment (MEME, ChIP-seq)
      </Typography>
      {hasSelexData ? (
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
      ) : (
        <Typography>No SELEX data available.</Typography>
      )}
    </Box>
  );
};

export default MotifEnrichmentMEME;
