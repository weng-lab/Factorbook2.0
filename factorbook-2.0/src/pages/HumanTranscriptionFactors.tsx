"use client";

import * as React from "react";
import { Box, Typography, useMediaQuery, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Searchbar from "@/components/Searchbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

const HumanTranscriptionFactors: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Topbar />
      <Box
        sx={{
          backgroundColor: "#2A2A2D",
          width: "100vw",
          minHeight: "700px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          paddingTop: "40px",
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
          }}
        >
          <Grid2
            container
            spacing={2}
            sx={{
              width: "100%",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Grid2
              xs={12}
              md={6}
              sx={{
                textAlign: isSmallScreen ? "center" : "left",
                padding: isSmallScreen ? "0 10px" : "0",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "var(--common-white-main, #FFF)",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontFamily: "Helvetica Neue",
                  fontSize: "48px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "116.7%", // 56.016px
                  marginBottom: "20px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Human Transcription Factors
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--common-white-main, #FFF)",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontFamily: "Helvetica Neue",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "150%", // 24px
                  letterSpacing: "0.15px",
                  maxWidth: "900px",
                  marginBottom: "20px",
                  textAlign: isSmallScreen ? "center" : "left",
                }}
              >
                Transcription factors (TFs) are regulatory proteins in the
                complex networks that underpin cellular function. They bind to
                specific DNA sequences, typically in the regulatory regions of
                the genome. They activate or repress the transcription of genes,
                thereby controlling the flow of genetic information from DNA to
                mRNA. The human genome encodes for approximately 1800 TFs, each
                with unique binding sites and mechanisms of action. TFs are
                often categorized based on their DNA binding domains and the
                sequences they recognize. Their activity is regulated by various
                mechanisms, including post-translational modifications,
                interaction with other proteins, and environmental signals. TFs
                are central to many biological processes, such as development,
                cell cycle, and response to stimuli. Dysregulation of TF
                activity can lead to a variety of diseases, including cancer,
                making them significant targets in biomedical research.
              </Typography>
              <Searchbar
                placeholder="What are you searching for today?"
                helperText=""
              />
            </Grid2>
            <Grid2
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                padding: isSmallScreen ? "20px 0" : "0",
              }}
            >
              <img
                src="/Face.png"
                alt="Illustration"
                style={{
                  width: "100%",
                  maxWidth: "974.034px",
                  height: "auto",
                  flexShrink: 0,
                  objectFit: "contain",
                }}
              />
            </Grid2>
          </Grid2>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="primary tabs example"
          sx={{ marginBottom: "20px" }}
        >
          <Tab
            label="Browse all Transcription Factors"
            sx={{ textTransform: "none" }}
          />
          <Tab label="Browse all Cell Types" sx={{ textTransform: "none" }} />
        </Tabs>
        <Box>
          {tabValue === 0 && (
            <Typography
              sx={{
                color: "var(--common-white-main, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Helvetica Neue",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "150%", // 24px
                letterSpacing: "0.15px",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              Content for Browse all Transcription Factors
            </Typography>
          )}
          {tabValue === 1 && (
            <Typography
              sx={{
                color: "var(--common-white-main, #FFF)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Helvetica Neue",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "150%", // 24px
                letterSpacing: "0.15px",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              Content for Browse all Cell Types
            </Typography>
          )}
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default HumanTranscriptionFactors;
