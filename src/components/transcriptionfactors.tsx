"use client";

import * as React from "react";
import { Box, Typography, useMediaQuery, useTheme, Grid2 } from "@mui/material";
import TFSearchBar from "@/components/tfsearchbar";

const TranscriptionFactors = ({
  header,
  content,
  image,
  tf,
  assembly,
}: {
  header: string;
  content: string;
  image: string;
  tf?: boolean;
  assembly?: string;
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (<>
    <Box
      sx={{
        backgroundColor: "#2A2A2D",
        width: "100%",
        minHeight: "700px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: "40px",
        position: "relative",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "700px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          padding: "0 24px",
          gap: "24px",
          boxSizing: "border-box",
          margin: "0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid2
          container
          spacing={2}
          sx={{
            width: "100%",
            alignItems: "center",
            flexShrink: 0,
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          <Grid2
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              padding: isSmallScreen ? "0 10px" : "0",
              boxSizing: "border-box",
              order: isSmallScreen ? 2 : 1,
            }}
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography
              variant="h3"
              sx={{
                color: "var(--common-white-main, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 400,
                marginBottom: "20px",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              {header}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "var(--common-white-main, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "150%",
                letterSpacing: "0.15px",
                maxWidth: "900px",
                marginBottom: "20px",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              {content}
            </Typography>
            {tf ? <TFSearchBar assembly={assembly || "GRCh38"} /> : <></>}
          </Grid2>
          <Grid2
            sx={{
              display: isSmallScreen ? "none" : "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              padding: "0",
              boxSizing: "border-box",
              order: 2,
              position: "relative",
              zIndex: 1,
            }}
            size={{
              xs: 12,
              md: 6
            }}>
            <img
              src={image}
              alt="Illustration"
              style={{
                width: "100%",
                maxWidth: isMediumScreen ? "80%" : "100%",
                height: "auto",
                flexShrink: 0,
                objectFit: "contain",
              }}
            />
          </Grid2>
        </Grid2>
      </Box>
      {isSmallScreen && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            alt="Illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
            }}
          />
        </Box>
      )}
    </Box>
  </>);
};

export default TranscriptionFactors;
