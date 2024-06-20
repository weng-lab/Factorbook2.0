"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { TF_INFO_QUERY, FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { TFInfoQueryResponse } from "@/components/CellType/types";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";

interface FactorRow {
  image: string;
  name: string;
  experiments: number;
  cellTypes: number;
  description: string;
}

const TfDetails: React.FC<{ species: string }> = ({ species }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows, setRows] = useState<FactorRow[]>([]);
  const assembly = species === "human" ? "GRCh38" : "mm10";

  const {
    data: tfData,
    loading,
    error,
  } = useQuery<TFInfoQueryResponse>(TF_INFO_QUERY, {
    variables: {
      processed_assembly: assembly,
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
    fetchPolicy: "cache-first", // Use cache-first to reduce network requests
  });

  const { data: factorData } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        names: tfData?.peakDataset.partitionByTarget.map(
          (target) => target.target.name
        ),
        assembly: assembly,
      },
      skip: !tfData,
      fetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    if (tfData && factorData) {
      const factorDescriptions: FactorRow[] =
        tfData.peakDataset.partitionByTarget.map((target) => {
          const description =
            factorData.factor.find(
              (factor) => factor.name === target.target.name
            )?.factor_wiki || "Description not available.";

          return {
            image: `/path/to/${target.target.name}.png`,
            name: target.target.name,
            experiments: target.counts.total,
            cellTypes: target.counts.biosamples,
            description: description,
          };
        });
      setRows(factorDescriptions);
    }
  }, [tfData, factorData]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: DataTableColumn<FactorRow>[] = [
    {
      header: "",
      render: (row: FactorRow) => (
        <img
          src={row.image}
          alt={row.name}
          style={{ width: "100px", height: "auto" }}
        />
      ),
      value: (row: FactorRow) => "", // Dummy value to satisfy TypeScript
    },
    {
      header: "",
      render: (row: FactorRow) => (
        <Box>
          <Typography variant="h6">{row.name}</Typography>
          <Typography>Sequence specific TF</Typography>
          <Typography>{row.experiments} Experiments</Typography>
          <Typography>{row.cellTypes} Cell Types</Typography>
        </Box>
      ),
      value: (row: FactorRow) => "", // Dummy value to satisfy TypeScript
    },
    {
      header: "",
      render: (row: FactorRow) => (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">{row.description}</Typography>
          <IconButton onClick={() => downloadData(row)} aria-label="download">
            <SaveAltIcon />
          </IconButton>
        </Box>
      ),
      value: (row: FactorRow) => "", // Dummy value to satisfy TypeScript
    },
  ];

  const downloadData = (row: FactorRow) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(row)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${row.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Container>
      <TextField
        placeholder="Search"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <DataTable
        columns={columns}
        rows={filteredRows}
        itemsPerPage={5}
        dense
        showMoreColumns={false} // Disable the "show more columns" feature
      />
    </Container>
  );
};

export default TfDetails;
