"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Graph from "@/components/motifmeme/aggregate/graphs";
import {
  AGGREGATE_DATA_QUERY,
  AGGREGATE_METADATA_QUERY,
  HISTONE_METADATA_QUERY,
} from "@/components/motifmeme/aggregate/queries";
import { associateBy, groupBy } from "queryz";
import {
  MARK_TYPES,
  MARK_TYPE_ORDER,
} from "@/components/motifmeme/aggregate/marks";
import { useParams } from "next/navigation";
import { useTheme, useMediaQuery } from "@mui/material";
import JSZip from "jszip";
import { Download } from "@mui/icons-material";
import LoadingHistone from "../loading";

// Utility to download ZIP
const downloadZip = async (zip: JSZip, filename: string) => {
  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Map to store SVG references outside React hooks
const svgRefs = new Map<string, Map<number, SVGSVGElement>>();

const EpigeneticProfilePage = () => {
  /**
   * @todo why is this using useParams instead of taking params exposed as props?
   */
  const { species, factor, accession } = useParams();

  const speciesStr = Array.isArray(species) ? species[0] : species;
  const factorStr = Array.isArray(factor) ? factor[0] : factor;
  const accessionStr = Array.isArray(accession) ? accession[0] : accession;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: aggregateData, loading: aggregateLoading } = useQuery(
    AGGREGATE_DATA_QUERY,
    {
      variables: { accession: accessionStr },
      skip: !accessionStr,
    }
  );

  /**
   * @todo this shouldn't be necessary. ONLY used for matching the accession to a biosample. Fetch biosample as part of HISTONE_METADATA_QUERY and remove from 
   */
  const { data: metadataData, loading: metadataLoading } = useQuery(
    AGGREGATE_METADATA_QUERY,
    {
      variables: {
        assembly: speciesStr.toLowerCase() === "human" ? "GRCh38" : "mm10",
        target: factorStr,
      },
    }
  );

  const { data: histoneData, loading: histoneLoading } = useQuery(
    HISTONE_METADATA_QUERY,
    {
      variables: {
        accessions: aggregateData
          ? aggregateData.histone_aggregate_values.map(
            (x: any) => x.histone_dataset_accession
          )
          : [],
      },
      skip: !aggregateData,
    }
  );

  const isLoading = aggregateLoading || metadataLoading || histoneLoading;
  if (isLoading) return LoadingHistone();

  const biosample =
    metadataData?.peakDataset?.datasets?.find(
      (dataset: any) => dataset.accession === accessionStr
    )?.biosample || "Unknown Biosample";

  const values = associateBy(
    aggregateData.histone_aggregate_values,
    (x: any) => x.histone_dataset_accession,
    (x) => x
  );

  const marks = associateBy(
    histoneData?.peakDataset?.datasets,
    (x: any) => x.target,
    (x) => x
  );

  const typeGroups = groupBy(
    [...marks.keys()],
    (x) => MARK_TYPES[x],
    (x) => ({
      dataset: marks.get(x)!,
      proximal_values:
        values.get(marks.get(x)!.accession)?.proximal_values || [],
      distal_values: values.get(marks.get(x)!.accession)?.distal_values || [],
    })
  );

  const handleExportAccordionAsZip = async (type: string) => {
    const zip = new JSZip();
    const refMap = svgRefs.get(type);

    if (!refMap) return;

    refMap.forEach((svg, idx) => {
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        zip.file(`${type}-plot-${idx + 1}.svg`, svgData);
      }
    });

    await downloadZip(zip, `${type}-plots.zip`);
  };

  const handleExportAllAsZip = async () => {
    const zip = new JSZip();

    svgRefs.forEach((refMap, type) => {
      refMap.forEach((svg, idx) => {
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          zip.file(`${type}-plot-${idx + 1}.svg`, svgData);
        }
      });
    });

    await downloadZip(zip, "all-plots.zip");
  };

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        <strong>{`Histone modification profiles around ${factorStr} peaks in ${biosample}`}</strong>
      </Typography>
      <div>

      {MARK_TYPE_ORDER.filter((type) => typeGroups.get(type)).map(
        (type, typeIdx) => {
          if (!svgRefs.has(type)) {
            svgRefs.set(type, new Map());
          }

          const refMap = svgRefs.get(type);

          return (
            <Accordion key={type} defaultExpanded={typeIdx === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{type}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap="5.2rem"
                >
                  {typeGroups.get(type)?.map((group: any, idx: number) => (
                    <Box
                      key={idx}
                      style={{ width: "300px", marginBottom: "20px" }}
                    >
                      <Graph
                        ref={(el) => {
                          if (el) refMap?.set(idx, el);
                        }}
                        proximal_values={group.proximal_values}
                        distal_values={group.distal_values}
                        dataset={group.dataset}
                        xlabel="distance from summit (bp)"
                        ylabel="fold change signal"
                      />
                    </Box>
                  ))}
                </Box>
                {/* Add Export Button for Individual Accordion */}
                <Box display="flex" justifyContent="center" marginTop="20px">
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleExportAccordionAsZip(type)}
                  endIcon={<Download />}
                  >
                  Export {type} plots as ZIP
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        }
      )}
      </div>
      <Box display="flex" justifyContent="center" marginTop="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportAllAsZip}
          endIcon={<Download />}
        >
          Export all plots as ZIP
        </Button>
      </Box>
    </>
  );
};

export default EpigeneticProfilePage;
