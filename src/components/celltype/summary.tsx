import React, { useContext } from "react";
import { ApiContext } from "@/apicontext";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { SummaryProps } from "./types";

import { useTFInfo } from "./hooks";
import CtDetails from "./ctdetails";
import Link from "next/link";
import LoadingTFPortal from "@/app/tf/[species]/loading";

interface LinkWrapperProps {
  url: string;
  children: React.ReactNode;
}

const LinkWrapper: React.FC<LinkWrapperProps> = ({ url, children }) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "inherit" }}
  >
    {children}
  </Link>
);

const Summary: React.FC<SummaryProps> = ({ assembly, species }) => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    return <div>Error: ApiContext is not provided</div>;
  }

  const { data, loading, error } = useTFInfo(species);

  if (loading) return (
    <>
      {LoadingTFPortal()}
    </>
  );
  
  if (error || !data) return <div>Error: {error?.message}</div>;

  const columns: DataTableColumn<any>[] = [
    {
      header: "Cell type",
      value: (row: { biosample: { name: string } }) => row.biosample.name,
      render: (row: {
        biosample: { name: string };
        counts: { total: number; targets: number };
      }) => (
        <LinkWrapper url={`/ct/${species}/${row.biosample.name}`}>
          <Box>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {row.biosample.name}
            </Typography>
            <br />
            <Typography variant="subtitle2" noWrap>
              {`${row.counts.total} Experiments`}
            </Typography>
            <br />
            <Typography variant="subtitle2" noWrap>
              {`${row.counts.targets} Factors`}
            </Typography>
          </Box>
        </LinkWrapper>
      ),
      sort: (a: any, b: any) => a.counts.targets - b.counts.targets,
    },
    {
      header: "Description",
      value: (row: { biosample: { name: string } }) => row.biosample.name,
      render: (row: { biosample: { name: string } }) => (
        <LinkWrapper url={`/ct/${species}/${row.biosample.name}`}>
          <CtDetails species={species} celltype={row.biosample.name} />
        </LinkWrapper>
      ),
    },
  ];

  return (
    <Box style={{ overflowX: "auto" }}>
      <DataTable
        columns={columns}
        rows={data.peakDataset.partitionByBiosample}
        itemsPerPage={5}
        searchable={true}
      />
    </Box>
  );
};

export default Summary;
