import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Graph from "./Graphs"; // Your graph component
import { MARK_GROUPS, MARK_TYPE_ORDER } from "./marks";

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

// Define the types for props in CollapsibleGraphSet
interface CollapsibleGraphSetProps {
  title: string;
  graphs: HistoneDataWithTarget[];
}

interface HistoneDataWithTarget extends HistoneData {
  target: string;
}

// Helper function to group data by mark types using metadata
const groupByMarkTypes = (
  histoneData: HistoneData[],
  metadata: Metadata[]
): { [markType: string]: HistoneDataWithTarget[] } => {
  const groupedData: { [markType: string]: HistoneDataWithTarget[] } = {};

  metadata.forEach((meta) => {
    const target = meta.target;
    const markType = Object.keys(MARK_GROUPS).find((group) =>
      MARK_GROUPS[group].includes(target)
    );

    if (markType) {
      const associatedData = histoneData.find(
        (data) => data.histone_dataset_accession === meta.accession
      );

      if (associatedData) {
        groupedData[markType] = groupedData[markType] || [];
        groupedData[markType].push({ ...associatedData, target });
      }
    }
  });

  return groupedData;
};

// Collapsible Graph Set component for rendering grouped graphs in collapsible sections
const CollapsibleGraphSet: React.FC<CollapsibleGraphSetProps> = ({
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
          {graphs.map((graph, idx) => (
            <Box key={idx} sx={{ width: "300px", padding: "10px" }}>
              <Graph
                proximal_values={graph.proximal_values}
                distal_values={graph.distal_values}
                dataset={{ target: graph.target }}
                title={graph.target}
              />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Main GraphSet component to handle data grouping and rendering the accordions
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
