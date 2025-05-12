import React, { useState, useEffect, ReactNode, MouseEvent } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { TF_INFO_QUERY, FACTOR_DESCRIPTION_QUERY } from "@/components/tf/query";
import {
  TFInfoQueryResponse,
  FactorQueryResponse,
  TargetPartitionedDatasetCollection,
} from "@/components/celltype/types";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { getRCSBImageUrl } from "@/components/tf/functions";
import { inflate } from "pako";
import { associateBy } from "queryz";
import Link from "next/link";
import LoadingTFPortal from "@/app/tf/[species]/loading";

interface FactorRow {
  image?: string;
  label?: string;
  name: string;
  experiments: number;
  cellTypes: number;
  description?: string;
}

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

type TfDetailsProps = {
  species: string;
  hideCellTypeCounts?: boolean;
  row: TargetPartitionedDatasetCollection;
  factor: string;
  ct?: string;
};

interface LinkWrapperProps {
  url: string;
  children: ReactNode;
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

const TfDetails: React.FC<TfDetailsProps> = ({
  species,
  hideCellTypeCounts,
  row,
  factor,
  ct,
}) => {
  const [rows, setRows] = useState<FactorRow[]>([]);

  const assembly = species === "human" ? "GRCh38" : "mm10";

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
        )
        .catch(console.error);
      setLoading(true);
    }
  }, [loading]);

  const {
    data: tfData,
    loading: tfLoading,
    error: tfError,
  } = useQuery<TFInfoQueryResponse>(TF_INFO_QUERY, {
    variables: ct
      ? {
          processed_assembly: assembly,
          replicated_peaks: true,
          biosample: ct,
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
        }
      : {
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
            (target) => target.target.name.split(/phospho/i)[0]
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
            (factor) => factor.name === target.target.name.split(/phospho/i)[0]
          );

          const image = getRCSBImageUrl(factor?.pdbids);

          const tfAssignment = tfA.get(target.target.name.split(/phospho/i)[0]);

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

  if (tfLoading || factorLoading || rows.length === 0) return (
    <>
      {LoadingTFPortal()}
    </>
  )

  if (tfError || factorError)
    return <p>Error: {tfError?.message || factorError?.message}</p>;

  const columns: DataTableColumn<FactorRow>[] = [
    {
      header: "Image",
      render: (row: FactorRow) => {
        const nameForUrl =
          species === "human"
            ? row.name //.toUpperCase()
            : species === "mouse"
            ? row.name.charAt(0).toUpperCase() + row.name.slice(1).toLowerCase()
            : row.name;

        return row.image ? (
          <LinkWrapper
            url={`/tf/${species}/${nameForUrl}/function`}
          >
            <img
              src={row.image}
              alt={row.name}
              style={{
                display: "block",
                minWidth: "250px",
                height: "250px",
                padding: "10px",
                borderRadius: "30px",
              }}
            />
          </LinkWrapper>
        ) : (
          ""
        );
      },
      value: (row: FactorRow) => row.image || "",
    },
    {
      header: "Details",
      render: (row: FactorRow) => {
        const nameForUrl =
        species === "human"
        ? row.name //.toUpperCase()
        : species === "mouse"
        ? row.name.charAt(0).toUpperCase() + row.name.slice(1).toLowerCase()
        : row.name;
        console.log("nameForUrl",species,nameForUrl)
        return (
          (<LinkWrapper
            url={`/tf/${species}/${nameForUrl}/function`}
          >
            <Box style={{ minWidth: "150px" }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {species === "mouse"
                  ? row.name.charAt(0).toUpperCase() +
                    row.name.slice(1).toLowerCase()
                  : row.name}
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
          </LinkWrapper>)
        );
      },
      value: (row: FactorRow) =>
        `${row.name}, ${row.label || ""}, ${row.experiments} Experiments, ${
          row.cellTypes
        } Cell Types`,
      sort: (a: FactorRow, b: FactorRow) => a.cellTypes - b.cellTypes,
    },
    {
      header: "Description",
      render: (row: FactorRow) => {
        const nameForUrl =
          species === "human"
            ? row.name //.toUpperCase()
            : species === "mouse"
            ? row.name.charAt(0).toUpperCase() + row.name.slice(1).toLowerCase()
            : row.name;

        return (
          <LinkWrapper
            url={`/tf/${species}/${nameForUrl}/function`}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              style={{ flex: 1 }}
            >
              <Typography variant="body2">{row.description}</Typography>
              <IconButton
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  downloadData(row);
                }}
                aria-label="download"
              >
                <SaveAltIcon />
              </IconButton>
            </Box>
          </LinkWrapper>
        );
      },
      value: (row: FactorRow) => row.description || "",
    },
  ];

  const downloadData = (row: FactorRow) => {
    const factorName =
    species === "human"
      ? row.name //.toUpperCase()
      : species === "mouse"
      ? row.name.charAt(0).toUpperCase() + row.name.slice(1).toLowerCase()
      : row.name;
    const tsvData = [
      "image\tlabel\tname\texperiments\tcellTypes\tdescription",
      `${row.image || ""}\t${row.label || ""}\t${factorName}\t${
        row.experiments
      }\t${row.cellTypes}\t${row.description}`,
    ].join("\n");
    const dataStr = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(
      tsvData
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${factorName}.tsv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  
  return (
    <Container maxWidth={false} disableGutters>
      <Box style={{ overflowX: "auto", marginTop: "20px" }}>
        <DataTable
          columns={columns}
          rows={rows}
          itemsPerPage={5}
          sortColumn={1}
          searchable={true}
          tableTitle={ct ? `${rows.length} factors` : ``}
          headerColor={
            ct
              ? {
                  backgroundColor: "#7151A1",
                  textColor: "#EDE7F6",
                }
              : {
                  backgroundColor: "#FFFFFF",
                  textColor: "#inherit",
                }
          }
        />
      </Box>
    </Container>
  );
};

export default TfDetails;
