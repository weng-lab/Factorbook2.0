import React from "react";
import { RawLogo, DNAAlphabet } from "logojs-react";
import Link from "next/link";
import { TOMTOMMessage } from "../motifmeme/tomtommessage";
import { Box, useMediaQuery, useTheme, Link as MuiLink } from "@mui/material";
import { MotifInfoProps, MotifMatchProps, MotifResultProps } from "./types";
import { MemeMotif } from "@/types/graphql";

// Set custom DNA alphabet colors
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

export const MotifResult: React.FC<MotifResultProps> = ({
  query,
  alignment,
}) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate overlap and offsets
  const offset = distance(query, alignment.motif!.pwm).offset;
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
    <Box width={"100%"} height={"100%"} minWidth={"400px"}>
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
      <MuiLink
        component={Link}
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/tf/human/${target}/function`}
      >
        <strong>{target}</strong>
      </MuiLink>{" "}
      in{" "}
      <MuiLink
        component={Link}
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/ct/human/${biosample}`}
      >
        <strong>{biosample}</strong>
      </MuiLink>
      <br />
      {labName} lab
      <br />
      <MuiLink
        component={Link}
        style={{ color: "#8169BF" }}
        rel="noopener noreferrer"
        target="_blank"
        href={`/tf/human/${target}/motif/${accession}`}
      >
        {accession}
      </MuiLink>
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

interface MemeMotifAlignment {
  motif?: MemeMotif;
  offset: number;
  distance: number;
  reverseComplement: boolean;
}

function _distance(a: number[][], b: number[][], offset: number, cmin: number): number {
  let sum: number = 0.0;
  if (offset < 0) {
    for (let i: number = offset; i < 0; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += a[i - offset][j] * a[i - offset][j];
      if (sum > cmin) return sum;
    }
    for (let i: number = 0; i < a.length + offset; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += (a[i - offset][j] - b[i][j]) * (a[i - offset][j] - b[i][j]);
      if (sum > cmin) return sum;
    }
    for (let i: number = a.length + offset; i < b.length; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += b[i][j] * b[i][j];
      if (sum > cmin) return sum;
    }
  } else if (a.length + offset <= b.length) {
    for (let i: number = 0; i < offset; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += b[i][j] * b[i][j];
      if (sum > cmin) return sum;
    }
    for (let i: number = 0; i < a.length; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += (a[i][j] - b[i + offset][j]) * (a[i][j] - b[i + offset][j]);
      if (sum > cmin) return sum;
    }
    for (let i: number = a.length + offset; i < b.length; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += b[i][j] * b[i][j];
      if (sum > cmin) return sum;
    }
  } else {
    for (let i: number = 0; i < offset; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += b[i][j] * b[i][j];
      if (sum > cmin) return sum;
    }
    for (let i: number = offset; i < b.length; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += (a[i - offset][j] - b[i][j]) * (a[i - offset][j] - b[i][j]);
      if (sum > cmin) return sum;
    }
    for (let i: number = b.length; i < offset + a.length; ++i) {
      for (let j: number = 0; j < 4; ++j) sum += a[i - offset][j] * a[i - offset][j];
      if (sum > cmin) return sum;
    }
  }
  return sum;
}

function distance(a: number[][], b: number[][]): MemeMotifAlignment {
  const aShorter: boolean = a.length < b.length;
  const shorter: number[][] = aShorter ? a : b;
  const longer: number[][] = aShorter ? b : a;
  // reverse complement shorter
  const shorterRC = shorter.map((_, i: number): number[] => {
    const idx = shorter.length - i - 1;
    return [shorter[idx][3], shorter[idx][2], shorter[idx][1], shorter[idx][0]];
  });
  // start where shorter completely overlaps, which is more likely to be optimal
  let min: number = _distance(shorter, longer, -shorter.length + 1, Infinity);
  let offset: number = -shorter.length + 1;
  let reverseComplement: boolean = false;
  for (let i = 0; i < longer.length; ++i) {
    let d: number = _distance(shorter, longer, i, min);
    if (d < min) {
      min = d;
      offset = i;
      reverseComplement = false;
    }
    d = _distance(shorterRC, longer, i, min);
    if (d < min) {
      min = d;
      offset = i;
      reverseComplement = true;
    }
  }
  // try offsets less than 0
  for (let i = -shorter.length + 1; i < 0; ++i) {
    let d: number = _distance(shorter, longer, i, min);
    if (d < min) {
      min = d;
      offset = i;
      reverseComplement = false;
    }
    d = _distance(shorterRC, longer, i, min);
    if (d < min) {
      min = d;
      offset = i;
      reverseComplement = true;
    }
  }
  return {
    distance: Math.sqrt(min),
    offset: aShorter ? offset : -offset,
    reverseComplement,
  };
}
