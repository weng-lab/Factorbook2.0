import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { AGGREGATE_METADATA_QUERY } from "@/components/MotifMeme/Aggregate/Queries";
import {
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useParams } from "next/navigation"; // Import router and params

interface Dataset {
  biosample: string;
  accession: string;
}

interface EpigeneticProfileProps {
  species: string;
  factor: string;
}

const EpigeneticProfile: React.FC<EpigeneticProfileProps> = ({
  species,
  factor,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const { accession: selectedAccession } = useParams<{ accession: string }>(); // Capture the selected accession from the URL

  const assembly = species === "Human" ? "GRCh38" : "mm10";

  const { data, loading, error } = useQuery(AGGREGATE_METADATA_QUERY, {
    variables: {
      assembly,
      target: factor,
      replicated_peaks: true,
    },
  });

  if (loading) return <CircularProgress />;
  if (error) {
    console.error("Error in GraphQL query:", error.message);
    return <p>Error: {error.message}</p>;
  }

  const datasets: Dataset[] = data?.peakDataset?.datasets || [];

  // Group datasets by biosample
  const groupedDatasets = datasets.reduce(
    (acc: { [key: string]: Dataset[] }, dataset: Dataset) => {
      const { biosample } = dataset;
      if (!acc[biosample]) {
        acc[biosample] = [];
      }
      acc[biosample].push(dataset);
      return acc;
    },
    {}
  );

  // Get sorted biosample keys
  const sortedBiosamples = Object.keys(groupedDatasets).sort((a, b) =>
    a.localeCompare(b)
  );

  // Apply search filtering
  const filteredDatasets = sortedBiosamples.filter((biosample) =>
    biosample.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle accession selection and URL update
  const handleAccessionClick = (accession: string) => {
    router.push(
      `/TranscriptionFactor/${species}/${factor}/EpigeneticProfile/${accession}`
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)", // Respect header/footer
        display: "flex",
        padding: "5px",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden", // Fix extra white space issue
      }}
    >
      {!drawerOpen && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: "50%", // Center the button vertically
            left: 0,
            transform: "translateY(-50%)", // Adjust centering
            zIndex: 2000,
            backgroundColor: "white",
            color: "#8169BF",
            borderRadius: "50%",
            boxShadow: 3,
          }}
        >
          <ArrowForwardIosIcon /> {/* Right-facing arrow for expanding */}
        </IconButton>
      )}

      {/* Left-side Drawer */}
      <Box
        sx={{
          width: drawerOpen ? { xs: "100%", md: "25%" } : 0, // Same width as before
          height: "calc(100vh - 128px)", // Respect header/footer
          marginBottom: "64px", // Above footer
          position: "relative", // Not fixed, part of the layout
          overflowY: "auto", // Allow scrolling of drawer content
          transition: "width 0.3s ease", // Smooth transition when opening/closing
          paddingRight: drawerOpen ? { md: "10px" } : 0,
          backgroundColor: "white",
          borderRight: drawerOpen ? "1px solid #ccc" : "none", // Show border when open
        }}
      >
        {drawerOpen && (
          <Box>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                backgroundColor: "white",
                padding: "16px",
                borderBottom: "1px solid #ccc", // Divider between search bar and list
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search Biosamples"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  sx: {
                    backgroundColor: "rgba(129, 105, 191, 0.09)",
                    borderRadius: "50px",
                    paddingLeft: "20px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#8169BF" },
                  },
                }}
              />
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{
                  marginLeft: 2,
                  backgroundColor: "#8169BF",
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <List>
              {filteredDatasets.map((biosample, index) => (
                <Accordion key={index}>
                  <AccordionSummary>
                    <Typography variant="h6">{biosample}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Render accessions under the biosample */}
                    {groupedDatasets[biosample].map(
                      (dataset: Dataset, idx: number) => (
                        <ListItem
                          button
                          key={idx}
                          onClick={() =>
                            handleAccessionClick(dataset.accession)
                          } // Call function to change URL
                          selected={dataset.accession === selectedAccession} // Highlight the selected accession
                        >
                          <ListItemText primary={dataset.accession} />
                        </ListItem>
                      )
                    )}
                    <Divider />
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Right-side Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: drawerOpen ? { xs: 0 } : 0, // Adjust margin when drawer is open
          transition: "margin-left 0.3s ease", // Smooth transition for content shift
          padding: "16px",
          overflowY: "auto", // Scrollable right-side content
        }}
      >
        <Typography variant="h4">
          Epigenetic Profile for Accession: {selectedAccession}
        </Typography>
        {/* Render content based on selected accession */}
        {selectedAccession ? (
          <Typography variant="body1">
            Data for accession <strong>{selectedAccession}</strong> would be
            rendered here.
          </Typography>
        ) : (
          <Typography variant="body1">
            Please select an accession to view its profile.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EpigeneticProfile;
