'use client'

import { DATASETS_QUERY } from "@/components/motifmeme/queries"
import { DataResponse, Dataset, ReplicatedPeaks } from "@/components/motifmeme/types"
import { includeTargetTypes, excludeTargetTypes } from "@/consts"
import { useQuery } from "@apollo/client"
import { ArrowBackIosNewSharp, Clear, InfoOutlined, Search } from "@mui/icons-material"
import { Box, TextField, InputAdornment, IconButton, Chip, List, ListItem, ListItemText, Typography, Tooltip, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary } from "./StyledAccordion"

type ExperimentInfo<Mode> = Mode extends ("MotifEnrichment" | "EpigeneticProfiles") ? Dataset : Dataset

export type ExperimentSelectionPanelProps<Mode extends ("MotifEnrichment" | "EpigeneticProfiles")> = {
  /**
   * toggles the experiments to be fetched and displayed depending on tab
   */
  mode: Mode
  /**
   * current assembly
   */
  assembly: "GRCh38" | "mm10"
  /**
   * current factor
   */
  factor: string
  /**
   * Item to be displayed as selected
   */
  selectedExperiment?: ExperimentInfo<Mode> | string | null,
  /**
   * Fired when an experiment is clicked
   */
  onChange?: (experiment: ExperimentInfo<Mode>) => void,
  /**
   * contents of tooltip to be displayed next to each experiment
   */
  tooltipContents?: (experiment: ExperimentInfo<Mode>) => React.ReactNode
  /**
   * Fired when component requests to be close
   */
  onClose?: () => void
}



const ExperimentSelectionPanel = <Mode extends "MotifEnrichment" | "EpigeneticProfiles">(props: ExperimentSelectionPanelProps<Mode>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    }
  
  /**
   * Hardcoding the meme motif experiments for now, undo
   */

  const { data, loading, error } = useQuery<DataResponse>(DATASETS_QUERY, {
    variables: {
      processed_assembly: props.assembly,
      target: props.factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  })

  const filteredBiosamples = useMemo(() => {
    return [...(data?.peakDataset.partitionByBiosample || [])]
    .sort((a, b) => { return a.biosample.name.localeCompare(b.biosample.name) })
    .filter((biosample) =>
      biosample.biosample.name.toLowerCase().includes(searchTerm.toLowerCase()) //biosample name
      || biosample.datasets.some(dataset => //search within experiments for that biosample
        dataset.accession.toLowerCase().includes(searchTerm.toLowerCase()) //experiment ID
        || dataset.lab.friendly_name.toLowerCase().includes(searchTerm.toLowerCase()) //lab name
        || dataset.replicated_peaks[0].accession.toLowerCase().includes(searchTerm.toLowerCase()) //file ID
      )
    )
  }, [data, searchTerm]) 

  //Find Accordion to open on initial load
  useEffect(() => {
    const expandedIdx = filteredBiosamples.findIndex((x) => {
      return x.datasets.find(y => {
        if (typeof props.selectedExperiment === "object") {
          return y.accession === props.selectedExperiment?.accession
        } else {
          return y.accession === props.selectedExperiment
        }
      })
    })
    setExpanded(`panel${expandedIdx}`)
  }, [filteredBiosamples])

  return (
    <Box id="outer" overflow={"hidden"} display={"flex"} flexDirection={"column"} maxHeight={'100%'}>
      <Stack direction="row" p={1} gap={0.5}>
        <TextField
          label="Search Biosamples"
          variant="outlined"
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: searchTerm ?
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')}>
                  <Clear />
                </IconButton>
              </InputAdornment>
              :
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ,
            sx: {
              borderRadius: (theme) => theme.shape.borderRadius,
            },
          }}
        />
        <Tooltip title="Collapse Experiment Selection" placement="top">
          <IconButton onClick={props.onClose} color="primary">
            <ArrowBackIosNewSharp />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box id="scrollableExps" sx={{overflowY: 'auto', flexGrow: 1}}>
        {filteredBiosamples.map((biosample, index) => (
          <Accordion
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            key={index}
          >
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
                size="small"
              />
            </AccordionSummary>
            <AccordionDetails sx={{borderTop: '0'}}>
              <List disablePadding>
                {biosample.datasets.map((dataset: Dataset, idx: number) =>
                  dataset.replicated_peaks.map(
                    (peak: ReplicatedPeaks, peakIdx: number) => {
                      const isSelected =
                        typeof props.selectedExperiment === 'object' ?
                          props.selectedExperiment?.accession === dataset.accession
                          : props.selectedExperiment === dataset.accession

                      return (
                        <ListItem
                          key={`${idx}-${peakIdx}`}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: isSelected ? "#EEEEEE" : "transparent",
                            fontWeight: isSelected ? "bold" : "normal",
                            borderRadius: (theme) => theme.shape.borderRadius,
                          }}
                          onClick={() => props.onChange && props.onChange(dataset)}
                        >
                          <ListItemText primaryTypographyProps={{display: "flex", alignItems: "center", gap: 0.5}}>
                            {dataset.accession}
                            {props.tooltipContents &&
                              <Tooltip title={props.tooltipContents(dataset)}>
                                <InfoOutlined fontSize="small" />
                              </Tooltip>
                            }
                          </ListItemText>
                        </ListItem>
                      )
                    }
                  )
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        </Box>
    </Box>
  )
}

export default ExperimentSelectionPanel