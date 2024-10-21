import React, { useState, useCallback, CSSProperties } from "react";
import { Button, Icon } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import copyToClipboard from "copy-to-clipboard";

const CopyButton = ({
  onClick,
  style,
}: {
  onClick: () => void;
  style?: CSSProperties;
}) => (
  <Button
    variant="contained"
    color="primary"
    style={style}
    onClick={onClick}
    startIcon={<ContentCopyIcon />}
  >
    Copy
  </Button>
);

const CopiedButton = ({
  onClick,
  style,
}: {
  onClick: () => void;
  style?: CSSProperties;
}) => (
  <Button
    variant="contained"
    color="primary"
    style={style}
    onClick={onClick}
    startIcon={<CheckIcon />}
  >
    Copied
  </Button>
);

const CopyToClipboardButton: React.FC<{
  text?: string;
  getText?: () => string;
  style?: CSSProperties;
}> = ({ text, getText, style }) => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const copyText = text || getText!();
    copyToClipboard(copyText);
    setCopied(true);
  }, [text, getText]);

  if (!text && !getText) {
    throw new Error("One of `text` or `getText` must be specified.");
  }

  return copied ? (
    <CopiedButton style={style} onClick={copy} />
  ) : (
    <CopyButton style={style} onClick={copy} />
  );
};

export default CopyToClipboardButton;
