import React, { useState, useMemo } from "react";
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {
  Box,
  Typography,
  Button,
  Link,
  Grid,
} from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LanguageIcon from '@mui/icons-material/Language';
import { TransitionProps } from '@mui/material/transitions';
import Browser from "./browser";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { GQLWrapper } from "@weng-lab/genomebrowser";
import {
  DataTable,
  DataTableColumn,
} from "@weng-lab/psychscreen-ui-components";
import { useQuery } from "@apollo/client";
import { MEMEOCCU_QUERY } from "../../queries";
import SearchBox from "./searchBox";

type MEMEOCCURESULT = {
  genomic_region: {
    chromosome: string;
    start: number;
    end: number;
  };

  consensus_regex: string;
  q_value: number;
  peaks_accession: string;
  strand: string;
}
const MEME_OCCU_COLUMNS = (): DataTableColumn<MEMEOCCURESULT>[] => {
  const cols: DataTableColumn<MEMEOCCURESULT>[] = [
    {
      header: "Chromosome",
      value: (row: MEMEOCCURESULT) => row.genomic_region.chromosome,
    },
    {
      header: "Start",
      value: (row: MEMEOCCURESULT) => row.genomic_region.start,
      render: (row: MEMEOCCURESULT) => row.genomic_region.start.toLocaleString(),
    },
    {
      header: "End",
      value: (row: MEMEOCCURESULT) => row.genomic_region.end,
      render: (row: MEMEOCCURESULT) => row.genomic_region.end.toLocaleString(),
    },
    {
      header: "Consensus Regex ",
      value: (row: MEMEOCCURESULT) => row.consensus_regex,
    },
    {
      header: "Peaks Accession",
      value: (row: MEMEOCCURESULT) => row.peaks_accession,
      render: (row: MEMEOCCURESULT) => (
        <Link
          style={{ color: "#8169BF" }}
          rel="noopener noreferrer"
          target="_blank"
          href={`https://www.encodeproject.org/files/${row.peaks_accession}/`}
        >
          {row.peaks_accession}
        </Link>
      ),
    },
    {
      header: "q value",
      value: (row: MEMEOCCURESULT) => row.q_value.toFixed(2),
    },
  ];

  return cols;
};

export type GenomicRange = {
  chromosome?: string;
  start?: number;
  end?: number;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullScreenDialogProps {
  open: boolean,
  onClose: () => void,
  species: string,
  consensusRegex: string,
  experimentID: string | null,
  fileID: string | null
}

export default function FullScreenDialog({ species, consensusRegex, experimentID, fileID, open, onClose }: FullScreenDialogProps) {
  const [currentTab, setcurrentTab] = useState<number>(0); // for popup tabs
  const [regions, setRegions] = useState<GenomicRange[]>([]);

  const formattedRegions = useMemo(
    () => regions.map(x => ({ chromosome: x.chromosome!, start: x.start!, end: x.end! })),
    [regions]
  );

  const { data: memeOccuData, loading, error } = useQuery(MEMEOCCU_QUERY, {

    variables: {
      peaks_accession: fileID,
      range: formattedRegions,
      consensus_regex: consensusRegex,
    },
    skip: formattedRegions.length === 0,
  });

  return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Browsing Genomic Instances for {consensusRegex} in {experimentID}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setcurrentTab(newValue)}
            aria-label="genomic sites tabs"
          >
            <Tab label="Genome Browser" />
            <Tab label="ChIP-seq Peak Motif Sites" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={currentTab} index={0}>
            <GQLWrapper>
              <Browser species={species} consensusRegex={consensusRegex} experimentID={experimentID || ""} />
            </GQLWrapper>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ mt: 4, mx: "auto", maxWidth: "2000px" }}>
              <>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">
                      {`Searching ${fileID} motif sites`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        setRegions([]);
                      }}
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: "220px",
                        height: "41px",
                        padding: "8px 24px",
                        borderRadius: "24px",
                        backgroundColor: "#8169BF",
                        color: "white",
                        fontFeatureSettings: "'clig' off, 'liga' off",
                        fontSize: "15px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        letterSpacing: "0.46px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#7151A1",
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                      Perform New Search
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
              </>
              <br />
              {regions.length === 0 && <SearchBox species={species} setRegions={setRegions} />}
              {memeOccuData && memeOccuData.meme_occurrences && (
                <Box sx={{ mx: "auto", alignItems: "center" }}>
                  <DataTable
                    key="meme_occu"
                    columns={MEME_OCCU_COLUMNS()}
                    rows={memeOccuData.meme_occurrences}
                    itemsPerPage={10}
                    sortColumn={1}
                    searchable
                    tableTitle={`${memeOccuData.meme_occurrences.length} ${fileID} ChIP-seq peak motif sites matched your input:`}
                  />
                </Box>
              )}
            </Box>
          </TabPanel>
        </Box>
      </Dialog>
  );
}

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
  keepMounted?: boolean;
}) {
  const { children, value, index, keepMounted = true, ...other } = props;

  // If keepMounted is true, use hidden attribute, otherwise conditionally render
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {/* Only render content if keepMounted is true or if this tab is active */}
      {(keepMounted || value === index) && children}
    </div>
  );
}
