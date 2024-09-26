import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Graph from "./Graphs";

// Group order defined for histone marks
const MARK_TYPE_ORDER = [
  "Activating histone marks",
  "Repressive histone marks",
  "Transcriptional histone marks",
  "Other histone marks",
];

// Define types for histone data and metadata
interface HistoneData {
  histone_dataset_accession: string;
  proximal_values: number[];
  distal_values: number[];
}

interface Metadata {
  accession: string;
  target: string;
}

// Group graphs by their metadata target
const groupByMarkTypes = (
  histoneData: HistoneData[],
  metadata: Metadata[]
): { [markType: string]: HistoneData[] } => {
  const groupedData: { [markType: string]: HistoneData[] } = {
    "Activating histone marks": [],
    "Repressive histone marks": [],
    "Transcriptional histone marks": [],
    "Other histone marks": [],
  };

  metadata.forEach((meta) => {
    const target = meta.target;
    const markType = Object.keys(MARK_TYPE_ORDER).find((group) =>
      MARK_TYPE_ORDER.includes(target)
    );

    if (markType) {
      const associatedData = histoneData.find(
        (data) => data.histone_dataset_accession === meta.accession
      );

      if (associatedData) {
        groupedData[markType].push(associatedData);
      }
    }
  });

  return groupedData;
};

interface GraphSetProps {
  histoneData: HistoneData[];
  metadata: Metadata[];
}

const GraphSet: React.FC<GraphSetProps> = ({ histoneData, metadata }) => {
  const groupedData = useMemo(
    () => groupByMarkTypes(histoneData, metadata),
    [histoneData, metadata]
  );

  return (
    <Box>
      {MARK_TYPE_ORDER.map((markType) => (
        <Accordion key={markType}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{markType}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {groupedData[markType].map((graph, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box padding="10px">
                    <Graph
                      proximal_values={graph.proximal_values}
                      distal_values={graph.distal_values}
                      dataset={{ target: graph.histone_dataset_accession }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default GraphSet;
