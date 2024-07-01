"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useCellTypeDescription } from "./hooks";
import { CtDetailProps } from "./types";

const CtDetails: React.FC<CtDetailProps> = ({ species, celltype, row }) => {
  const assembly = species === "human" ? "GRCh38" : "mm10";
  const { data: ctData } = useCellTypeDescription(assembly, celltype);
  const celltypeDesc = ctData?.celltype[0];

  return (
    <Box>
      <Link href={`/celltypes/${species}/${row.biosample.name}`} passHref>
        <Typography variant="h6">{row.biosample.name}</Typography>
      </Link>
      <Typography>{row.counts.total} Experiments</Typography>
      {celltypeDesc?.wiki_desc && (
        <Typography>{celltypeDesc.wiki_desc.split(".")[0]}.</Typography>
      )}
    </Box>
  );
};

export default CtDetails;
