import React from "react";
import { Typography, Link, Box } from "@mui/material";

interface TOMTOMMessageProps {
  tomtomMatch?: {
    jaspar_name?: string;
    target_id: string;
  };
}

export const TOMTOMMessage: React.FC<TOMTOMMessageProps> = ({
  tomtomMatch,
}) => (
  <Box
    sx={{
      padding: "8px",
      backgroundColor: "#E3F2FD",
      borderRadius: "8px",
      marginTop: "8px",
    }}
  >
    {tomtomMatch ? (
      <>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Best external database match:
        </Typography>
        {tomtomMatch.jaspar_name ? (
          <Link
            href={`http://jaspar2020.genereg.net/matrix/${tomtomMatch.target_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tomtomMatch.target_id}/{tomtomMatch.jaspar_name} (JASPAR)
          </Link>
        ) : (
          <Link
            href={`https://hocomoco11.autosome.ru/motif/${tomtomMatch.target_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tomtomMatch.target_id} (HOCOMOCO)
          </Link>
        )}
      </>
    ) : (
      <Typography variant="body2">(no external database match)</Typography>
    )}
  </Box>
);
