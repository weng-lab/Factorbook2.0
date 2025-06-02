"use client";

import ReferenceSection from "@/components/container";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { CellTypeDescription, DatasetQueryResponse } from "./types";
import { CELLTYPE_DESCRIPTION_QUERY, DATASET_QUERY } from "./queries";
import dynamic from "next/dynamic";
import ContentCard from "@/components/contentcard";
import { Box, Typography, Card, CardContent, Link, Stack, Paper, useTheme } from "@mui/material";
const TfDetails = dynamic(() => import("@/components/tf/tfdetails"));

const includeTargetTypes = [
  "cofactor",
  "chromatin remodeler",
  "RNA polymerase complex",
  "DNA replication",
  "DNA repair",
  "cohesin",
  "transcription factor",
  "RNA binding protein"
];
import { DataTable } from "@weng-lab/psychscreen-ui-components";
const excludeTargetTypes = ["recombinant protein"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CelltypeDetailsPage = () => {
  const { species, ct } = useParams<{ species: string; ct: string }>();

  const celltype = ct.replaceAll('%20', ' ')

  const theme = useTheme()
  const references = [
    {
      name: "ENCODE",
      url: `https://www.encodeproject.org/search/?searchTerm=${ct.replace(
        /\s+/g,
        "+"
      )}&type=Experiment&assay_title=TF+ChIP-seq&status=released&files.output_type=optimal+IDR+thresholded+peaks&files.output_type=pseudoreplicated+IDR+thresholded+peaks&assembly=${
        species.toLowerCase() === "human" ? "GRCh38" : "mm10"
      }`,
    },
    {
      name: "Wikipedia",
      url: `https://en.wikipedia.org/wiki/${ct}`,
    },
  ];

  const ctData = useQuery<{ celltype: CellTypeDescription[] }>(
    CELLTYPE_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
        name: [celltype],
      },
    }
  );
  const celltypeDesc = ctData && ctData.data && ctData.data.celltype[0];

  const { data, loading } = useQuery<DatasetQueryResponse>(DATASET_QUERY, {
    variables: {
      processed_assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
      biosample: celltype,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  const renderCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {celltypeDesc && celltypeDesc.wiki_desc && (
        <ContentCard
          title="Wikipedia"
          description={celltypeDesc.wiki_desc}
          sx={{ marginBottom: 2 }}
        />
      )}
    </Box>
  );

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: theme.spacing(2),
          margin: theme.spacing(2),
          color: "white"
        }}
      >
        <Stack
          component={Paper}
          gap={theme.spacing(2)}
          p={theme.spacing(2)}
          sx={{
            background: "#494A50",
            width: "300px",
            position: "sticky",
            top: "10px",
            height: "fit-content",
            color: "inherit"
          }}
        >
          <Typography variant="h4">
            {celltype}
          </Typography>
          <ReferenceSection title="References" sources={references} />
        </Stack>
        <Box sx={{ flex: 1 }}>
          {renderCards()}
          {data && !loading && (
            <DataTable
              key="complete"
              columns={[
                {
                  header: "Experiment Accession",

                  value: (row) => row.accession,
                  render: (row) => <>{row.accession}</>,
                },

                {
                  header: "Date Released",
                  value: (row) => row.released,
                  render: (row) => {
                    const d = new Date(row.released);
                    return `${months[d.getMonth()]} ${d.getFullYear()}`;
                  },
                },
                {
                  header: "Lab",
                  value: (row) => row.lab.friendly_name,
                },
                {
                  header: "Replicated Peak File Accession",
                  value: (row) => row.replicated_peaks[0].accession,
                  render: (row) => (
                    <Link
                      style={{ color: "#8169BF" }}
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://www.encodeproject.org/files/${row.replicated_peaks[0].accession}`}
                    >
                      {row.replicated_peaks[0].accession}
                    </Link>
                  ),
                },
              ]}
              tableTitle={` ${data.peakDataset.counts.total} experiment${
                data.peakDataset.counts.total !== 1 ? "s" : ""
              } `}
              rows={data.peakDataset.datasets}
              itemsPerPage={5}
              searchable
              headerColor={{
                backgroundColor: "#7151A1",
                textColor: "#EDE7F6",
              }}
            />
          )}

          {data && !loading && (
            <TfDetails
              hideCellTypeCounts
              species={species}
              row={{
                target: {
                  name: "",
                },
                counts: {
                  total: 0,
                  biosamples: 0,
                },
                datasets: undefined,
              }}
              factor={""}
              ct={celltype}
            />
          )}
        </Box>
      </Box>
  );
};

export default CelltypeDetailsPage;
