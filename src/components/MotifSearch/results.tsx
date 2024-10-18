import React, { useContext } from "react";
import { RawLogo, DNAAlphabet } from "logojs-react";
import Link from "next/link";
import { TOMTOMMessage } from "../motifmeme/tomtommessage";
import { ApiContext } from "@/apicontext";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Grid, Divider, useMediaQuery, useTheme } from "@mui/material";
import { MotifResultProps } from "./types";

// Set custom DNA alphabet colors
DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

export const DATASET_QUERY = gql`
  query Experiment($peak_accession: String) {
    peakDataset(replicated_peak_accession: $peak_accession) {
      datasets {
        accession
        lab {
          friendly_name
        }
        target
        biosample
      }
    }
  }
`;

const MotifResult: React.FC<MotifResultProps> = ({
  peak_accession,
  query,
  alignment,
  tomtom_match,
}) => {
  const client = useContext(ApiContext)!!.client;
  const { data } = useQuery(DATASET_QUERY, {
    client,
    variables: {
      peak_accession,
    },
  });

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
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      direction={isMobile ? "column" : "row"}
    >
      {/* SVG Visualization */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          textAlign: isMobile ? "center" : "left",
        }}
      >
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
      </Grid>

      {/* Dataset information */}
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {data?.peakDataset?.datasets?.[0] && (
          <>
            <Link
              style={{ color: "#8169BF" }}
              rel="noopener noreferrer"
              target="_blank"
              href={`/transcriptionfactor/human/${data.peakDataset.datasets[0].target.toLowerCase()}/function`}
            >
              <strong>{data.peakDataset.datasets[0].target}</strong>
            </Link>{" "}
            in{" "}
            <Link
              style={{ color: "#8169BF" }}
              rel="noopener noreferrer"
              target="_blank"
              href={`/celltype/human/${data.peakDataset.datasets[0].biosample.toLowerCase()}`}
            >
              <strong>{data.peakDataset.datasets[0].biosample}</strong>
            </Link>
            <br />
            {data.peakDataset.datasets[0].lab.friendly_name.split(" ")[1]} lab
            <br />
            <Link
              style={{ color: "#8169BF" }}
              rel="noopener noreferrer"
              target="_blank"
              href={`/experiment/${data.peakDataset.datasets[0].accession.toLowerCase()}`}
            >
              {data.peakDataset.datasets[0].accession}
            </Link>
          </>
        )}
      </Grid>

      {/* TOMTOM Match information */}
      <Grid item xs={12} md={4}>
        <TOMTOMMessage tomtomMatch={tomtom_match} />
      </Grid>
    </Grid>
  );
};

export default MotifResult;
