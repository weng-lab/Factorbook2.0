import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // For the tick mark
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // For no match
import { TOMTOMMessageProps } from "./types";

/**
 * 
 * @todo this would be more appropriately handled with an MUI <Alert> component. Not sure why it was manually reconstructed.
 */

export const TOMTOMMessage: React.FC<TOMTOMMessageProps> = ({
  tomtomMatch,
}) => {
  const hasValidMatch = tomtomMatch?.target_id; // Safely check if tomtomMatch and target_id exist

  return (
    <Box
      sx={{
        display: "flex", // Align icon and text horizontally
        alignItems: "center", // Vertically center icon and text
        padding: "1em",
        borderRadius: "16px", // Rounded box
        backgroundColor: hasValidMatch
          ? "rgba(144, 238, 144, 0.2)" // Lighter green background for match
          : "rgba(255, 99, 71, 0.1)", // Lighter red background for no match
      }}
    >
      {hasValidMatch ? (
        <CheckCircleOutlineIcon
          sx={{
            color: "green", // Green border and check mark
            marginRight: "0.5em", // Space between the icon and the text
          }}
        />
      ) : (
        <ErrorOutlineIcon
          sx={{
            color: "red", // Red border for no match
            marginRight: "0.5em", // Space between the icon and the text
          }}
        />
      )}
      <Box>
        {/* Best external database match text */}
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, color: hasValidMatch ? "green" : "red" }} // Adjusted text color
        >
          {hasValidMatch ? "Best external database match:" : "No match found"}
        </Typography>

        {/* Match content, new line */}
        {hasValidMatch ? (
          <Typography variant="body2">
            {tomtomMatch?.jaspar_name ? (
              <a
                href={`http://jaspar2020.genereg.net/matrix/${tomtomMatch.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "green" }} // Link color for match
              >
                {tomtomMatch.target_id}/{tomtomMatch.jaspar_name} (JASPAR)
              </a>
            ) : (
              <a
                href={`https://hocomoco11.autosome.ru/motif/${tomtomMatch?.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "green" }} // Link color for match
              >
                {tomtomMatch?.target_id} (HOCOMOCO)
              </a>
            )}
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            (no external database match)
          </Typography>
        )}
      </Box>
    </Box>
  );
};
