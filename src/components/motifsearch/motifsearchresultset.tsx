import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiContext } from "@/apicontext";
import { useLazyQuery, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Divider, Box, useMediaQuery, useTheme } from "@mui/material";
import { MotifInfo, MotifMatch, MotifResult } from "./results";
import { logLikelihood } from "./motifutil";
import { MotifTableRow } from "./types";
import MotifTable from "./motifsearchtable";

const MOTIFS_PER_PAGE = 5;

export const reverseComplement = (ppm: number[][]): number[][] =>
  ppm && ppm[0] && ppm[0].length === 4
    ? ppm.map((inner) => inner.slice().reverse()).reverse()
    : ppm
      .map((entry) => [
        entry[3],
        entry[2],
        entry[1],
        entry[0],
        entry[5],
        entry[4],
      ])
      .reverse();

export const MOTIF_SEARCH_QUERY = gql`
  query MemeMotifSearch(
    $assembly: String!
    $pwms: [[[Float!]]]!
    $limit: Int!
    $offset: Int!
  ) {
    meme_motif_search(
      pwms: $pwms
      assembly: $assembly
      limit: $limit
      offset: $offset
    ) {
      results {
        motif {
          pwm
          peaks_accession
          tomtom_matches {
            target_id
            jaspar_name
            e_value
          }
        }
        distance
        offset
        reverseComplement
      }
      total
    }
  }
`;

export const DATASET_QUERY = gql`
  query Experiment1($peak_accession: String) {
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

export const MotifSearchResultSet: React.FC<{
  assembly: string;
  pwm: number[][];
  offset?: number;
  onResultsLoaded?: (n: number) => void;
}> = ({ assembly, pwm, offset, onResultsLoaded }) => {
  const client = useContext(ApiContext)!!.client;
  const { data, loading } = useQuery<any>(MOTIF_SEARCH_QUERY, {
    client,
    variables: {
      assembly,
      pwms: [pwm],
      offset: (offset || 0) * MOTIFS_PER_PAGE,
      limit: MOTIFS_PER_PAGE,
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const motifResults = data?.meme_motif_search[0]?.results || [];
  const [fetchDataset] = useLazyQuery(DATASET_QUERY)
  const [datasetMapState, setDatasetMapState] = useState<Record<string, { lab: any; target: string; biosample: string; accession: string }>>({});

  useEffect(() => {
    if (data && onResultsLoaded) {
      onResultsLoaded(data.meme_motif_search[0].total);
    }
  }, [data, onResultsLoaded]);

  useEffect(() => {
    motifResults.forEach((m: any) => {
      if (!datasetMapState[m.motif.peaks_accession]) {
        fetchDataset({
          variables: { peak_accession: m.motif.peaks_accession },
        }).then((result) => {
          if (result.data?.peakDataset?.datasets?.length) {
            const dataset = result.data.peakDataset.datasets[0];
            setDatasetMapState((prevMap) => ({
              ...prevMap,
              [m.motif.peaks_accession]: {
                lab: dataset.lab,
                target: dataset.target,
                biosample: dataset.biosample,
                accession: dataset.accession
              },
            }));
          }
        });
      }
    });
  }, [motifResults, fetchDataset]);

  const motifRows: MotifTableRow[] = useMemo(() => {
    if (!motifResults.length) return [];

    return motifResults.map((m: any, i: any) => {
      const rpwm = m.motif.pwm.map(logLikelihood([0.25, 0.25, 0.25, 0.25]));
      const alignment = {
        ...m,
        motif: {
          ...m.motif,
          pwm: m.reverseComplement ? reverseComplement(rpwm) : rpwm,
        },
      };

      const datasetInfo = datasetMapState[m.motif.peaks_accession] || {};

      return {
        distance: m.distance,
        motif: (
          <MotifResult
            key={i}
            alignment={alignment}
            query={rpwm}
          />
        ),
        info: (
          <MotifInfo
            key={i}
            target={datasetInfo.target || "N/A"}
            biosample={datasetInfo.biosample || "N/A"}
            labName={datasetInfo.lab?.friendly_name.split(" ")[1] || "N/A"}
            accession={datasetInfo.accession}
          />
        ),
        match: (
          <MotifMatch
            tomtom_match={
              m.motif.tomtom_matches
                ?.slice()
                .sort((a: any, b: any) => a.e_value - b.e_value)[0]
            }
          />
        ),
      };
    });
  }, [motifResults, datasetMapState]);

  return (
    <Box sx={{ padding: isMobile ? 2 : isTablet ? 3 : 4 }}>
      {data &&
        <MotifTable
          motifRows={motifRows}
        />
      }
    </Box>
  );
};
