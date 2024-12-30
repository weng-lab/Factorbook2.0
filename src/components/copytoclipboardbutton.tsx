import React, { useState, useCallback, CSSProperties } from "react";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import copyToClipboard from "copy-to-clipboard";

interface CopyToClipboardButtonProps {
  text?: string;
  getText?: () => string;
  style?: CSSProperties;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  text,
  getText,
  style,
}) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    const copyText = text || (getText ? getText() : "");
    if (!copyText) return;

    copyToClipboard(copyText);
    setCopied(true);

    // Reset "Copied" state after a delay
    setTimeout(() => setCopied(false), 2000);
  }, [text, getText]);

  if (!text && !getText) {
    throw new Error("One of `text` or `getText` must be specified.");
  }

  return (
    <Button
      variant="contained"
      color="primary"
      style={style}
      onClick={copy}
      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export default CopyToClipboardButton;
