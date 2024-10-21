"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useCellTypeDescription } from "./hooks";
import { CtDetailProps } from "./types";

const CtDetails: React.FC<CtDetailProps> = ({
  species,
  celltype,
  hideFactorCounts,
  row,
}) => {
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";
  const { data: ctData } = useCellTypeDescription(assembly, celltype);
  const celltypeDesc = ctData?.celltype[0];

  return (
    <Box>
      {/* Display the Wikipedia description */}
      {celltypeDesc?.wiki_desc ? (
        <Typography>{celltypeDesc.wiki_desc.split(".")[0]}.</Typography>
      ) : (
        ""
      )}

      {/* If hideFactorCounts is true, show some custom message */}
      {hideFactorCounts && ""}
    </Box>
  );
};

export default CtDetails;
