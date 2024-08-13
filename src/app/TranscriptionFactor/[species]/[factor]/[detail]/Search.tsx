"use client";

import React, { useState } from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Searchbar from "@/components/Searchbar";
import { useParams } from "next/navigation";

const StyledBox = styled(Box)({
  padding: "16px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  marginTop: "16px",
});

const UploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>(({ isDragging }) => ({
  padding: "16px",
  border: "2px dashed #ccc",
  borderRadius: "8px",
  backgroundColor: isDragging ? "#e0d4f7" : "#F3E8FF",
  textAlign: "center",
  marginTop: "16px",
}));

const Search: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // TODO [Akshay] Implement file upload logic here
      console.log("Uploading file:", selectedFile);
    }
  };

  const { factor } = useParams<{
    factor: string;
  }>();

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        mt: 4,
        mx: "auto",
        maxWidth: "800px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Searching ENCODE ChIP-seq peaks for {factor}
      </Typography>
      <StyledBox>
        <Searchbar placeholder="" helperText="" />
        <Typography variant="body2" sx={{ mt: -2 }}>
          Example: chr1:10000000-10100000
        </Typography>
      </StyledBox>
      <Typography variant="h6" gutterBottom>
        You could also upload MEME files here
      </Typography>
      <UploadBox
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isDragging={isDragging}
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
  );
};

export default Search;
