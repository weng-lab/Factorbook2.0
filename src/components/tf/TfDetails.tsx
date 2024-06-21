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
import {
  TFInfoQueryResponse,
  FactorQueryResponse,
} from "@/components/CellType/types";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import { inflate } from 'pako';
import { associateBy } from 'queryz';


interface FactorRow {
  image?: string;
  label?: string;
  name: string;
  experiments: number;
  cellTypes: number;
  description: string;
}

const SEQUENCE_SPECIFIC = new Set([ "Known motif", "Inferred motif" ]);

const TfDetails: React.FC<{ species: string }> = ({ species }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows, setRows] = useState<FactorRow[]>([]);
  const assembly = species === "human" ? "GRCh38" : "mm10";

  const [ lloading, setLoading ] = useState(false);
    const [ tfA, setTFA ] = useState<any | null>(null);

    useEffect( () => {
        if (!lloading) {
            fetch("/tf-assignments.json.gz")
                .then(x => x.blob())
                .then(x => x.arrayBuffer())
                .then(x => inflate(x, { to: 'string' }))
                .then(x => setTFA(associateBy(JSON.parse(x), (x: any) => (x as any)["HGNC symbol"], (x: any) => x)));
            setLoading(true);
        }
    }, [ lloading ]);

  
  const {
    data: tfData,
    loading: tfLoading,
    error: tfError,
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
    fetchPolicy: "cache-first",
  });

  const {
    data: factorData,
    loading: factorLoading,
    error: factorError,
  } = useQuery<FactorQueryResponse>(FACTOR_DESCRIPTION_QUERY, {
    variables: {
      names: tfData?.peakDataset.partitionByTarget.map(
        (target) => target.target.name
      ),
      assembly,
    },
    skip: !tfData,
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (tfData && factorData) {
      const factorDescriptions: FactorRow[] =
        tfData.peakDataset.partitionByTarget.map((target) => {
          const factor = factorData.factor.find(
            (factor) => factor.name === target.target.name
          );

          const image = getRCSBImageUrl(factor?.pdbids);

          return {
            image: image,
            label: (tfA === undefined || tfA.get(target.target.name.split("phospho")[0]) === undefined ? "" : (tfA.get(target.target.name.split("phospho")[0])["TF assessment"] as unknown as string).includes("Likely") ? "Likely sequence-specific TF - " : (SEQUENCE_SPECIFIC.has(tfA.get(target.target.name.split("phospho")[0])["TF assessment"]) ? "Sequence-specific TF - " : "Non-sequence-specific factor - ")),
            name: target.target.name,
            experiments: target.counts.total,
            cellTypes: target.counts.biosamples,
            description: factor?.factor_wiki || "Description not available.",
          };
        });

      // Sort rows by the number of cell types in descending order
      factorDescriptions.sort((a, b) => b.cellTypes - a.cellTypes);
      setRows(factorDescriptions);
    }
  }, [tfData, factorData]);

  if (tfLoading || factorLoading) return <CircularProgress />;
  if (tfError || factorError)
    return <p>Error: {tfError?.message || factorError?.message}</p>;

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: DataTableColumn<FactorRow>[] = [
    {
      header: "",
      render: (row: FactorRow) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            style={{
              display: "flex",
              width: "250px",
              padding: "25px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
              flexShrink: 0,
            }}
          />
        ) : (
          ""
        ),
      value: (row: FactorRow) => "", // Dummy value to satisfy TypeScript
    },
    {
      header: "",
      render: (row: FactorRow) => (
        <Box>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {row.name}
          </Typography>
          <Typography>{row.label ? <>{row.label.replace(/ -/g, "")}<br /></> : ""}</Typography>
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
        showMoreColumns={false}
      />
    </Container>
  );
};

export default TfDetails;
