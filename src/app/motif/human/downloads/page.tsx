"use client";

import { Box, Button, styled, Typography, useMediaQuery, useTheme, Grid2 } from "@mui/material"
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const CustomButton = styled(Button)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    backgroundColor: theme.palette.primary.main,
    textTransform: "none",
    "&:focus, &:hover, &:active": {
      backgroundColor: theme.palette.primary.main,
    },
  }));

const MotifsDownloads = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Target mobile screens
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Target tablet screens
    
    return (
      (<Box
        sx={{
          mt: 4,
          mx: "auto",
          pt: 16.5,
          pb: 26,
          maxWidth: isMobile ? "90%" : "800px",
        }}
      >
        <Grid2 container spacing={4}>
          <Grid2
            size={{
              xs: 12,
              sm: 6
            }}>
            <Typography variant="h6" gutterBottom>
              MEME ChIP-seq Catalog
            </Typography>
            <Typography variant="body2" gutterBottom>
              6,069 Motifs
              <br />
              733 TFs
            </Typography>
            <CustomButton
              variant="contained"
              startIcon={<SaveAltIcon />}
              href="/motifscatlog/factorbook_chipseq_meme_motifs.tsv"
            >
              Download motifs in MEME Format
            </CustomButton>
            <CustomButton
              variant="contained"
              startIcon={<SaveAltIcon />}
              href="/motifscatlog/complete-factorbook-catalog.meme.gz"
            >
              Download metadata in TSV Format
            </CustomButton>
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6
            }}>
            <Typography variant="h6" gutterBottom>
              HT-SELEX Catalog
            </Typography>
            <Typography variant="body2" gutterBottom>
              6,700 Motifs
              <br />
              631 TFs
            </Typography>
            <CustomButton
              variant="contained"
              startIcon={<SaveAltIcon />}
              href="/motifscatlog/all-selex-motifs.meme.gz"
            >
              Download motifs in MEME Format
            </CustomButton>
          </Grid2>
        </Grid2>
      </Box>)
    );
};

export default MotifsDownloads;