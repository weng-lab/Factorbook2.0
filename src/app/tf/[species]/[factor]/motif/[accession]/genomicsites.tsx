import React, { useState, SetStateAction, useMemo } from "react";
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import {
  Box,
  Typography,
  Button,
  styled,
  useTheme,
  TextField,
  Link,
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

type MEMEOCCURESULT = {
genomic_region: {    chromosome: string;
    start: number;
    end: number;};

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

const StyledSearchBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});
const LargeTextField = styled(TextField)(({ theme }) => ({
  minWidth: "700px",
  "& .MuiInputBase-root": {
    height: "32px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "5px",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));
const UploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>(({ isDragging }) => ({
  padding: "16px",
  border: "2px dashed #ccc",
  borderRadius: "8px",
  backgroundColor: isDragging ? "#e0d4f7" : "#F3E8FF",
  textAlign: "center",
  marginTop: "16px",
}));

interface FullScreenDialogProps {
  species: string,
  consensusRegex: string,
  experimentID: string | null,
  fileID: string | null
}

export default function FullScreenDialog({ species, consensusRegex, experimentID, fileID }: FullScreenDialogProps) {
  const [sitesOpen, setSitesOpen] = useState(false); // for show genome sites button
  const [popupTab, setPopupTab] = useState<number>(0); // for popup tabs
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [value, setValue] = useState("");
  const [regions, setRegions] = useState<GenomicRange[]>([]);
  const theme = useTheme();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };
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
console.log(memeOccuData)
  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LanguageIcon />}
        sx={{
          borderRadius: "20px",
          borderColor: "#8169BF",
          color: "#8169BF",
          backgroundColor: "white",
          flex: 1,
        }}
        onClick={() => setSitesOpen(true)}
      >
        Show Genomic Sites
      </Button>
      <Dialog
        fullScreen
        open={sitesOpen}
        onClose={() => setSitesOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSitesOpen(false)}
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
            value={popupTab}
            onChange={(_, newValue) => setPopupTab(newValue)}
            aria-label="genomic sites tabs"
          >
            <Tab label="Genome Browser" />
            <Tab label="ChIP-seq Peak Motif Sites" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={popupTab} index={0}>
            <GQLWrapper>
              <Browser species={species} consensusRegex={consensusRegex} experimentID={experimentID || ""} />
            </GQLWrapper>
          </TabPanel>
          <TabPanel value={popupTab} index={1}>
            <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
            <Typography variant="h4" gutterBottom>
                {`Searching ${fileID} motif sites`} 
              </Typography>
              <br />
              {regions.length===0 && <>
              <Typography variant="h6" gutterBottom>
                {`Enter genomic coordinates (${species.toLowerCase() === "human" ? "GRCh38" : "mm10"
                  }):`}
              </Typography>
              <StyledSearchBox>
                <LargeTextField
                onKeyDown={(event) => {
                  if (event.key === "Tab" && !value) {
                     const defaultGenomicRegion = `chr2:${(100000000).toLocaleString()}-${(100101000).toLocaleString()}`;
                     setValue(defaultGenomicRegion);
                   }
                 }}
                 placeholder="Enter a genomic region"
                 onChange={handleChange}
                 id="region-input"
                 value={value}
                />{" "}
                <Button
                  variant="contained"
                  sx={{
                    margin: "auto",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: "medium",
                    color: "#FFFFFF",
                    "&:focus, &:hover, &:active": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => {
                    const chromosome = value.split(":")[0];
                    const start = +value
                      .split(":")[1]
                      .split("-")[0]
                      .replaceAll(",", "");
                    const end = +value
                      .split(":")[1]
                      .split("-")[1]
                      .replaceAll(",", "");
                    setRegions([
                      { chromosome: chromosome, start: start!!, end: end!! },
                    ]);
                    //setFileUpload(false)
                  }}
                >
                  Search
                </Button>
                <br />
                <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                  example: chr2:100,000,000-100,101,000
                </Typography>
              </StyledSearchBox>
              <br/>
              {(
                <>
                  <Typography variant="h6" gutterBottom>
                    You could also upload .bed files here
                  </Typography>
                  <UploadBox
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    isDragging={isDragging}
                  >
                    <DriveFolderUploadIcon fontSize="large" />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Drag and drop .bed files here
                      <br />
                      or
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <input
                        type="file"
                        id="file-input"
                        hidden
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-input">
                        <Button
                          variant="contained"
                          component="span"
                          sx={{
                            display: "block",
                            padding: "8px 16px",
                            backgroundColor: "#8169BF",
                            borderRadius: "24px",
                            textTransform: "none",
                            fontWeight: "medium",
                            color: "#FFFFFF",
                            "&:focus, &:hover, &:active": {
                              backgroundColor: "#8169BF",
                            },
                          }}
                        >
                          Browse Computer
                        </Button>
                      </label>
                    </Box>
                    {selectedFile && (
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Selected file: {selectedFile.name}
                      </Typography>
                    )}
                  </UploadBox>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        margin: "auto",
                        backgroundColor: "#8169BF",
                        borderRadius: "24px",
                        textTransform: "none",
                        fontWeight: "medium",
                        color: "#FFFFFF",
                        "&:focus, &:hover, &:active": {
                          backgroundColor: "#8169BF",
                        },
                      }}
                      // onClick={() => handleFileUpload()}
                      disabled={!selectedFile}
                    >
                      Upload File
                    </Button>
                  </Box>
                </>
              )}
              </>}
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
    </>
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
