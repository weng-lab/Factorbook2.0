'use client'

import { DATASETS_QUERY, EPIGENETIC_PROFILE_ACCESSIONS } from "./queries"
import { includeTargetTypes, excludeTargetTypes } from "@/consts"
import { useQuery } from "@apollo/client"
import { ArrowBackIosNewSharp, Clear, InfoOutlined, Search } from "@mui/icons-material"
import { Box, TextField, InputAdornment, IconButton, Chip, List, ListItem, ListItemText, Typography, Tooltip, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary } from "./StyledAccordion"

type ExperimentInfo<Mode> = Mode extends ("MotifEnrichment" | "EpigeneticProfile") ? Dataset : Dataset

export type ExperimentSelectionPanelProps<Mode extends ("MotifEnrichment" | "EpigeneticProfile")> = {
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
  onClose: () => void
}

export type Dataset = {
  replicated_peaks: {
    accession: string;
  }[];
  biosample: string;
  lab?: {
    friendly_name?: string;
  };
  accession: string;
};


const ExperimentSelectionPanel = <Mode extends "MotifEnrichment" | "EpigeneticProfile">(props: ExperimentSelectionPanelProps<Mode>) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expanded, setExpanded] = useState<string | false>(false) // default to first accordion

  console.log("rerendering ExperimentSelectionPanel")

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  }
  
  /**
   * Fetch all experiments
   */
  const { data: experimentsData, loading: experimentsLoading, error: experimentsError } = useQuery(DATASETS_QUERY, {
    variables: {
      processed_assembly: props.assembly,
      target: props.factor,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    },
  })

  /**
   * Accessions valid for epigenetic profiles page
   */
  const { data: histoneAccessions, loading: histoneAccessionsLoading, error: histoneAccessionsError } = useQuery(EPIGENETIC_PROFILE_ACCESSIONS, {
    variables: {
      assembly: props.assembly,
    },
    skip: props.mode !== "EpigeneticProfile"
  })

  const filteredBiosamples = useMemo(() => {
    if (!experimentsData || (props.mode === "EpigeneticProfile" && !histoneAccessions)) return []

    return (
      [...experimentsData.peakDataset.partitionByBiosample]
        .map((biosample) => { //filter out invalid accessions if used in Epigenetic Profiles
          if (props.mode === "EpigeneticProfile"){
            return {
              ...biosample, 
              datasets: biosample.datasets.filter((dataset) => 
                histoneAccessions?.histone_aggregate_values?.some(x => x.peaks_dataset_accession === dataset.accession)
              )
            }
          } else return biosample
        })
        .sort((a, b) => { return a.biosample.name.localeCompare(b.biosample.name) }) //sort tissues alphabetically
        .filter((biosample) =>
          biosample.datasets.length > 0 //filter out empty accordions. Only should happen on Epigenetic Profiles
          && biosample.biosample.name.toLowerCase().includes(searchTerm.toLowerCase()) //search biosample name
          || biosample.datasets.some(dataset => //search within experiments for that biosample
            dataset.accession.toLowerCase().includes(searchTerm.toLowerCase()) //search experiment ID
            || dataset.lab?.friendly_name?.toLowerCase().includes(searchTerm.toLowerCase()) //search lab name
            || dataset.replicated_peaks[0].accession.toLowerCase().includes(searchTerm.toLowerCase()) //search file ID
          )
        )
    )
  }, [experimentsData, searchTerm, histoneAccessions]) 

  // Find Accordion to open on initial load if it's not the first experiment (default)
  // Currently also resets the open accordion on search change. May want to change in future
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
    if (expanded !== `panel${expandedIdx}` && expandedIdx !== -1) {
      setExpanded(`panel${expandedIdx}`)
    }
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
                label={`${biosample.datasets.length} exp`}
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
                {biosample.datasets.map((dataset, idx: number) =>
                  dataset.replicated_peaks.map(
                    (peak, peakIdx: number) => {
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
                          onClick={() => props.onChange && props.onChange(dataset as Dataset)}
                        >
                          <ListItemText primaryTypographyProps={{display: "flex", alignItems: "center", gap: 0.5}}>
                            {dataset.accession}
                            {props.tooltipContents &&
                              <Tooltip title={props.tooltipContents(dataset as Dataset)}>
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