"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  useMediaQuery,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import SelectComponent from "@/components/select";
import PortalPanel from "@/components/portalpanel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TFSearchbar from "@/components/tfsearchbar";
import SnpSearchBar from "@/components/snpsearchbar";
import MotifSearchbar from "@/components/motifsearchbar";

const Homepage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [imageSrc, setImageSrc] = React.useState<string>("/Face.png");
  const [selectedValue, setSelectedValue] = React.useState<string>("human");
  const [selectedPortal, setSelectedPortal] = React.useState<string>(
    "Human Transcription Factors"
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

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
    if (selectedValue) {
      router.push(`/tf/${selectedValue}`);
    }
  };

  const handleSubmit = (snpValue: string) => {
    router.push(`/snpannotation/hg38/${snpValue}`)
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center the inner box
          backgroundColor: "var(--material-theme-ref-neutral-neutral17, #2A2A2D)",
          width: "100vw",
          height: "auto",
          margin: "0 auto",
          p: isSmallScreen ? "20px 0" : "71px 144px",
          color: "white",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isSmallScreen ? "center" : "flex-start",
            width: "100%",
            maxWidth: "1300px", // Set the max width for content
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
              p: 2,
              zIndex: isSmallScreen ? 1 : "auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isSmallScreen ? "14px" : "16px",
                fontWeight: "normal",
                mb: 1,
                color: "#FFF",
                fontFeatureSettings: "'clig' off, 'liga' off",
                lineHeight: "24px",
                letterSpacing: "0.15px",
                ml: isSmallScreen ? 2 : 0,
              }}
            >
              Welcome to
            </Typography>
            <Box
              sx={{
                position: "relative",
                ml: isSmallScreen ? 2 : 0,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: isSmallScreen ? "40px" : "57px",
                  fontWeight: 500,
                  letterSpacing: "-2.28px",
                  mb: 0,
                  position: "relative",
                  color: "#FFF",
                  fontStyle: "normal",
                  lineHeight: "74.5%",
                }}
              >
                factor
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    pl: isSmallScreen ? 4.5 : 9.5,
                    position: "relative",
                    ml: isSmallScreen ? 2 : 0,
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
                      left: isSmallScreen ? "-30px" : "-15px",
                      top: isSmallScreen ? "25px" : "40px",
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
                mt: 5,
                ml: isSmallScreen ? 2 : 0,
              }}
            >
              Factorbook is a resource for human and mouse transcription factors,
              focusing on their binding specificities and regulatory roles in gene
              expression across cell types. Factorbook integrates public data,
              especially ENCODE data, to provide a wide-ranging motif catalog and transcription factor binding sites.
              <br />
              <br />
              Human: 3318 experiments ‧ 1146 transcription factors ‧ 185 cell types
              <br />
              Mouse: 195 experiments ‧ 54 transcription factors ‧ 35 cell types
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: 1,
                alignSelf: "stretch",
                mt: 4,
                width: isSmallScreen ? "100%" : "550px",
                ml: isSmallScreen ? 2 : 0,
              }}
            >
              <FormControl variant="standard">
                <InputLabel
                  id="search-portal"
                  sx={{
                    color: "white",
                    "&.Mui-focused": { color: theme.palette.primary.main },
                  }}
                >
                  Search
                </InputLabel>
                <Select
                  value={selectedPortal}
                  variant="standard"
                  IconComponent={ArrowDropDownIcon}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "white",
                        "& .MuiMenuItem-root": {
                          color: "black",
                          "&:hover": {
                            backgroundColor: "rgba(218, 226, 136, 0.2)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(218, 226, 136, 0.4)",
                            color: "black",
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    ":before": { borderBottomColor: "white" },
                    ":after": { borderBottomColor: theme.palette.primary.main },
                    "& .MuiSvgIcon-root": { color: "white" },
                    color: "white",
                    minWidth: "200px",
                  }}
                >
                  <MenuItem value="Human Transcription Factors">
                    Human Transcription Factors
                  </MenuItem>
                  <MenuItem value="Mouse Transcription Factors">
                    Mouse Transcription Factors
                  </MenuItem>
                  <MenuItem value="Motif Site Catalog">
                    Motif Site Catalog
                  </MenuItem>
                  <MenuItem value="Annotate Variants">Annotate Variants</MenuItem>
                </Select>
              </FormControl>

              <Box
                sx={{
                  padding: "9px 9px 8px 0px",
                  width: "550px",
                  zIndex: 1
                }}
              >
                {selectedPortal === "Human Transcription Factors" ||
                  selectedPortal === "Mouse Transcription Factors" ? (
                  <TFSearchbar
                    assembly={
                      selectedPortal === "Human Transcription Factors"
                        ? "GRCh38"
                        : "mm10"
                    }
                  />
                ) : selectedPortal === "Annotate Variants" ? (
                  <SnpSearchBar handleSubmit={handleSubmit} />
                ) : (
                  <MotifSearchbar />
                )}
              </Box>
            </Box>
          </Box>
          {!isSmallScreen && (
            <Box
              sx={{
                display: "flex",
                width: "550px",
                height: "507.537px",
                position: "relative"
              }}
            >
              <Image
                src="/Factorbook.png"
                alt="Illustration"
                fill
                objectFit="contain"
              />
            </Box>
          )}
        </Box>
      </Box>
      <Header />

      <PortalPanel
        title="Transcription Factors"
        description="Transcription factors (TFs) are pivotal proteins regulating cellular functions by binding to specific DNA sequences. With around 1800 unique TFs in the human genome, they control gene transcription, crucial for processes like development and cell cycle."
        imageSrc={imageSrc}
        imageAlt="Transcription Factors"
        selectComponent={
          <SelectComponent
            onChange={handleSelectChange}
            onClick={handleGoClick}
            selectedValue={selectedValue}
          />
        }
        reverse={false}
      />

      <PortalPanel
        title="Motif Site Catalog"
        description="Sequence motifs of transcription factors (TFs) are specific, short DNA sequences that TFs recognize and bind to. These motif sites, typically ranging from 6 to 20 base pairs, are essential for the precise regulation of gene expression. The diversity and specificity of these motifs underlie the complexity of gene regulation."
        imageSrc="/Motifs.png"
        imageAlt="Motif Site Catalog"
        buttonText="Explore Motifs"
        buttonHref="/motif/human/meme-search"
        reverse={true}
      />

      <PortalPanel
        title="Annotate Variants"
        description="Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants."
        imageSrc="/Human.png"
        imageAlt="Annotate Variants"
        buttonText="Explore Annotations"
        buttonHref="/snpannotation"
        reverse={false}
      />
    </>
  );
};

export default Homepage;
