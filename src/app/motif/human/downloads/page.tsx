"use client";

import TfMotifCatalogDownloads from "@/app/downloads/tfMotifCatalogs";
import { Box } from "@mui/material";

const MotifsDownloads = () => {
    return (
      <Box maxWidth={'900px'} minHeight={'800px'} mx={"auto"} my={5}>
        <TfMotifCatalogDownloads />
      </Box>
    )
};

export default MotifsDownloads;