"use client";

import { Typography } from "@mui/material";
import { useParams } from "next/navigation";

const FileUploadMotifDetails = () => {
    const { filename } = useParams<{ filename: string  }>();

    return (
        <Typography>{filename}</Typography>
    );
};

export default FileUploadMotifDetails;