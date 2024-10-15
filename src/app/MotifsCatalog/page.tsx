"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  useMediaQuery,
  Theme,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { styled, useTheme } from "@mui/material/styles";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MotifUMAP from "@/components/MotifSearch/UMap";
import ErrorMessage from "./upload/errormessage";

// Styling for text fields and upload areas
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: "8px",
  backgroundColor: "#F3E8FF",
  padding: "32px",
  textAlign: "center",
  color: "#5A5A5A",
  marginTop: "20px",
  position: "relative",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  backgroundColor: theme.palette.primary.main,
  textTransform: "none",
  "&:focus, &:hover, &:active": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const LargeTextField = styled(TextField)(({ theme }) => ({
  minWidth: "700px",
  "& .MuiInputBase-root": {
    height: "32px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "5px",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  // Fix for autofill dropdown styling
  "&:-webkit-autofill": {
    "-webkit-box-shadow": `0 0 0 1000px #EDE7F6 inset`,
    "-webkit-text-fill-color": "#000000",
    "font-family": theme.typography.fontFamily,
    transition: "background-color 5000s ease-in-out 0s",
  },
}));

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

const MotifsCatalogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Target mobile screens
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Target tablet screens

  const [value, setValue] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorFiles, setErrorFiles] = React.useState<File[]>([]);
  const [val, setVal] = React.useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateFile(file);
    }
  };

  // Validate file type: only allow `.meme` files
  const validateFile = (file: File) => {
    if (file.name.endsWith(".meme")) {
      setSelectedFile(file); // Valid file, process it
      setErrorFiles([]); // Clear previous errors
    } else {
      setSelectedFile(null); // Invalid file, don't set it
      setErrorFiles([file]); // Set the invalid file for error display
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const fileName = selectedFile.name;
      const motifName = fileName.replace(".meme", "");

      // Replace spaces in the motif name
      const sanitizedMotifName = motifName.replace(/\s+/g, "");

      // This is the actual redirection URL used for fetching or loading the motif
      const redirectUrl = `/MotifsCatalog/Human/${sanitizedMotifName}`;

      // This is the URL that will be shown in the browser's address bar
      const displayUrl = `/FileUpload/${sanitizedMotifName}`;

      // Use history.pushState to change the URL in the address bar without a full page reload
      window.history.pushState({}, "", displayUrl);

      // Redirect to the motif URL based on the sanitized file name
      window.location.href = redirectUrl;
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      validateFile(file);
    }
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

      {value === 0 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: isMobile ? "90%" : "800px" }}>
          <Typography variant="h6" gutterBottom>
            Enter a consensus sequence or regex:
          </Typography>
          <StyledBox>
            <LargeTextField
              placeholder="enter sequence or regex"
              onChange={(e) => setVal(e.target.value)}
              sx={{
                minWidth: isMobile ? "100%" : "700px",
              }}
            />
            <Button
              variant="contained"
              sx={{
                margin: "auto",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                mt: isMobile ? 2 : 0,
              }}
              onClick={() => {
                if (val) {
                  window.open(`/MotifsCatalog/Human/${val}`, "_self");
                }
              }}
            >
              Search
            </Button>
            <Typography variant="body2" sx={{ mt: 0 }}>
              Examples: cca[cg]cag[ag]gggcgc or ccascagrgggcgc
            </Typography>
          </StyledBox>

          <Typography variant="h6" gutterBottom color="primary">
            You could also upload MEME files here
          </Typography>

          {/* Error Message if wrong files are uploaded */}
          <ErrorMessage files={errorFiles.map((file) => ({ file }))} />

          <UploadBox
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{ backgroundColor: isDragging ? "#e0d4f7" : "#F3E8FF" }}
          >
            <DriveFolderUploadIcon fontSize="large" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Drag and drop MEME files here
              <br />
              or
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <input
                type="file"
                id="file-input"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    padding: "8px 16px",
                    backgroundColor: "#8169BF",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: "medium",
                    color: "#FFFFFF",
                    "&:focus, &:hover, &:active": {
                      backgroundColor: "#7151A1",
                    },
                  }}
                >
                  Browse Computer
                </Button>
              </label>
            </Box>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </UploadBox>

          {/* Upload Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 6 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
              }}
              onClick={handleFileUpload}
              disabled={!selectedFile}
            >
              Upload File
            </Button>
          </Box>
        </Box>
      )}

      {value === 1 && (
        <MotifUMAP key="meme" title="meme" url="/human-meme-umap.json.gz" />
      )}

      {value === 2 && (
        <MotifUMAP key="selex" title="selex" url="/ht-selex-umap.json.gz" />
      )}

      {value === 3 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: isMobile ? "90%" : "800px" }}>
          <Grid2 container spacing={4}>
            <Grid2 xs={12} sm={6}>
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
            <Grid2 xs={12} sm={6}>
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

export default MotifsCatalogPage;
