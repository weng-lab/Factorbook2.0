import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ApiContext } from "@/ApiContext";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Card,
} from "@mui/material";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import {
  SummaryProps,
  CellTypeDescription,
  DatasetQueryResponse,
  FactorRow,
} from "./types";
import { CELLTYPE_DESCRIPTION_QUERY, DATASET_QUERY } from "./Queries";

const Summary: React.FC<SummaryProps> = ({ assembly, species, celltype }) => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    return <div>Error: ApiContext is not provided</div>;
  }

  const { client } = apiContext;

  const [rows, setRows] = useState<FactorRow[]>([]);

  const {
    data: ctData,
    loading: ctLoading,
    error: ctError,
  } = useQuery<{ celltype: CellTypeDescription[] }>(
    CELLTYPE_DESCRIPTION_QUERY,
    {
      client,
      variables: {
        assembly,
        name: [celltype],
      },
    }
  );

  const { data, loading, error } = useQuery<DatasetQueryResponse>(
    DATASET_QUERY,
    {
      client,
      variables: {
        processed_assembly: assembly,
        biosample: celltype,
        replicated_peaks: true,
        include_investigatedas: [
          "cofactor",
          "chromatin remodeler",
          "RNA polymerase complex",
          "DNA replication",
          "DNA repair",
          "cohesin",
          "transcription factor",
        ],
        exclude_investigatedas: ["recombinant protein"],
      },
    }
  );

  useEffect(() => {
    if (data && ctData) {
      const combinedData: FactorRow[] = data.peakDataset.partitionByTarget.map(
        (target) => {
          const cellTypeDesc = ctData.celltype[0];
          const description =
            cellTypeDesc?.wiki_desc?.split(".")[0] ||
            "Description not available.";

          return {
            name: target.target.name,
            experiments: target.counts.total,
            cellTypes: target.counts.biosamples,
            description: description + ".",
          };
        }
      );

      setRows(combinedData);
    }
  }, [data, ctData]);

  if (loading || ctLoading) return <CircularProgress />;
  if (error || ctError)
    return <div>Error: {error?.message || ctError?.message}</div>;

  const columns: DataTableColumn<FactorRow>[] = [
    {
      header: "Name",
      value: (row: FactorRow) => row.name,
      sort: (a, b) => a.name.localeCompare(b.name),
    },
    {
      header: "Experiments",
      value: (row: FactorRow) => row.experiments,
      sort: (a, b) => a.experiments - b.experiments,
    },
    {
      header: "Cell Types",
      value: (row: FactorRow) => row.cellTypes,
      sort: (a, b) => a.cellTypes - b.cellTypes,
    },
    {
      header: "Description",
      value: (row: FactorRow) => row.description,
      render: (row: FactorRow) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          style={{ flex: 1 }}
        >
          <Typography variant="body2">{row.description}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      <Card>
        {ctData && ctData.celltype[0] && (
          <Box p={2}>
            <Typography variant="h6">Wikipedia</Typography>
            <Typography>{ctData.celltype[0].wiki_desc}</Typography>
          </Box>
        )}
      </Card>
      <DataTable
        columns={columns}
        rows={rows}
        itemsPerPage={5}
        sortColumn={1}
        searchable={true}
      />
    </Container>
  );
};

export default Summary;
