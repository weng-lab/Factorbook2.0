import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Stack,
  useTheme,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery
} from "@mui/material";
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
import Link from "next/link";
import { ExpandMore } from "@mui/icons-material";

/** Utility to check if a description has biological information */
const looksBiological = (value: string): boolean => {
  const v = value.toLowerCase();
  return v.includes("gene") || v.includes("protein");
};

const FunctionTab: React.FC<FunctionPageProps> = (props) => {
  const { species, factor } = useParams<{ species: string; factor: string }>();

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  const referenceLinks = useMemo(() => {
    return (
      {
        ENCODE: `https://www.encodeproject.org/search/?searchTerm=${factorForUrl}&type=Experiment&assembly=${props.assembly}&assay_title=TF+ChIP-seq&files.output_type=optimal+IDR+thresholded+peaks&files.output_type=pseudoreplicated+IDR+thresholded+peaks&status=released`,
        Ensembl: `http://www.ensembl.org/Human/Search/Results?q=${factorForUrl}`,
        GO: `http://amigo.geneontology.org/amigo/search/bioentity?q=${factorForUrl}`,
        GeneCards: `http://www.genecards.org/cgi-bin/carddisp.pl?gene=${factorForUrl}`,
        HGNC: `https://genenames.org/tools/search/#!/?query=${factorForUrl}`,
        RefSeq: `http://www.ncbi.nlm.nih.gov/nuccore/?term=${factorForUrl}+AND+${props.assembly.toLowerCase() !== "mm10" ? '"Homo sapiens"[porgn:__txid9606]' : '"Mus musculus"[porgn]'}`,
        UniProt: `http://www.uniprot.org/uniprot/?query=${factorForUrl}`,
        Wikipedia: `https://en.wikipedia.org/wiki/${factorForUrl}`,
        NCBI: `https://www.ncbi.nlm.nih.gov/search/all/?term=${factorForUrl}`
      }
    )
  }, [factorForUrl]) 

  /** Columns for the experiment DataTable */
  const datasetColumns = (species: string): DataTableColumn<any>[] => [
    {
      header: "Experiment Accession",
      value: (row) => row.accession,
      render: (row) => (
        <MuiLink
          component={Link}
          color={"black"}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
          href={`/tf/human/${factor}/motif/${row.accession}`}
        >
          {row.accession}
        </MuiLink>
      ),
    },
    {
      header: "Cell Type",
      value: (row) => row.biosample,
      render: (row) => (
        <MuiLink
          component={Link}
          color={"black"}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
          href={`/ct/${species}/${row.biosample}`}
        >
          {row.biosample}
        </MuiLink>
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
        <MuiLink
          component={Link}
          color={"black"}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.encodeproject.org/files/${row.replicated_peaks[0].accession}`}
        >
          {row.replicated_peaks[0].accession}
        </MuiLink>
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
          <MuiLink
            component={Link}
            href={`/ct/${species}/${row.biosample.name}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color={"black"}
            variant="body1"
            display="block"
          >
            <b>{row.biosample.name}</b>
          </MuiLink>
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

  const InfoCards = () => (
    <>
      {factorDetails?.ncbi_data && (
        <ContentCard
          title="NCBI"
          titleLink={referenceLinks.NCBI}
          description={factorDetails.ncbi_data}
        />
      )}
      {factorDetails?.uniprot_data && (
        <ContentCard
          title="UniProt"
          titleLink={referenceLinks.UniProt}
          description={factorDetails.uniprot_data}
        />
      )}
      {factorDetails?.factor_wiki &&
        looksBiological(factorDetails.factor_wiki) && (
          <ContentCard
            title="Wikipedia"
            titleLink={referenceLinks.Wikipedia}
            description={factorDetails.factor_wiki}
          />
        )}
      {factorDetails?.hgnc_data && (
        <ContentCard
          title="HGNC"
          titleLink={referenceLinks.HGNC}
          description={`HGNC ID: ${factorDetails.hgnc_data.hgnc_id}\nLocus Type: ${factorDetails.hgnc_data.locus_type}\nChromosomal Location: ${factorDetails.hgnc_data.location}`}
        />
      )}
      {factorDetails?.ensemble_data && (
        <ContentCard
          title="Ensembl"
          titleLink={referenceLinks.Ensembl}
          description={`Gene Type: ${factorDetails.ensemble_data.biotype}\nDescription: ${factorDetails.ensemble_data.description}`}
        />
      )}
    </>
  );



  return (
    <Stack
      gap={3}
      direction={isMobile ? "column" : "row"}
      color="white"
    >
      <Stack
        component={Paper}
        elevation={0}
        gap={3}
        p={3}
        sx={{
          background: "#494A50",
          width: isMobile ? "auto" : "300px",
          position: isMobile ? "inherit" : "sticky",
          top: "10px",
          height: "fit-content",
          color: "inherit"
        }}
      >
        <Typography variant="h4">
          {factorForUrl}
        </Typography>
        {imageUrl && (isMobile ?
          <div>
            <Accordion sx={{ background: "#6B6C74", color: "inherit" }}>
              <AccordionSummary expandIcon={<ExpandMore htmlColor="white" />}>
                Show Structure
              </AccordionSummary>
              <AccordionDetails>
                <img
                  src={imageUrl}
                  alt={factorDetails?.name}
                  style={{ borderRadius: theme.shape.borderRadius }}
                />
              </AccordionDetails>
            </Accordion>
          </div>
          :
          <img
            src={imageUrl}
            alt={factorDetails?.name}
            style={{ borderRadius: theme.shape.borderRadius }}
          />
        )}
        <ReferenceSection title="References" sources={Object.entries(referenceLinks).map(([name, url]) => ({ name, url }))} />
      </Stack>
      <Stack flex={1} gap={3}>
          <InfoCards />
          {datasetData && (
            <DataTable
              tableTitle={`${experimentCount} Experiments`}
              columns={datasetColumns(species)}
              rows={datasetData.peakDataset.datasets}
              searchable
              itemsPerPage={5}
              sortColumn={2}
              sortDescending
              headerColor={{
                /**
                 * @todo this is dumb. When datatable types are changed for this prop, change. https://github.com/weng-lab/psychscreen-ui-components/issues/51
                 */
                backgroundColor: theme.palette.primary.main as "#",
                textColor: "#FFF",
              }}
            />
          )}
          {datasetData?.peakDataset.partitionByBiosample && (
            <DataTable
              tableTitle={`${biosampleCount} Biosamples`}
              downloadFileName={`${factor}_profiled_biosamples.tsv`}
              columns={biosampleColumns(species)}
              rows={datasetData.peakDataset.partitionByBiosample}
              searchable
              sortDescending
              itemsPerPage={5}
              headerColor={{
                backgroundColor: "#7151A1",
                textColor: "#FFF",
              }}
            />
          )}
      </Stack>
    </Stack>
  );
};

export default FunctionTab;
