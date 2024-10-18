"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PeakIntersectionView from "../../../peakintersection";
import MotifIntersectionView from "../../../motifintersection";
import { useSNPData } from "../../../../../hooks";
import { ChainFile } from "liftover";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { chainFileFetch } from "../../../chainfilefetch";

const AnnotationDetailLD = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [loadingChains, setLoadingChains] = useState(false);
  const [chainFile, setChainFile] = useState<ChainFile | undefined>(undefined);

  useEffect(() => {
    setLoadingChains(true);
    chainFileFetch().then(
      (loadedChainFile: React.SetStateAction<ChainFile | undefined>) => {
        setChainFile(loadedChainFile);
        setLoadingChains(false);
      }
    );
  }, []);

  const [annotationType, setAnnotationType] = useState("Peak Intersection");
  const { snpid, population, subpopulation, rSquared } = useParams();

  const { data, loading, mafResults } = useSNPData(
    snpid.toString(),
    "hg38",
    population.toString(),
    subpopulation.toString(),
    chainFile
  );

  const snps = useMemo(() => {
    if (!data || !data.snpQuery || !data.snpQuery[0]) {
      return [];
    }

    const leadSnp = data.snpQuery[0];
    const ldSnps = leadSnp.linkageDisequilibrium
      .filter((x) => x.rSquared > parseFloat(rSquared.toString()))
      .map((x) => ({
        ...x.snp,
        rSquared: x.rSquared,
        minorAlleleFrequency:
          mafResults?.get(x.snp?.id || "")?.minorAlleles || [],
        refAllele: mafResults?.get(x.snp?.id || "")?.refAllele || "",
        refFrequency: mafResults?.get(x.snp?.id || "")?.refFrequency || 0,
      }))
      .filter((snp) => snp.id);

    return [
      {
        ...leadSnp,
        rSquared: 1.0,
        minorAlleleFrequency: mafResults?.get(leadSnp.id)?.minorAlleles || [],
        refAllele: mafResults?.get(leadSnp.id)?.refAllele || "",
        refFrequency: mafResults?.get(leadSnp.id)?.refFrequency || 0,
      },
      ...ldSnps,
    ];
  }, [data, rSquared, mafResults]);

  if (loading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <Box sx={{ padding: isMobile ? 2 : isTablet ? 3 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"}>
        Annotations for {snpid}
      </Typography>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginTop: isMobile ? 1 : 2 }}
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
              onClick={() => window.history.back()}
            >
              Annotations
            </Link>
            <Typography color="textPrimary">{snpid}</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              window.history.back();
            }}
            variant="contained"
            color="secondary"
            sx={{
              width: isMobile ? "160px" : "220px",
              height: "41px",
              padding: "8px 24px",
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

      <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
        <Grid item>
          <Typography variant={isMobile ? "body1" : "h6"}>
            Select an annotation:
          </Typography>
        </Grid>
        <Grid item>
          <Select
            value={annotationType}
            onChange={(e) => setAnnotationType(e.target.value)}
            sx={{
              width: isMobile ? "160px" : "230px",
              height: "41px",
              padding: "8px 24px",
              borderRadius: "24px",
              fontFamily: "Helvetica Neue",
              textTransform: "none",
            }}
          >
            <MenuItem value="Peak Intersection">Peak Intersection</MenuItem>
            <MenuItem value="Motif Intersection">Motif Intersection</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Box mt={2}>
        {annotationType === "Peak Intersection" && (
          <PeakIntersectionView snps={snps} assembly="GRCh38" />
        )}
        {annotationType === "Motif Intersection" && (
          <MotifIntersectionView snps={snps} assembly="GRCh38" />
        )}
      </Box>
    </Box>
  );
};

export default AnnotationDetailLD;
