import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { ApiContext } from "@/ApiContext";
import {
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container,
  Box,
} from "@mui/material";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { includeTargetTypes, excludeTargetTypes } from "@/consts";
import TfDetails from "../tf/TfDetails";
import {
  SummaryProps,
  CellTypeDescription,
  DatasetQueryResponse,
  Dataset,
  TargetPartitionedDatasetCollection,
} from "./types";
import { CELLTYPE_DESCRIPTION_QUERY, DATASET_QUERY } from "./Queries";

const Summary: React.FC<SummaryProps> = ({ assembly, species, celltype }) => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    return <div>Error: ApiContext is not provided</div>;
  }

  const { client } = apiContext;

  const { data: ctData } = useQuery<{ celltype: CellTypeDescription[] }>(
    CELLTYPE_DESCRIPTION_QUERY,
    {
      client,
      variables: {
        assembly,
        name: [celltype],
      },
    }
  );

  const celltypeDesc = ctData?.celltype[0];

  const { data, loading, error } = useQuery<DatasetQueryResponse>(
    DATASET_QUERY,
    {
      client,
      variables: {
        processed_assembly: assembly,
        biosample: celltype,
        replicated_peaks: true,
        include_investigatedas: includeTargetTypes,
        exclude_investigatedas: excludeTargetTypes,
      },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const datasetColumns: DataTableColumn<Dataset>[] = [
    {
      header: "Lab Name",
      value: (row) => row.lab.friendly_name,
      sort: (a, b) => a.lab.friendly_name.localeCompare(b.lab.friendly_name),
    },
    {
      header: "Accession",
      value: (row) => row.accession,
      sort: (a, b) => a.accession.localeCompare(b.accession),
    },
    {
      header: "Target",
      value: (row) => row.target,
      sort: (a, b) => a.target.localeCompare(b.target),
    },
    {
      header: "Replicated Peaks",
      value: (row) =>
        row.replicated_peaks.map((peak) => peak.accession).join(", "),
      sort: (a, b) => a.replicated_peaks.length - b.replicated_peaks.length,
    },
  ];

  const tfColumns: DataTableColumn<TargetPartitionedDatasetCollection>[] = [
    {
      header: "Target Name",
      value: (row) => row.target.name,
      render: (row) => (
        <TfDetails
          hideCellTypeCounts={true}
          row={row}
          species={species}
          factor={row.target.name}
        />
      ),
      sort: (a, b) => a.target.name.localeCompare(b.target.name),
    },
  ];

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {celltypeDesc && (
            <Card>
              <Typography variant="h6">Wikipedia</Typography>
              <Box p={2}>
                <Typography>{celltypeDesc.wiki_desc}</Typography>
              </Box>
            </Card>
          )}
          {data && (
            <Card>
              <Typography variant="h6">
                {data.peakDataset.counts.total} experiments performed
              </Typography>
              <DataTable
                columns={datasetColumns}
                rows={data.peakDataset.datasets}
                itemsPerPage={5}
                searchable
              />
            </Card>
          )}
          {data && (
            <Card>
              <Typography variant="h6">
                {data.peakDataset.partitionByTarget.length} factors profiled
              </Typography>
              <DataTable
                columns={tfColumns}
                rows={data.peakDataset.partitionByTarget}
                itemsPerPage={4}
                searchable
              />
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Summary;
