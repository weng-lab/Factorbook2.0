"use client";

import * as React from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TextField, useTheme } from "@mui/material";
import MotifUMAP from "@/components/MotifSearch/UMap";

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
}));

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

const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

const CustomButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "8px",
  backgroundColor: theme.palette.primary.main,
  textTransform: "none",
  "&:focus, &:hover, &:active": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const MotifsSiteCatlog = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [val, setVal] = React.useState<String | null>(null);
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
          <Tab label="Motif Search" />
          <Tab label="MEME Motif UMAP" />
          <Tab label="HT SELEX Motif UMAP" />
          <Tab label="Downloads" />
        </Tabs>
      </Box>
      {value === 1 && (
        <MotifUMAP key="meme" title="meme" url="/human-meme-umap.json.gz" />
      )}
      {value === 2 && (
        <MotifUMAP key="selex" title="selex" url="/ht-selex-umap.json.gz" />
      )}
      {value === 0 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
          <Typography variant="h6" gutterBottom>
            Enter a consensus sequence or regex:
          </Typography>
          <StyledBox>
            <LargeTextField
              placeholder="enter sequence or regex"
              onChange={(e) => {
                setVal(e.target.value);
              }}
            />{" "}
            <Button
              variant="contained"
              sx={{
                margin: "auto",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={() => {
                window.open(`/MotifsCatalog/human/${val}`, "_self");
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
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: "medium",
                    color: "#FFFFFF",
                    "&:focus, &:hover, &:active": {
                      backgroundColor: theme.palette.primary.main,
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
                backgroundColor: theme.palette.primary.main,
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "medium",
                color: "#FFFFFF",
                "&:focus, &:hover, &:active": {
                  backgroundColor: theme.palette.primary.main,
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
            <Grid2 xs={6}>
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

export default MotifsSiteCatlog;
