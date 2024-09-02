import React from "react";
import { Alert, Link, Box } from "@mui/material";
import { TOMTOMMessageProps } from "./Types";

export const TOMTOMMessage: React.FC<TOMTOMMessageProps> = ({
  tomtomMatch,
}) => (
  <Box sx={{ mt: 2 }}>
    <Alert severity="info">
      {tomtomMatch ? (
        <>
          <strong>Best external database match:</strong>
          <br />
          {tomtomMatch.jaspar_name ? (
            <Link
              href={`http://jaspar2020.genereg.net/matrix/${tomtomMatch.target_id}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              {tomtomMatch.target_id}/{tomtomMatch.jaspar_name} (JASPAR)
            </Link>
          ) : (
            <Link
              href={`https://hocomoco11.autosome.ru/motif/${tomtomMatch.target_id}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              {tomtomMatch.target_id} (HOCOMOCO)
            </Link>
          )}
        </>
      ) : (
        "(no external database match)"
      )}
    </Alert>
  </Box>
);
