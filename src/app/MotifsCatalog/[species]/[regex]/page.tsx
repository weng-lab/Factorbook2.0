"use client";

import { useParams } from "next/navigation";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MotifUMAP from "@/components/motifsearch/umap";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  Divider,
  Breadcrumbs,
  Link,
  Grid,
  useMediaQuery,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RegexSearchResults from "@/components/motifsearch/regexsearchresults";

const CustomButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "8px",
  backgroundColor: "#8169BF",
  textTransform: "none",
  "&:focus, &:hover, &:active": {
    backgroundColor: "#8169BF",
  },
}));

const MotifDetails = () => {
  const { species, regex } = useParams<{ species: string; regex: string }>();
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // For mobile devices
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // For tablet devices

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="full width tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label="Motif Search" />
          <Tab label="MEME Motif UMAP" />
          <Tab label="HT SELEX Motif UMAP" />
          <Tab label="Downloads" />
        </Tabs>
      </Box>

      {value === 1 && (
        <MotifUMAP key="meme" title="meme" url="/human-meme-umap.json.gz" />
      )}
      {value === 2 && (
        <MotifUMAP key="selex" title="selex" url="/ht-selex-umap.json.gz" />
      )}
      {value === 0 && (
        <Box sx={{ padding: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h5" : "h4"}>
            Motif search results for {regex}
          </Typography>

          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: isMobile ? 2 : 4 }}
          >
            <Grid item>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 2 }}
                style={{ margin: "3px" }}
              >
                <Link
                  color="inherit"
                  underline="hover"
                  onClick={() => (window.location.href = `/`)}
                >
                  Homepage
                </Link>
                <Link
                  color="inherit"
                  underline="hover"
                  onClick={() => window.open(`/motifscatalog`, "_self")}
                >
                  Motif Catalog
                </Link>
                <Typography color="textPrimary">{regex}</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  window.open(`/motifscatalog`, "_self");
                }}
                variant="contained"
                color="secondary"
                sx={{
                  width: isMobile ? "160px" : "220px",
                  height: isMobile ? "36px" : "41px",
                  padding: isMobile ? "6px 16px" : "8px 24px",
                  borderRadius: "24px",
                  backgroundColor: "#8169BF",
                  color: "white",
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#7151A1",
                  },
                }}
              >
                <NavigateBeforeIcon />
                Perform New Search
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: isMobile ? 2 : 4 }} />

          <Box sx={{ padding: isMobile ? 2 : 4 }}>
            <RegexSearchResults regex={regex} />
          </Box>
        </Box>
      )}

      {value === 3 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: isMobile ? "90%" : "800px" }}>
          <Grid2 container spacing={4}>
            <Grid2 xs={12} sm={6}>
              <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
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
                href="/motifscatalog/factorbook_chipseq_meme_motifs.tsv"
              >
                Download motifs in MEME Format
              </CustomButton>
              <CustomButton
                variant="contained"
                startIcon={<SaveAltIcon />}
                href="/motifscatalog/complete-factorbook-catalog.meme.gz"
              >
                Download metadata in TSV Format
              </CustomButton>
            </Grid2>
            <Grid2 xs={12} sm={6}>
              <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
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
                href="/motifscatalog/all-selex-motifs.meme.gz"
              >
                Download motifs in MEME Format
              </CustomButton>
            </Grid2>
          </Grid2>
        </Box>
      )}
    </>
  );
};

export default MotifDetails;
