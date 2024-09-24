"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  AGGREGATE_METADATA_QUERY,
  AGGREGATE_DATA_QUERY,
} from "@/components/MotifMeme/Aggregate/Queries";
import {
  CircularProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "d3-array";

// Define types for the data
interface Dataset {
  biosample: string;
  accession: string;
}

interface EpigeneticProfileProps {
  species: string;
  factor: string;
  accession?: string;
}

// Define a type for the histone data
interface HistoneData {
  distal_values: number[];
  proximal_values: number[];
}

const EpigeneticProfile: React.FC<EpigeneticProfileProps> = ({
  species,
  factor,
  accession: selectedAccession,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const assembly = species === "Human" ? "GRCh38" : "mm10";

  // Query to get peak datasets
  const { data, loading, error } = useQuery(AGGREGATE_METADATA_QUERY, {
    variables: {
      assembly,
      target: factor,
      replicated_peaks: true,
    },
  });

  // Query to get data for the selected accession
  const {
    data: aggregateData,
    loading: aggregateLoading,
    error: aggregateError,
  } = useQuery(AGGREGATE_DATA_QUERY, {
    variables: { accession: selectedAccession },
    skip: !selectedAccession,
  });

  // Prepare the data for the graph
  const histoneData: HistoneData[] =
    aggregateData?.histone_aggregate_values || [];

  // Memoized scales
  const xScale = useMemo(() => {
    return scaleBand<number>({
      range: [0, 800], // Width of the chart
      domain: histoneData.map((_, i) => i), // Use index as x-axis value
      padding: 0.2,
    });
  }, [histoneData]);

  const yScale = useMemo(() => {
    return scaleLinear<number>({
      range: [400, 0], // Height of the chart (inverted)
      domain: extent(
        histoneData.flatMap((d) => [...d.distal_values, ...d.proximal_values])
      ) as [number, number], // Calculate the extent of values
    });
  }, [histoneData]);

  // Don't conditionally render hooks, handle content conditionally
  if (loading || aggregateLoading) return <CircularProgress />;
  if (error || aggregateError) {
    console.error(
      "Error in GraphQL query:",
      error?.message || aggregateError?.message
    );
    return <p>Error: {error?.message || aggregateError?.message}</p>;
  }

  const datasets: Dataset[] = data?.peakDataset?.datasets || [];

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

  const sortedBiosamples = Object.keys(groupedDatasets).sort((a, b) =>
    a.localeCompare(b)
  );
  const filteredDatasets = sortedBiosamples.filter((biosample) =>
    biosample.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccessionClick = (accession: string) => {
    router.push(
      `/TranscriptionFactor/${species}/${factor}/EpigeneticProfile/${accession}`
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        padding: "10px",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
      }}
    >
      {/* Left Drawer */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          height: "calc(100vh - 128px)",
          marginBottom: "64px",
          paddingRight: { md: "10px" },
          backgroundColor: "white",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
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
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(129, 105, 191, 0.09)",
                borderRadius: "50px",
                paddingLeft: "20px",
              },
            }}
          />
        </Box>

        <List>
          {filteredDatasets.map((biosample, index) => (
            <Accordion key={index}>
              <AccordionSummary>
                <Typography variant="h6">{biosample}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {groupedDatasets[biosample].map(
                  (dataset: Dataset, idx: number) => (
                    <ListItem
                      button
                      key={idx}
                      onClick={() => handleAccessionClick(dataset.accession)}
                      selected={dataset.accession === selectedAccession}
                      sx={{
                        padding: "10px 20px",
                        backgroundColor:
                          dataset.accession === selectedAccession
                            ? "#f0f0f0"
                            : "white",
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
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

      {/* Right Content - Plotting Graph */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: "25px" },
          padding: "16px",
          overflowY: "auto",
        }}
      >
        {selectedAccession ? (
          <>
            <Typography variant="h4" gutterBottom>
              Epigenetic Profile for Accession: {selectedAccession}
            </Typography>
            <svg width={900} height={500}>
              <Group top={50} left={50}>
                {/* Line for Distal Values */}
                {histoneData.map((d, i) => (
                  <LinePath
                    key={`distal-line-${i}`}
                    data={d.distal_values}
                    x={(value, idx) => xScale(idx) ?? 0}
                    y={(value) => yScale(value)}
                    stroke="#ff7f0e"
                    strokeWidth={2}
                    curve={curveMonotoneX}
                  />
                ))}

                {/* Line for Proximal Values */}
                {histoneData.map((p, i) => (
                  <LinePath
                    key={`proximal-line-${i}`}
                    data={p.proximal_values}
                    x={(value, idx) => xScale(idx) ?? 0}
                    y={(value) => yScale(value)}
                    stroke="#1f77b4"
                    strokeWidth={2}
                    curve={curveMonotoneX}
                  />
                ))}
              </Group>
            </svg>
          </>
        ) : (
          <Typography variant="h4">
            Please select an accession to view its profile.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EpigeneticProfile;
