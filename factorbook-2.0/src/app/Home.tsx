"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Searchbar from "@/components/Searchbar";
import Header from "@/components/Header";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            width: isSmallScreen ? "100%" : isMediumScreen ? "60%" : "509px",
            alignItems: "flex-start",
            padding: isSmallScreen ? "0 10px" : "0",
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
            }}
          >
            Welcome to
          </Typography>
          <Box
            sx={{
              position: "relative",
              lineHeight: isSmallScreen ? "30px" : "42.465px",
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
                }}
              >
                book
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="311"
                  height="60"
                  viewBox="0 0 400 61"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "45px",
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
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "750px",
          margin: "0 auto",
          padding: "71px 144px",
          color: "black",
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "554.382px",
            height: "372.055px",
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Image
            src="/Face.png"
            alt="Illustration"
            width={554.382}
            height={372.055}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "16px",
            width: "50%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              alignItems: "center",
              alignSelf: "stretch",
              fill: "rgba(135, 150, 199, 0.30)",
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                width: "220px",
                backgroundColor: "rgba(138, 43, 226, 0.1)",
                borderRadius: "24px",
                height: "41px",
                display: "flex",
                justifyContent: "center",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                },
                "& .MuiInputLabel-outlined": {
                  transform: "translate(14px, 12px) scale(1)",
                },
              }}
            >
              <InputLabel>Select your host</InputLabel>
              <Select
                label="Select your host"
                sx={{
                  borderRadius: "24px",
                  height: "41px",
                  display: "flex",
                  alignItems: "center",
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "24px",
                  },
                  "& .MuiSelect-icon": {
                    right: "14px",
                  },
                }}
              >
                <MenuItem value={10}>Option 1</MenuItem>
                <MenuItem value={20}>Option 2</MenuItem>
                <MenuItem value={30}>Option 3</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{
                marginLeft: "10px",
                padding: "8px 16px",
                backgroundColor: "#6A0DAD",
                color: "#FFF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              Go
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              alignSelf: "stretch",
              marginTop: "16px",
              padding: "8px 16px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#000", fontWeight: 500 }}>
              Explore Transcription Factors
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#000", marginTop: "16px" }}
            >
              Transcription factors (TFs) are pivotal proteins regulating
              cellular functions by binding to specific DNA sequences. With
              around 1800 unique TFs in the human genome, they control gene
              transcription, crucial for processes like development and cell
              cycle.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
