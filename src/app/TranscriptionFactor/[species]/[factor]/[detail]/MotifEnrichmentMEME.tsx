// Import necessary modules and components
import React, { useState } from "react";
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
  Divider,
  TextField,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DATASETS_QUERY } from "@/components/MotifMeme/Queries";
import {
  DataResponse,
  BiosamplePartition,
  Dataset,
} from "@/components/MotifMeme/Types"; // Ensure correct import path
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

// Define the main component
const MotifEnrichmentMEME: React.FC = () => {
  // Define state variables
  const [searchTerm, setSearchTerm] = useState("");

  // Query data from the server
  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: "GRCh38",
      target: "CTCF",
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  });

  // Display loading or error messages
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
    <Box>
      {/* Search bar */}
      <Box mb={2}>
        <TextField
          label="Search Biosamples"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {/* List of biosamples */}
      <List>
        {filteredBiosamples.map((biosample, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{biosample.biosample.name}</Typography>
              <Chip
                label={`${biosample.counts.total} exp`}
                color="primary"
                style={{ marginLeft: "auto" }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {biosample.datasets.map((dataset: Dataset, idx: number) => (
                  <React.Fragment key={idx}>
                    <ListItem style={{ paddingLeft: "30px" }}>
                      <ListItemText
                        primary={dataset.lab.friendly_name}
                        secondary={dataset.accession}
                      />
                    </ListItem>
                    {idx < biosample.datasets.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
    </Box>
  );
};

export default MotifEnrichmentMEME;
