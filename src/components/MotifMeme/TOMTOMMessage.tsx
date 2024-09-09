import React from "react";
import { Box, Typography } from "@mui/material";
import { TOMTOMMessageProps } from "./Types";

export const TOMTOMMessage: React.FC<TOMTOMMessageProps> = ({
  tomtomMatch,
}) => {
  // Log the tomtomMatch to check its value
  console.log("TOMTOM Match:", tomtomMatch);

  // Ensure we have both a target_id and target_id is not null or empty
  const hasValidMatch = tomtomMatch && tomtomMatch.target_id;

  return (
    <Box
      sx={{
        marginTop: "1em",
        padding: "1em",
        borderRadius: "8px",
        backgroundColor: hasValidMatch
          ? "rgba(144, 238, 144, 0.3)" // Light green background for match
          : "rgba(255, 99, 71, 0.3)", // Light red background for no match
        border: hasValidMatch ? "2px solid green" : "2px solid red",
      }}
    >
      {hasValidMatch ? (
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
          (no external database match)
        </Typography>
      )}
    </Box>
  );
};
