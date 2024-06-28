"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
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
import { inflate } from "pako";
import { associateBy } from "queryz";

interface FactorRow {
  image?: string;
  label?: string;
  name: string;
  experiments: number;
  cellTypes: number;
  description: string;
}

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

const TfDetails: React.FC<{ species: string }> = ({ species }) => {
  const [rows, setRows] = useState<FactorRow[]>([]);

  const assembly = species === "Human" ? "GRCh38" : "mm10";

  const [loading, setLoading] = useState(false);
  const [tfA, setTFA] = useState<Map<string, any> | null>(null);

  useEffect(() => {
    if (!loading) {
      fetch("/tf-assignments.json.gz")
        .then((x) => x.blob())
        .then((x) => x.arrayBuffer())
        .then((x) => inflate(x, { to: "string" }))
        .then((x) =>
          setTFA(
            associateBy(
              JSON.parse(x),
              (x: any) => x["HGNC symbol"],
              (x: any) => x
            )
          )
        );
      setLoading(true);
    }
  }, [loading]);

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
  });

  const {
    data: factorData,
    loading: factorLoading,
    error: factorError,
  } = useQuery<FactorQueryResponse>(FACTOR_DESCRIPTION_QUERY, {
    variables: {
      assembly,
      name: tfData
        ? tfData.peakDataset.partitionByTarget.map(
            (target) => target.target.name
          )
        : [],
    },
    skip: !tfData,
  });

  useEffect(() => {
    if (tfData && factorData && tfA) {
      const factorDescriptions: FactorRow[] =
        tfData.peakDataset.partitionByTarget.map((target) => {
          const factor = factorData.factor.find(
            (factor) => factor.name === target.target.name
          );

          const image = getRCSBImageUrl(factor?.pdbids);

          const tfAssignment = tfA.get(target.target.name.split("phospho")[0]);

          const description =
            factor?.factor_wiki?.split(".")[0] || "Description not available.";

          return {
            image: image,
            label:
              tfAssignment === undefined
                ? ""
                : (tfAssignment["TF assessment"] as string).includes("Likely")
                ? "Likely sequence-specific TF - "
                : SEQUENCE_SPECIFIC.has(tfAssignment["TF assessment"])
                ? "Sequence-specific TF - "
                : "Non-sequence-specific factor - ",
            name: target.target.name,
            experiments: target.counts.total,
            cellTypes: target.counts.biosamples,
            description: description + ".",
          };
        });

      setRows(factorDescriptions);
    }
  }, [tfData, factorData, tfA]);

  if (tfLoading || factorLoading) return <CircularProgress />;
  if (tfError || factorError)
    return <p>Error: {tfError?.message || factorError?.message}</p>;

  const columns: DataTableColumn<FactorRow>[] = [
    {
      header: "Image",
      render: (row: FactorRow) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            style={{
              display: "block",
              minWidth: "250px",
              height: "250px",
              padding: "10px",
            }}
          />
        ) : (
          ""
        ),
      value: (row: FactorRow) => row.image || "",
    },
    {
      header: "Details",
      render: (row: FactorRow) => (
        <Box style={{ minWidth: "150px" }}>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {row.name}
          </Typography>
          <Typography>
            {row.label ? (
              <>
                {row.label.replace(/ -/g, "")}
                <br />
              </>
            ) : (
              ""
            )}
          </Typography>
          <Typography>{row.experiments} Experiments</Typography>
          <Typography>{row.cellTypes} Cell Types</Typography>
        </Box>
      ),
      value: (row: FactorRow) =>
        `${row.name}, ${row.label || ""}, ${row.experiments} Experiments, ${
          row.cellTypes
        } Cell Types`,
      sort: (a: FactorRow, b: FactorRow) => a.cellTypes - b.cellTypes,
    },
    {
      header: "Description",
      render: (row: FactorRow) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          style={{ flex: 1 }}
        >
          <Typography variant="body2">{row.description}</Typography>
          <IconButton onClick={() => downloadData(row)} aria-label="download">
            <SaveAltIcon />
          </IconButton>
        </Box>
      ),
      value: (row: FactorRow) => row.description,
    },
  ];

  const downloadData = (row: FactorRow) => {
    const tsvData = [
      "image\tlabel\tname\texperiments\tcellTypes\tdescription",
      `${row.image || ""}\t${row.label || ""}\t${row.name}\t${
        row.experiments
      }\t${row.cellTypes}\t${row.description}`,
    ].join("\n");
    const dataStr = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(
      tsvData
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${row.name}.tsv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" mb={2}></Box>
      <Box style={{ overflowX: "auto" }}>
        <DataTable
          columns={columns}
          rows={rows}
          itemsPerPage={5}
          sortColumn={1}
          searchable={true}
        />
      </Box>
    </Container>
  );
};

export default TfDetails;
