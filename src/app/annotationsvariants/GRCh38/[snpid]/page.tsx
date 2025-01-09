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
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PeakIntersectionView from "./peakintersection";
import MotifIntersectionView from "./motifintersection";
import { useSNPData } from "../../hooks";
import { ChainFile } from "liftover";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { chainFileFetch } from "./chainfilefetch";

const AnnotationDetailPage = () => {
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
  const { snpid } = useParams();

  const { data, loading, mafResults } = useSNPData(
    snpid.toString(),
    "hg38",
    "AFRICAN",
    "NONE",
    chainFile
  );

  const snps = useMemo(
    () =>
      data && data.snpQuery && data.snpQuery[0]
        ? [
            {
              ...data.snpQuery[0],
              rSquared: 1.0,
              refAllele: mafResults?.get(data.snpQuery[0].id)?.refAllele || "",
              minorAlleleFrequency:
                mafResults?.get(data.snpQuery[0]?.id)?.minorAlleles || [],
              refFrequency:
                mafResults?.get(data.snpQuery[0].id)?.refFrequency || 0,
            },
          ]
        : [],
    [data, mafResults]
  );

  if (loading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <>
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
                letterSpacing: "0.46px",
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
    </>
  );
};

export default AnnotationDetailPage;
