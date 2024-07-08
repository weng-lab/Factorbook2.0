"use client";

import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import { FactorRow } from "@/components/CellType/types";

type TfDetailsProps = {
  rows: FactorRow[];
  species: string;
  hideCellTypeCounts?: boolean;
};

const TfDetails: React.FC<TfDetailsProps> = ({
  rows,
  species,
  hideCellTypeCounts,
}) => {
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
            <Link
              href={`/TranscriptionFactor/${species}/${row.name}/Function`}
              passHref
            >
              {species === "Mouse"
                ? row.name.charAt(0) + row.name.slice(1).toLowerCase()
                : row.name}
            </Link>
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
          {!hideCellTypeCounts && (
            <Typography>{row.cellTypes} Cell Types</Typography>
          )}
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
