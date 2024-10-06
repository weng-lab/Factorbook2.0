import React, { useContext } from "react";
import { RawLogo, DNAAlphabet } from "logojs-react";
import Link from "next/link";
import { TOMTOMMessage } from "../MotifMeme/TOMTOMMessage";
import { ApiContext } from "../../ApiContext";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Grid, Divider } from "@mui/material";
import { MotifResultProps } from "./types";

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
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <svg
          style={{ width: "75%" }}
          viewBox={`0 0 ${totalLength * 75 + 300} 580`}
        >
          <g transform="translate(0,445)">
            <text fontSize="60px">Query</text>
          </g>
          <g transform={`translate(${offset <= 0 ? 0 : 75 * offset},320)`}>
            <g transform="translate(300)">
              <RawLogo
                values={query}
                glyphWidth={75}
                stackHeight={200}
                alphabet={DNAAlphabet}
              />
            </g>
          </g>
          <g transform={`translate(${offset < 0 ? -offset * 75 : 0},0)`}>
            <g transform="translate(300)">
              <RawLogo
                values={alignment.motif.pwm}
                glyphWidth={75}
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
      <Grid item xs={3}>
        {data?.peakDataset?.datasets?.[0] && (
          <>
            <Link
              style={{ color: "#8169BF" }}
              rel="noopener noreferrer"
              target="_blank"
              href={`/TranscriptionFactor/human/${data.peakDataset.datasets[0].target}/function`}
            >
              <strong>{data.peakDataset.datasets[0].target}</strong>
            </Link>{" "}
            in{" "}
            <Link
              style={{ color: "#8169BF" }}
              rel="noopener noreferrer"
              target="_blank"
              href={`/CellType/human/${data.peakDataset.datasets[0].biosample}`}
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
              href={`/experiment/${data.peakDataset.datasets[0].accession}`}
            >
              {data.peakDataset.datasets[0].accession}
            </Link>
          </>
        )}
      </Grid>
      <Grid item xs={4}>
        <TOMTOMMessage tomtomMatch={tomtom_match} />
      </Grid>
    </Grid>
  );
};
export default MotifResult;
