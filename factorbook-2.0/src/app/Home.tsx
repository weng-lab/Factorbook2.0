"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Searchbar from "@/components/Searchbar";
import Header from "@/components/Header";
import SelectComponent from "@/components/Select";
import Footer from "@/components/Footer";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [imageSrc, setImageSrc] = React.useState<string>("/Face.png");
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    if (value === "mouse") {
      setImageSrc("/Mouse.png");
    } else {
      setImageSrc("/Face.png");
    }
  };

  const handleGoClick = () => {
    if (selectedValue === "human") {
      router.push("/HumanTranscriptionFactors");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: isSmallScreen ? "center" : "space-between",
          alignItems: isSmallScreen ? "center" : "flex-start",
          backgroundColor:
            "var(--material-theme-ref-neutral-neutral17, #2A2A2D)",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: isSmallScreen ? "20px 0" : "71px 144px",
          color: "white",
          fontFamily: "'Helvetica Neue'",
          overflow: "hidden", // Ensure no overflow
          position: "relative",
        }}
      >
        {isSmallScreen && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              opacity: 0.5,
            }}
          >
            <Image
              src="/Factorbook.png"
              alt="Background Illustration"
              layout="fill"
              objectFit="cover"
            />
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            width: isSmallScreen ? "100%" : isMediumScreen ? "60%" : "509px",
            alignItems: "flex-start",
            padding: isSmallScreen ? "0 10px" : "0",
            zIndex: isSmallScreen ? 1 : "auto",
            marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: isSmallScreen ? "14px" : "16px",
              fontWeight: "normal",
              marginBottom: "4px",
              color: "#FFF",
              fontFeatureSettings: "'clig' off, 'liga' off",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
            }}
          >
            Welcome to
          </Typography>
          <Box
            sx={{
              position: "relative",
              lineHeight: isSmallScreen ? "30px" : "42.465px",
              marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: isSmallScreen ? "40px" : "57px",
                fontWeight: 500,
                letterSpacing: "-2.28px",
                marginBottom: "0px",
                position: "relative",
                color: "#FFF",
                fontFamily: "Helvetica Neue",
                fontStyle: "normal",
                lineHeight: "74.5%", // 42.465px
              }}
            >
              factor
              <Box
                component="span"
                sx={{
                  display: "block",
                  paddingLeft: isSmallScreen ? "2rem" : "5rem",
                  position: "relative",
                  marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
                }}
              >
                book
                <svg
                  width="311"
                  height="60"
                  viewBox="0 0 400 61"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: isSmallScreen ? "-30px" : "-15px", // Adjust position for mobile view
                    top: isSmallScreen ? "25px" : "40px", // Decrease the gap between factorbook and curve line
                    bottom: "-20px",
                  }}
                >
                  <path
                    d="M5 55.5C86.1348 -2.34681 214.849 -4.48929 306 21.2205"
                    stroke="rgba(218, 226, 136, 0.96)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </Box>
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "#FFF",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontSize: isSmallScreen ? "14px" : "18px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              maxWidth: "600px",
              marginTop: "40px",
              marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
            }}
          >
            Factorbook is a resource for human and mouse transcription factors,
            focusing on their binding specificities and regulatory roles in gene
            expression across cell types. Factorbook integrates public data,
            especially ENCODE, to provide a wide-ranging motif catalog.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "9px 12px 8px 0",
              gap: "3px",
              alignSelf: "stretch",
              marginTop: "32px",
              width: isSmallScreen ? "100%" : "670px",
              marginLeft: isSmallScreen ? "20px" : "0", // Add margin for mobile view
            }}
          >
            <Searchbar
              placeholder="What are you searching for today?"
              helperText=""
            />
          </Box>
        </Box>
        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
              width: "550px",
              height: "507.537px",
              padding: "7px 24px 6.537px 23px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/Factorbook.png"
              alt="Illustration"
              width={600}
              height={600}
            />
          </Box>
        )}
      </Box>
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: "5% 10%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              order: isSmallScreen ? 0 : 1,
            }}
          >
            <Image
              src={imageSrc}
              alt="Transcription Factors"
              width={544}
              height={396}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: isSmallScreen ? "center" : "flex-start",
              gap: "16px",
              order: isSmallScreen ? 1 : 0,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Helvetica Neue",
                fontSize: "34px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "123.5%",
                letterSpacing: "0.25px",
                padding: "16px",
              }}
            >
              Transcription Factors
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                maxWidth: "539px",
                padding: "8px 16px",
              }}
            >
              Transcription factors (TFs) are pivotal proteins regulating
              cellular functions by binding to specific DNA sequences. With
              around 1800 unique TFs in the human genome, they control gene
              transcription, crucial for processes like development and cell
              cycle.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <SelectComponent
                onChange={handleSelectChange}
                onClick={handleGoClick}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: "5% 10%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              order: isSmallScreen ? 1 : 0,
            }}
          >
            <Image
              src="/IllustrationsNew.png"
              alt="Motif Site Catalog"
              width={544}
              height={396}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: isSmallScreen ? "center" : "flex-start",
              gap: "16px",
              order: isSmallScreen ? 0 : 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Helvetica Neue",
                fontSize: "34px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "123.5%",
                letterSpacing: "0.25px",
                padding: "16px",
              }}
            >
              Motif Site Catalog
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                maxWidth: "539px",
                padding: "8px 16px",
              }}
            >
              Transcription factors (TFs) are pivotal proteins regulating
              cellular functions by binding to specific DNA sequences. With
              around 1800 unique TFs in the human genome, they control gene
              transcription, crucial for processes like development and cell
              cycle.
            </Typography>
            <Button
              variant="contained"
              sx={{
                display: isSmallScreen ? "block" : "none",
                padding: "8px 16px",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: "#8169BF",
                },
              }}
            >
              Label
            </Button>
            <Button
              variant="contained"
              sx={{
                display: isSmallScreen ? "none" : "block",
                padding: "8px 16px",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: "#8169BF",
                },
              }}
            >
              Explore Motifs
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: "5% 10%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              order: isSmallScreen ? 1 : 0,
            }}
          >
            <Image
              src="/Human.png"
              alt="Annotate Variants"
              width={544}
              height={396}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: isSmallScreen ? "center" : "flex-start",
              gap: "16px",
              order: isSmallScreen ? 0 : 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Helvetica Neue",
                fontSize: "34px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "123.5%",
                letterSpacing: "0.25px",
                padding: "16px",
              }}
            >
              Annotate Variants
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                maxWidth: "539px",
                padding: "8px 16px",
              }}
            >
              Genetic variants in regulatory elements of the human genome play a
              critical role in influencing traits and disease susceptibility by
              modifying transcription factor (TF) binding and gene expression.
              Factorbook offers a comprehensive resource of TF binding motifs
              and sites, enabling researchers to predict the impact of genetic
              variants on TF binding and gene regulation, providing valuable
              insights into the functional consequences of these variants.
            </Typography>
            <Button
              variant="contained"
              sx={{
                display: isSmallScreen ? "block" : "none",
                padding: "8px 16px",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: "#8169BF",
                },
              }}
            >
              Label
            </Button>
            <Button
              variant="contained"
              sx={{
                display: isSmallScreen ? "none" : "block",
                padding: "8px 16px",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: "#8169BF",
                },
              }}
            >
              Explore Annotations
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </>
  );
};

export default HomePage;
