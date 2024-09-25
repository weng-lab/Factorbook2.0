import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Graph from "./Graphs";
import { MARK_GROUPS, MARK_COLORS, MARK_TYPE_ORDER } from "./marks";

// Helper function to group data by mark types
const groupByMarkTypes = (data: any[], metadata: any[]) => {
  const groupedData: { [key: string]: any[] } = {};
  for (const markType of MARK_TYPE_ORDER) {
    groupedData[markType] = data.filter((entry) =>
      MARK_GROUPS[markType].includes(
        metadata.find((meta) => meta.accession === entry.accession)?.target
      )
    );
  }
  return groupedData;
};

// Collapsible Graph Set component
const CollapsibleGraphSet: React.FC<{ title: string; graphs: any[] }> = ({
  title,
  graphs,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexWrap="wrap">
          {graphs.map((graph, index) => (
            <Box key={index} sx={{ width: "30%", padding: "10px" }}>
              <Graph
                proximal_values={graph.proximal_values}
                distal_values={graph.distal_values}
                dataset={graph.dataset}
                title={graph.dataset.target}
              />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Main GraphSet component to handle data grouping and rendering the accordions
const GraphSet: React.FC<{ histoneData: any[]; metadata: any[] }> = ({
  histoneData,
  metadata,
}) => {
  // Group data by MARK_TYPE_ORDER
  const groupedData = useMemo(
    () => groupByMarkTypes(histoneData, metadata),
    [histoneData, metadata]
  );

  return (
    <Box sx={{ marginTop: "20px" }}>
      {MARK_TYPE_ORDER.filter(
        (markType) => groupedData[markType]?.length > 0
      ).map((markType) => (
        <CollapsibleGraphSet
          key={markType}
          title={markType}
          graphs={groupedData[markType]}
        />
      ))}
    </Box>
  );
};

export default GraphSet;
