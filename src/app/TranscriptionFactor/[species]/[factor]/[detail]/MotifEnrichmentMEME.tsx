import React from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import { MOTIF_QUERY } from "./Queries";

const MotifEnrichmentMEME = () => {
  const { data, loading, error } = useQuery(MOTIF_QUERY, {
    variables: { peaks_accession: ["ENCFF992CTF"] },
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Typography variant="h4">Motif Enrichment (MEME)</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default MotifEnrichmentMEME;
