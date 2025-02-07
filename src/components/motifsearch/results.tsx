import React from "react";
import { RawLogo, DNAAlphabet } from "logojs-react";
import Link from "next/link";
import { TOMTOMMessage } from "../motifmeme/tomtommessage";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { MotifInfoProps, MotifMatchProps, MotifResultProps } from "./types";

// Set custom DNA alphabet colors
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

export const MotifResult: React.FC<MotifResultProps> = ({
  query,
  alignment,
}) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Calculate overlap and offsets
  const offset = alignment.offset;
  const overlapStart = Math.min(
    offset < 0 ? query.length : query.length + offset,
    offset < 0
      ? -offset + alignment.motif.pwm.length
      : alignment.motif.pwm.length
  );
  const totalLength =
    offset < 0
      ? Math.max(query.length, alignment.motif.pwm.length - offset)
      : Math.max(alignment.motif.pwm.length, query.length + offset);

  return (
    <Box width={"100%"} height={"100%"}>
      <svg
        style={{ width: isMobile ? "100%" : "75%" }}
        viewBox={`0 0 ${totalLength * 75 + 300} 580`}
      >
        <g transform="translate(0,445)">
          <text fontSize="60px">Query</text>
        </g>
        <g transform={`translate(${offset <= 0 ? 0 : 75 * offset},320)`}>
          <g transform="translate(300)">
            <RawLogo
              values={query}
              glyphWidth={isMobile ? 50 : 75}
              stackHeight={200}
              alphabet={DNAAlphabet}
            />
          </g>
        </g>
        <g transform={`translate(${offset < 0 ? -offset * 75 : 0},0)`}>
          <g transform="translate(300)">
            <RawLogo
              values={alignment.motif.pwm}
              glyphWidth={isMobile ? 50 : 75}
              stackHeight={200}
              alphabet={DNAAlphabet}
            />
          </g>
        </g>
        <rect
          fill="#ffffff"
          fillOpacity={0.7}
          x={300}
          y={0}
          height={700}
          width={Math.abs(offset) * 75}
        />
        <rect
          fill="#ffffff"
          fillOpacity={0.7}
          x={overlapStart * 75 + 300}
          y={0}
          height={700}
          width={Math.abs(totalLength - overlapStart) * 75}
        />
      </svg>
    </Box>
  );
};

export const MotifInfo: React.FC<MotifInfoProps> = ({
  target,
  biosample,
  labName,
  accession,
}) => {
  return (
    <>
      <Link
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/tf/human/${target}/function`}
      >
        <strong>{target}</strong>
      </Link>{" "}
      in{" "}
      <Link
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/ct/human/${biosample}`}
      >
        <strong>{biosample}</strong>
      </Link>
      <br />
      {labName} lab
      <br />
      <Link
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/tf/human/${target}/motif/${accession}`}
      >
        {accession}
      </Link>
    </>
  );
};

export const MotifMatch: React.FC<MotifMatchProps> = ({
  tomtom_match,
}) => {
  return (
    <Box width={"75%"}>
      <TOMTOMMessage tomtomMatch={tomtom_match} />
    </Box>
  );
};
