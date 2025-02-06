import { Box, Typography, Button, styled, useTheme, TextField, } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { parseBedFile } from "../../regions/peaksearch";
import { GenomicRange } from "./types";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const StyledSearchBox = styled(Box)({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#EDE7F6",
    },
});
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

export default function SearchBox({ species, setRegions }: { species: string, setRegions: Dispatch<SetStateAction<GenomicRange[]>> }) {
    const [value, setValue] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const theme = useTheme();

    const handleChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setValue(event.target.value);
    };

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
    const handleFileUpload = async () => {
        if (selectedFile) {
            const parsed = await parseBedFile(selectedFile);
            setRegions(parsed);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" gutterBottom align="left" sx={{ width: "100%", maxWidth: "700px" }}>
                {`Enter genomic coordinates (${species.toLowerCase() === "human" ? "GRCh38" : "mm10"}):`}
            </Typography>
            <StyledSearchBox sx={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "700px" }}>
                <LargeTextField
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Tab" && !value) {
                            const defaultGenomicRegion = `chr2:${(100000000).toLocaleString()}-${(100101000).toLocaleString()}`;
                            setValue(defaultGenomicRegion);
                        }
                    }}
                    placeholder="Enter a genomic region"
                    onChange={handleChange}
                    id="region-input"
                    value={value}
                />
                <Button
                    variant="contained"
                    sx={{
                        margin: "0",
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
                        const chromosome = value.split(":")[0];
                        const start = +value
                            .split(":")[1]
                            .split("-")[0]
                            .replaceAll(",", "");
                        const end = +value
                            .split(":")[1]
                            .split("-")[1]
                            .replaceAll(",", "");
                        setRegions([
                            { chromosome: chromosome, start: start!!, end: end!! },
                        ]);
                        //setFileUpload(false)
                    }}
                >
                    Search
                </Button>
            </StyledSearchBox>
            <Typography variant="body2" sx={{ width: "100%", maxWidth: "700px", textAlign: "left" }}>
                example: chr2:100,000,000-100,101,000
            </Typography>
            <br />
            {(
                <>
                    <Typography variant="h6" gutterBottom align="center">
                        You could also upload .bed files here
                    </Typography>
                    <UploadBox
                        sx={{ width: "50%", mx: "auto" }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        isDragging={isDragging}
                    >
                        <DriveFolderUploadIcon fontSize="large" />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Drag and drop .bed files here
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
                            onClick={() => handleFileUpload()}
                            disabled={!selectedFile}
                        >
                            Upload File
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    )
}