"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Searchbar from "@/components/Searchbar";
import Header from "@/components/Header";
import SelectComponent from "@/components/Select";
import Footer from "@/components/Footer";

const CustomCard: React.FC<{
  title: string;
  description: string;
  buttonText?: string;
  buttonColor?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  selectComponent?: React.ReactNode;
  gap?: string; // Added gap prop
}> = ({
  title,
  description,
  buttonText,
  buttonColor,
  imageSrc,
  imageAlt,
  imagePosition,
  selectComponent,
  gap = "40px", // Default gap
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: imagePosition === "left" ? "row-reverse" : "row",
        },
        alignItems: "center",
        padding: "20px",
        gap, // Using gap prop
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          boxShadow: "none",
          borderRadius: "24px",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          paddingLeft: { xs: "10px", sm: "60px" }, // Increased padding
          paddingRight: { xs: "10px", sm: "60px" }, // Increased padding
        }}
      >
        {imagePosition === "left" && (
          <CardMedia
            component="img"
            sx={{
              display: "flex",
              width: { xs: "100%", sm: "auto" },
              height: { xs: "auto", sm: "396px" },
              maxWidth: "544px",
              justifyContent: "center",
              alignItems: "center",
              marginRight: gap, // Adjust margin to create space
            }}
            image={imageSrc}
            alt={imageAlt}
          />
        )}
        <CardContent sx={{ flex: "1 0 auto", padding: "16px" }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
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
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              alignSelf: "stretch",
              padding: "8px 16px",
              maxWidth: "539px",
              color: "#333",
            }}
          >
            {description}
          </Typography>
          <CardActions sx={{ paddingLeft: "16px" }}>
            {buttonText ? (
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  padding: "8px 16px",
                  alignItems: "center",
                  gap: "2px",
                  alignSelf: "stretch",
                  backgroundColor: buttonColor,
                  borderRadius: "24px",
                  textTransform: "none",
                  fontWeight: "medium",
                  color: "#FFFFFF",
                }}
              >
                {buttonText}
              </Button>
            ) : (
              selectComponent
            )}
          </CardActions>
        </CardContent>
        {imagePosition === "right" && (
          <CardMedia
            component="img"
            sx={{
              display: "flex",
              width: "544px",
              height: "396px",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: gap, // Increased padding to the left
            }}
            image={imageSrc}
            alt={imageAlt}
          />
        )}
      </Card>
    </Box>
  );
};

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
          height: "auto",
          margin: "0 auto",
          padding: "5% 20%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <CustomCard
          title="Transcription Factors"
          description="Transcription factors (TFs) are pivotal proteins regulating cellular functions by binding to specific DNA sequences. With around 1800 unique TFs in the human genome, they control gene transcription, crucial for processes like development and cell cycle."
          imageSrc={imageSrc}
          imageAlt="Transcription Factors"
          imagePosition="left"
          selectComponent={
            <SelectComponent
              onChange={handleSelectChange}
              onClick={handleGoClick}
            />
          }
          gap="60px" // Increased gap
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: "5% 10%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <CustomCard
          title="Motif Site Catalog"
          description="Transcription factors (TFs) are pivotal proteins regulating cellular functions by binding to specific DNA sequences. With around 1800 unique TFs in the human genome, they control gene transcription, crucial for processes like development and cell cycle."
          buttonText="Explore Motifs"
          buttonColor="#8169BF"
          imageSrc="/IllustrationsNew.png"
          imageAlt="Motif Site Catalog"
          imagePosition="right"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          padding: "5% 25%",
          overflow: "hidden", // Ensure no overflow
        }}
      >
        <CustomCard
          title="Annotate Variants"
          description="Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants."
          imageSrc="/Human.png"
          imageAlt="Human Annotate Variants"
          imagePosition="left"
          buttonText="Explore Annotations"
          buttonColor="#8169BF"
          gap="10%" // Increased gap
        />
      </Box>

      <Footer />
    </>
  );
};

export default HomePage;
