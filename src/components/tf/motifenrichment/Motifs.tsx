import React from "react";
import { Box, Typography } from "@mui/material";
import useDeepLearnedMotifs from "./Hooks";

interface Props {
  tf: string;
  species: string;
}

const Motifs: React.FC<Props> = ({ tf, species }) => {
  const { motifs, loading, error } = useDeepLearnedMotifs(tf, species);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box>
      <Typography variant="h6">Motifs</Typography>
      {motifs.map((motif: { id: string; name: string }) => (
        <Typography key={motif.id}>{motif.name}</Typography>
      ))}
    </Box>
  );
};

export default Motifs;
