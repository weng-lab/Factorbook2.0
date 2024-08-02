import React from "react";
import { Button } from "@mui/material";

interface Props {
  onDownload: () => void;
}

const DownloadMemeOccurrences: React.FC<Props> = ({ onDownload }) => {
  return <Button onClick={onDownload}>Download MEME Occurrences</Button>;
};

export default DownloadMemeOccurrences;
