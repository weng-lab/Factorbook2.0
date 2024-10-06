"use client";

import { useParams } from "next/navigation";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MotifUMAP from "@/components/MotifSearch/UMap";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  Divider,
  Breadcrumbs,
  Link,
  Grid,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RegexSearchResults from "@/components/MotifSearch/regexsearchresults";

const CustomButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "8px",
  backgroundColor: "#8169BF",
  textTransform: "none",
  "&:focus, &:hover, &:active": {
    backgroundColor: "#8169BF",
  },
});

const MotifDetails = () => {
  const { species, regex } = useParams<{ species: string; regex: string }>();
  const [value, setValue] = React.useState(0);

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
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4">Motif search results for {regex}</Typography>

          <Grid container alignItems="center" justifyContent="space-between">
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
                  onClick={() => window.open(`/MotifsCatalog`, "_self")}
                >
                  Motif Catalog
                </Link>
                <Typography color="textPrimary">{regex}</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  //window.history.back();
                  window.open(`/MotifsCatalog`, "_self");
                }}
                variant="contained"
                color="secondary"
                sx={{
                  width: "220px",
                  height: "41px",
                  padding: "8px 24px",
                  borderRadius: "24px",
                  backgroundColor: "#8169BF",
                  color: "white",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  letterSpacing: "0.46px",
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

          <Divider sx={{ my: 4 }} />

          <Box sx={{ padding: 4 }}>
            <RegexSearchResults regex={regex} />
          </Box>
        </Box>
      )}
      {value === 3 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <Grid2 container spacing={4}>
            <Grid2 xs={6}>
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
                href="/MotifsCatalog/factorbook_chipseq_meme_motifs.tsv"
              >
                Download motifs in MEME Format
              </CustomButton>
              <CustomButton
                variant="contained"
                startIcon={<SaveAltIcon />}
                href="/MotifsCatalog/complete-factorbook-catalog.meme.gz"
              >
                Download metadata in TSV Format
              </CustomButton>
            </Grid2>
            <Grid2 xs={6}>
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
                href="/MotifsCatalog/all-selex-motifs.meme.gz"
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
