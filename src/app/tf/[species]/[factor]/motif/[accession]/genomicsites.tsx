import React, { useState, SetStateAction } from "react";
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
  Link, } from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LanguageIcon from '@mui/icons-material/Language';
import { TransitionProps } from '@mui/material/transitions';


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
  experimentID: string | null
}

export default function createFullScreenDialog(): React.FC<FullScreenDialogProps> {
  return function FullScreenDialog({ species, consensusRegex, experimentID }) {
    const [sitesOpen, setSitesOpen] = React.useState(false); // for show genome sites button
    const [popupTabsOpen, setPopupTabsOpen] = React.useState(false); // for popup tabs
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const theme = useTheme();
  
    const handleClickOpenSites = () => {
      setSitesOpen(true);
    };
  
    const handleCloseSites = () => {
      setSitesOpen(false);
    };

    const handlePopupChange = () => {
      if (popupTabsOpen) {
        setPopupTabsOpen(false);
      } else {
        setPopupTabsOpen(true);
      }
    };

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
  
    return (
      <React.Fragment>
        <Button
          variant="outlined"
          startIcon={<LanguageIcon/>}
          sx={{
            borderRadius: "20px",
            borderColor: "#8169BF",
            color: "#8169BF",
            backgroundColor: "white",
            flex: 1,
          }}
          onClick={handleClickOpenSites}
          >
          Show Genomic Sites
        </Button>
        <Dialog
          fullScreen
          open={sitesOpen}
          onClose={handleCloseSites}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseSites}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Browsing Genomic Instances for {consensusRegex} in {experimentID}
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListItemButton>
              <ListItemText primary="Genome Browser" secondary="" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              onClick={handlePopupChange}>
              <ListItemText
                primary="ChIP-seq Peak Motif Sites"
                secondary=""
              />
            </ListItemButton>
            {popupTabsOpen && <ListItem>
              <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px" }}>
                <br />
                <Typography variant="h6" gutterBottom>
                  {`Enter genomic coordinates (${
                      species.toLowerCase() === "human" ? "GRCh38" : "mm10"
                    }):`}
                </Typography>
                <StyledSearchBox>
                    <LargeTextField
                // onKeyDown={(event) => {
                //   if (event.key === "Tab" && !value) {
                //     const defaultGenomicRegion = `chr1:${(100000000).toLocaleString()}-${(100101000).toLocaleString()}`;
                //     setValue(defaultGenomicRegion);
                //   }
                // }}
                // placeholder="Enter a genomic region"
                // onChange={handleChange}
                // id="region-input"
                // value={value}
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
                  >
                    Search
                  </Button>
                <br />
                  <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    example: chr1:100,000,000-100,101,000
                  </Typography>
                </StyledSearchBox>
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
                </Box>
              </ListItem>}
        </List>
        </Dialog>
      </React.Fragment>
    );
  }
  
}