import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { AGGREGATE_METADATA_QUERY } from "@/components/motifmeme/aggregate/queries";
import { debounce } from "lodash";
import { histoneBiosamplePartitions } from "./utils";

interface Dataset {
  biosample: string;
  accession: string;
}

const Layout: React.FC<{
  species: string;
  factor: string;
  children: React.ReactNode;
}> = ({ species, factor, children }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [expandedBiosample, setExpandedBiosample] = useState<string | false>(
    false
  );
  const router = useRouter(); // For pushing URL updates
  const { accession: currentAccession } = useParams(); // Current accession from URL

  const assembly = species === "Human" ? "GRCh38" : "mm10";

  const { data, loading, error } = useQuery(AGGREGATE_METADATA_QUERY, {
    variables: { assembly, target: factor },
  });

  const datasets: Dataset[] = data
    ? histoneBiosamplePartitions(data)
        .list.map((ds: any) =>
          ds.datasets.map((d: any) => ({
            biosample: ds.biosample.name,
            accession: d.accession,
          }))
        )
        .flat()
    : [];

  const groupedDatasets = useMemo(() => {
    return datasets.reduce(
      (acc: { [key: string]: Dataset[] }, dataset: Dataset) => {
        const { biosample } = dataset;
        if (!acc[biosample]) acc[biosample] = [];
        acc[biosample].push(dataset);
        return acc;
      },
      {}
    );
  }, [datasets]);

  const sortedBiosamples = useMemo(() => {
    return Object.keys(groupedDatasets).sort((a, b) => a.localeCompare(b));
  }, [groupedDatasets]);

  const filteredDatasets = useMemo(() => {
    return sortedBiosamples.filter((biosample) =>
      biosample.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [sortedBiosamples, debouncedSearchTerm]);

  useEffect(() => {
    if (currentAccession && expandedBiosample === false) {
      const foundBiosample = Object.keys(groupedDatasets).find((biosample) =>
        groupedDatasets[biosample].some(
          (dataset) => dataset.accession === currentAccession
        )
      );
      if (foundBiosample) {
        setExpandedBiosample(foundBiosample);
      }
    }
  }, [currentAccession, groupedDatasets, expandedBiosample]);

  // Handle accession click and update route
  const handleAccessionClick = (accession: string) => {
    // Update the route dynamically when an accession is clicked
    router.push(
      `/transcriptionfactor/${species}/${factor}/epigeneticprofile/${accession}`
    );
  };

  const debounceSearch = useCallback(
    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        padding: "5px",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
      }}
    >
      {!drawerOpen && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 2000,
            backgroundColor: "white",
            color: "#8169BF",
            borderRadius: "50%",
            boxShadow: 3,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}

      <Box
        sx={{
          width: drawerOpen ? { xs: "100%", md: "25%" } : 0,
          height: "calc(100vh - 128px)",
          marginBottom: "64px",
          overflowY: "auto",
          transition: "width 0.3s ease",
          paddingRight: drawerOpen ? { md: "10px" } : 0,
          backgroundColor: "white",
          borderRight: drawerOpen ? "1px solid #ccc" : "none",
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
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search Biosamples"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  sx: {
                    backgroundColor: "rgba(129, 105, 191, 0.09)",
                    borderRadius: "50px",
                    paddingLeft: "20px",
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
                <Accordion
                  key={index}
                  expanded={expandedBiosample === biosample}
                  onChange={() =>
                    setExpandedBiosample(
                      expandedBiosample === biosample ? false : biosample
                    )
                  }
                >
                  <AccordionSummary>
                    <Typography variant="h6">{biosample}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {groupedDatasets[biosample].map(
                      (dataset: Dataset, idx: number) => (
                        <ListItem
                          button
                          key={idx}
                          onClick={() =>
                            handleAccessionClick(dataset.accession)
                          }
                          selected={dataset.accession === currentAccession}
                          sx={{
                            padding: "10px 20px",
                            backgroundColor:
                              dataset.accession === currentAccession
                                ? "#e0e0e0"
                                : "white",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                            borderBottom: "1px solid #ddd",
                          }}
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

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: "25px" },
          padding: "16px",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
