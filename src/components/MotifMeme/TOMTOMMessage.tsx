import React from "react";
import { Box, Typography } from "@mui/material";
import { TOMTOMMessageProps } from "./Types";

export const TOMTOMMessage: React.FC<TOMTOMMessageProps> = ({
  tomtomMatch,
}) => {
  return (
    <Box
      sx={{
        marginTop: "1em",
        padding: "1em",
        borderRadius: "8px",
        backgroundColor: tomtomMatch
          ? "rgba(144, 238, 144, 0.3)"
          : "rgba(255, 99, 71, 0.3)",
        border: tomtomMatch ? "2px solid green" : "2px solid red",
      }}
    >
      {tomtomMatch ? (
        <>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Best external database match:
          </Typography>
          <Typography variant="body2">
            {tomtomMatch.jaspar_name ? (
              <a
                href={`http://jaspar2020.genereg.net/matrix/${tomtomMatch.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tomtomMatch.target_id}/{tomtomMatch.jaspar_name} (JASPAR)
              </a>
            ) : (
              <a
                href={`https://hocomoco11.autosome.ru/motif/${tomtomMatch.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tomtomMatch.target_id} (HOCOMOCO)
              </a>
            )}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No external database match found.
        </Typography>
      )}
    </Box>
  );
};
