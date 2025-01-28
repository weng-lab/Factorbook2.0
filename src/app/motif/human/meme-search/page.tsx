"use client";

import { Box, Typography, Button, useTheme, useMediaQuery, styled } from "@mui/material";
import ErrorMessage from "../../upload/errormessage";
import React, { useEffect } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { memeTxtToMotifs } from "./helpers";
import MotifSearchbar from "@/components/motifsearchbar";

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

const MemeSearchPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Target mobile screens

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [errorFiles, setErrorFiles] = React.useState<File[]>([]);

    useEffect(() => {
        sessionStorage.removeItem("motifSearch")
    });

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
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const fileName = selectedFile.name.replace(".meme", "").replace(/\s+/g, "");

                const motifs = memeTxtToMotifs(fileReader.result as string);

                // Store the file content and metadata in sessionStorage
                sessionStorage.setItem(
                    "motifSearch",
                    JSON.stringify({ name: fileName, motifs: motifs })
                );

                // Redirect to the new URL
                window.location.href = `/motif/human/meme-search/fileupload`;
            };

            fileReader.readAsText(selectedFile); // Read the file as text
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
        <Box
            sx={{
                mt: 4,
                mx: "auto",
                pt: 3,
                pb: 3,
                maxWidth: isMobile ? "90%" : "800px",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Enter a consensus sequence or regex:
            </Typography>
            <MotifSearchbar dark={true}/>
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
    );
};

export default MemeSearchPage;