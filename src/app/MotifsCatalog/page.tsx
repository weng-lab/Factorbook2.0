"use client";

import * as React from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";
import Searchbar from "@/components/Searchbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// Custom styled box for file upload
const UploadBox = styled(Box)({
  border: "2px dashed #8169BF",
  borderRadius: "8px",
  backgroundColor: "#F3E8FF",
  padding: "32px",
  textAlign: "center",
  color: "#5A5A5A",
  marginTop: "20px",
  position: "relative",
});

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

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

const MotifsSiteCatlog = () => {
  const [value, setValue] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // AKKI TODO Handle file upload logic here
      console.log("Uploading file:", selectedFile.name);
    }
  };

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
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const motifsContent = `
  Sequence motifs of transcription factors (TFs) are logos, matrices, or more complex mathematical models of specific, short DNA sequences that TFs recognize and bind to, effectively serving as molecular addresses that guide these regulatory proteins to their target sites in the genome. 
  These motif sites, typically ranging from 6 to 20 base pairs, are essential for the precise regulation of gene expression. The binding of a TF to its motif sites can either activate or repress the transcription of adjacent genes, depending on the nature of the TF and the context of the site.
  The diversity and specificity of these motifs underlie the complexity of gene regulation, with different TFs having distinct motifs that correspond to their unique roles in cellular processes.
  `;

  return (
    <>
      <TranscriptionFactors
        header="Motifs Site Catlog"
        content={motifsContent}
        image="/IllustrationsNew.png"
      />
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
          <Tab label="MEME Motif UMAP" />
          <Tab label="HT SELEX Motif UMAP" />
          <Tab label="Motif Search" />
          <Tab label="Downloads" />
        </Tabs>
      </Box>
      {value === 2 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <Typography variant="h6" gutterBottom>
            Enter a consensus sequence or regex:
          </Typography>
          <StyledBox>
            <Searchbar placeholder="" helperText="" />
            <Typography variant="body2" sx={{ mt: -2 }}>
              Examples: cca[cg]cag[ag]gggcgc or ccascagrgggcgc
            </Typography>
          </StyledBox>
          <Typography variant="h6" gutterBottom color="primary">
            You could also upload MEME files here
          </Typography>
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
                    display: "block",
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                margin: "auto",
                backgroundColor: "#8169BF",
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: "#8169BF",
                },
              }}
              onClick={handleFileUpload}
              disabled={!selectedFile}
            >
              Upload File
            </Button>
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
              <CustomButton variant="contained" startIcon={<SaveAltIcon />}>
                Download motifs in MEME Format
              </CustomButton>
              <CustomButton variant="contained" startIcon={<SaveAltIcon />}>
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
              <CustomButton variant="contained" startIcon={<SaveAltIcon />}>
                Download motifs in MEME Format
              </CustomButton>
            </Grid2>
          </Grid2>
        </Box>
      )}
    </>
  );
};

export default MotifsSiteCatlog;
