"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { CELLTYPE_DESCRIPTION_QUERY, DATASET_QUERY } from "./Queries";
import { SummaryProps, CellTypeDescription } from "./types";
import CtDetails from "./CtDetails";

const includeTargetTypes = [
  "cofactor",
  "chromatin remodeler",
  "RNA polymerase complex",
  "DNA replication",
  "DNA repair",
  "cohesin",
  "transcription factor",
];
const excludeTargetTypes = ["recombinant protein"];

const ctColumns = (species: string): DataTableColumn<any>[] => [
  {
    header: "",
    value: (row) => row.biosample.name,
    render: (row) => (
      <CtDetails species={species} celltype={row.biosample.name} row={row} />
    ),
    sort: (a, b) => b.counts.targets - a.counts.targets,
  },
];

const Summary: React.FC<SummaryProps> = ({ assembly, species, celltype }) => {
  const { data: ctData, error: ctError } = useQuery<{
    celltype: CellTypeDescription[];
  }>(CELLTYPE_DESCRIPTION_QUERY, {
    variables: {
      assembly,
      name: [celltype],
    },
  });
  const celltypeDesc = ctData?.celltype[0];

  const { data, loading, error } = useQuery(DATASET_QUERY, {
    variables: {
      processed_assembly: assembly,
      biosample: celltype,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  if (loading) return <CircularProgress />;
  if (error || ctError)
    return <p>Error: {error?.message || ctError?.message}</p>;

  // Adjusted to work with the correct structure
  const rows = data?.peakDataset?.datasets ?? [];
  console.log("rows:", rows);

  if (!Array.isArray(rows)) {
    console.error("rows is not an array. Value:", rows);
    return <p>Error: Data is not in expected format.</p>;
  }

  return (
    <Container>
      <Typography variant="h4">Cell Type: {celltype}</Typography>
      {celltypeDesc?.wiki_desc && (
        <Typography>{celltypeDesc.wiki_desc}</Typography>
      )}
      <DataTable
        columns={ctColumns(species)}
        rows={rows}
        searchable
        itemsPerPage={4}
        sortColumn={0}
        sortDescending
      />
    </Container>
  );
};

export default Summary;
