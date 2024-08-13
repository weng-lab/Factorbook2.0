"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Box,
} from "@mui/material";
import { DATASETS_QUERY, MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import {
  DataResponse,
  BiosamplePartition,
  Dataset,
  MotifResponse,
} from "@/components/MotifMeme/Types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

interface MotifEnrichmentMEMEProps {
  accession?: string;
  factor: string;
  species: string;
}

const MotifEnrichmentMEME: React.FC<MotifEnrichmentMEMEProps> = ({
  accession,
  factor,
  species,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAccessionClick = (accession: string) => {
    if (isMounted) {
      router.push(
        `/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME/${accession}`
      );
    }
  };

  // Query data from the server
  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: "GRCh38",
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  const [
    fetchMotifData,
    { data: motifData, loading: motifLoading, error: motifError },
  ] = useLazyQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: accession ? [accession] : [] },
  });

  useEffect(() => {
    if (accession) {
      fetchMotifData();
    }
  }, [accession, fetchMotifData]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  // Sort and filter the biosamples
  const sortedBiosamples = [
    ...(data?.peakDataset.partitionByBiosample || []),
  ].sort((a, b) => {
    if (a.biosample.name < b.biosample.name) return -1;
    if (a.biosample.name > b.biosample.name) return 1;
    return 0;
  });

  const filteredBiosamples = sortedBiosamples.filter((biosample) =>
    biosample.biosample.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex">
      <Box width="20%">
        <Box mb={2}>
          <TextField
            label="Search Biosamples"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <List>
          {filteredBiosamples.map((biosample, index) => (
            <Accordion key={index}>
              <AccordionSummary
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography style={{ fontWeight: "bold" }}>
                  {biosample.biosample.name}
                </Typography>
                <Chip
                  label={`${biosample.counts.total} exp`}
                  style={{
                    backgroundColor: "#8169BF",
                    color: "white",
                    marginLeft: "auto",
                  }}
                />
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {biosample.datasets.map((dataset: Dataset, idx: number) => (
                    <ListItem
                      key={idx}
                      style={{ paddingLeft: "30px", cursor: "pointer" }}
                      onClick={() => handleAccessionClick(dataset.accession)}
                    >
                      <ListItemText
                        primary={`${dataset.lab.friendly_name} (${dataset.accession})`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Box>
      <Box flexGrow={1} ml={2}>
        {motifLoading && <CircularProgress />}
        {motifError && <p>Error: {motifError.message}</p>}
        {motifData && (
          <Box>
            <Typography variant="h6">Motif Data</Typography>
            <pre>{JSON.stringify(motifData, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MotifEnrichmentMEME;
