import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  FACTOR_DESCRIPTION_QUERY,
  DATASETS_QUERY,
} from "@/components/tf/query";
import {
  FactorQueryResponse,
  DatasetQueryResponse,
  FunctionPageProps,
} from "@/components/celltype/types";
import { getRCSBImageUrl } from "@/components/tf/functions";
import ReferenceSection from "@/components/container";
import ContentCard from "@/components/contentcard";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import CtDetails from "@/components/celltype/ctdetails";
import { BiosamplePartitionedDatasetCollection } from "@/components/types";

/** Utility to check if a description has biological information */
const looksBiological = (value: string): boolean => {
  const v = value.toLowerCase();
  return v.includes("gene") || v.includes("protein");
};

const FunctionTab: React.FC<FunctionPageProps> = (props) => {
  const { species, factor } = useParams<{ species: string; factor: string }>();
  const [imageVisible, setImageVisible] = useState(true);

  // Define factorForUrl to be uppercase if species is human, or capitalize the first letter if species is mouse
  const factorForUrl =
    species.toLowerCase() === "human"
      ? factor.toUpperCase()
      : species.toLowerCase() === "mouse"
      ? factor.charAt(0).toUpperCase() + factor.slice(1)
      : factor;

  /** Fetching factor data */
  const {
    data: factorData,
    loading: factorLoading,
    error: factorError,
  } = useQuery<FactorQueryResponse>(FACTOR_DESCRIPTION_QUERY, {
    variables: { assembly: props.assembly, name: [props.factor] },
  });

  /** Fetching dataset data */
  const {
    data: datasetData,
    loading: datasetLoading,
    error: datasetError,
  } = useQuery<DatasetQueryResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: props.assembly,
      target: props.factor,
      replicated_peaks: true,
    },
  });

  /** Memoized derived data */
  const factorDetails = useMemo(() => factorData?.factor[0], [factorData]);
  const imageUrl = useMemo(
    () => getRCSBImageUrl(factorDetails?.pdbids),
    [factorDetails]
  );
  const experimentCount = datasetData?.peakDataset.datasets.length || 0;
  const biosampleCount =
    datasetData?.peakDataset.partitionByBiosample?.length || 0;

  /** Reference links */
  const references = useMemo(
    () => [
      {
        name: "ENCODE",
        url: `https://www.encodeproject.org/search/?searchTerm=${factorForUrl}&type=Experiment&assembly=${
          props.assembly === "GRCh38" ? "GRCh38" : "mm10"
        }&assay_title=TF+ChIP-seq&files.output_type=optimal+IDR+thresholded+peaks&files.output_type=pseudoreplicated+IDR+thresholded+peaks&status=released`,
      },
      {
        name: "Ensembl",
        url: `http://www.ensembl.org/Human/Search/Results?q=${factorForUrl}`,
      },
      {
        name: "GO",
        url: `http://amigo.geneontology.org/amigo/search/bioentity?q=${factorForUrl}`,
      },
      {
        name: "GeneCards",
        url: `http://www.genecards.org/cgi-bin/carddisp.pl?gene=${factorForUrl}`,
      },
      {
        name: "HGNC",
        url: `https://genenames.org/tools/search/#!/?query=${factorForUrl}`,
      },
      {
        name: "RefSeq",
        url: `http://www.ncbi.nlm.nih.gov/nuccore/?term=${factorForUrl}+AND+${
          props.assembly.toLowerCase() !== "mm10"
            ? '"Homo sapiens"[porgn:__txid9606]'
            : '"Mus musculus"[porgn]'
        }`,
      },
      {
        name: "UniProt",
        url: `http://www.uniprot.org/uniprot/?query=${factorForUrl}`,
      },
      {
        name: "Wikipedia",
        url: `https://en.wikipedia.org/wiki/${factorForUrl}`,
      },
    ],
    [props.assembly, factorForUrl]
  );

  /** Columns for the experiment DataTable */
  const datasetColumns = (species: string): DataTableColumn<any>[] => [
    {
      header: "Experiment Accession",
      value: (row) => row.accession,
      render: (row) => (
        <a href={`/transcriptionfactor/human/${factor}/motifenrichmentmeme?experiment=${row.accession}`}>{row.accession}</a>
      ),
    },
    {
      header: "Cell Type",
      value: (row) => row.biosample,
      render: (row) => (
        <a href={`/celltype/${species}/${row.biosample}`}>{row.biosample}</a>
      ),
    },
    {
      header: "Date Released",
      value: (row) => row.released,
      render: (row) => {
        const d = new Date(row.released);
        return `${d.toLocaleString("default", {
          month: "short",
        })} ${d.getFullYear()}`;
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
        <a
          href={`https://www.encodeproject.org/files/${row.replicated_peaks[0].accession}`}
        >
          {row.replicated_peaks[0].accession}
        </a>
      ),
    },
  ];

  /** Columns for Biosamples Data Table */
  const biosampleColumns = (
    species: string
  ): DataTableColumn<BiosamplePartitionedDatasetCollection>[] => [
    {
      header: "Biosample",
      value: (row) => row.biosample.name,
      render: (row) => (
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {row.biosample.name}
          </Typography>
          {row.datasets && row.datasets.length > 0 ? (
            <Typography variant="caption">
              {`${row.datasets.length} experiments found`}
            </Typography>
          ) : (
            <Typography variant="caption">No experiments found</Typography>
          )}
        </Box>
      ),
      sort: (a, b) => b.counts.targets - a.counts.targets,
    },
    {
      header: "Wikipedia Details",
      value: (row) => row.biosample.name,
      render: (row) => (
        <CtDetails
          hideFactorCounts={true}
          row={row}
          species={species}
          celltype={row.biosample.name}
        />
      ),
    },
  ];

  /** Error or Loading State Handling */
  if (factorLoading || datasetLoading) return <CircularProgress />;
  if (factorError)
    return (
      <Alert severity="error">
        Error loading factor data: {factorError.message}
      </Alert>
    );
  if (datasetError)
    return (
      <Alert severity="error">
        Error loading datasets: {datasetError.message}
      </Alert>
    );

  /** Rendering Information Cards */
  const renderInfoCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {factorDetails?.ncbi_data && (
        <ContentCard title="NCBI" description={factorDetails.ncbi_data} />
      )}
      {factorDetails?.uniprot_data && (
        <ContentCard title="UniProt" description={factorDetails.uniprot_data} />
      )}
      {factorDetails?.factor_wiki &&
        looksBiological(factorDetails.factor_wiki) && (
          <ContentCard
            title="Wikipedia"
            description={factorDetails.factor_wiki}
          />
        )}
      {factorDetails?.hgnc_data && (
        <ContentCard
          title="HGNC"
          description={`HGNC ID: ${factorDetails.hgnc_data.hgnc_id}\nLocus Type: ${factorDetails.hgnc_data.locus_type}\nChromosomal Location: ${factorDetails.hgnc_data.location}`}
        />
      )}
      {factorDetails?.ensemble_data && (
        <ContentCard
          title="Ensembl"
          description={`Gene Type: ${factorDetails.ensemble_data.biotype}\nDescription: ${factorDetails.ensemble_data.description}`}
        />
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#494A50",
          padding: "16px",
          borderRadius: "8px",
          marginRight: "20px",
          width: "300px",
          minHeight: "calc(100vh - 80px)",
          position: "sticky",
          top: "0",
          height: "fit-content",
        }}
      >
        <Typography variant="h4" sx={{ color: "white", marginBottom: "20px" }}>
          {factorForUrl}
        </Typography>
        {imageVisible && imageUrl && (
          <Box position="relative" mb={2}>
            <img
              src={imageUrl}
              alt={factorDetails?.name}
              style={{ width: "200px", borderRadius: "15px" }}
            />
            <IconButton
              onClick={() => setImageVisible(!imageVisible)}
              sx={{
                position: "absolute",
                top: "0",
                right: "-40px",
                color: "white",
              }}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        )}
        {!imageVisible && (
          <IconButton
            onClick={() => setImageVisible(!imageVisible)}
            sx={{ color: "white" }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        )}
        <ReferenceSection title="References" sources={references} />
      </Box>

      <Box sx={{ flex: 1 }}>
        {renderInfoCards()}
        <Box mt={2}>
          {datasetData && (
            <DataTable
              tableTitle={`${experimentCount} experiments performed`}
              columns={datasetColumns(species)}
              rows={datasetData.peakDataset.datasets}
              searchable
              itemsPerPage={5}
              sortColumn={2}
              sortDescending
              headerColor={{
                backgroundColor: "#7151A1",
                textColor: "#EDE7F6",
              }}
            />
          )}
        </Box>
        <Box mt={2}>
          {datasetData?.peakDataset.partitionByBiosample && (
            <DataTable
              tableTitle={`${biosampleCount} biosamples profiled`}
              downloadFileName={`${factor}_profiled_biosamples.tsv`}
              columns={biosampleColumns(species)}
              rows={datasetData.peakDataset.partitionByBiosample}
              searchable
              sortDescending
              itemsPerPage={5}
              headerColor={{
                backgroundColor: "#7151A1",
                textColor: "#EDE7F6",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FunctionTab;
