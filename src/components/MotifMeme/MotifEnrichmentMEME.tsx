import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
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
  Dataset,
  MotifResponse,
  ReplicatedPeaks,
} from "@/components/MotifMeme/Types";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

interface MotifEnrichmentMEMEProps {
  factor: string;
  species: string;
}

const MotifEnrichmentMEME: React.FC<MotifEnrichmentMEMEProps> = ({
  factor,
  species,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null);
  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: "GRCh38",
      target: factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  const {
    data: motifData,
    loading: motifLoading,
    error: motifError,
  } = useQuery<MotifResponse>(MOTIF_QUERY, {
    variables: { peaks_accession: selectedPeak ? [selectedPeak] : [] },
    skip: !selectedPeak, // Skip query if no peak is selected
  });

  const handleAccessionClick = (peakAccession: string) => {
    setSelectedPeak(peakAccession);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

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
      {/* Left side: List of biosamples */}
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
                  {biosample.datasets.map((dataset: Dataset, idx: number) =>
                    dataset.replicated_peaks.map(
                      (peak: ReplicatedPeaks, peakIdx: number) => (
                        <ListItem
                          key={`${idx}-${peakIdx}`}
                          style={{ paddingLeft: "30px", cursor: "pointer" }}
                          onClick={() => handleAccessionClick(peak.accession)}
                        >
                          <ListItemText
                            primary={`${dataset.lab.friendly_name} (${dataset.accession})`}
                          />
                        </ListItem>
                      )
                    )
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Box>

      {/* Right side: Display motif data */}
      <Box flexGrow={1} ml={2}>
        {motifLoading && <CircularProgress />}
        {motifError && <p>Error: {motifError.message}</p>}
        {motifData && (
          <Box>
            <Typography variant="h6">Motif Data</Typography>
            <pre>{JSON.stringify(motifData, null, 2)}</pre>
          </Box>
        )}
        {!motifLoading && !motifData && (
          <Typography>Select a peak to view motif data</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MotifEnrichmentMEME;
