import React, { useState } from "react";
import {
    Box,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import { Clear, ArrowBackIosNewSharp, ArrowForwardIos } from "@mui/icons-material";
import { Motif } from "@/app/motif/human/meme-search/types";

const MotifDrawer = ({
    motifs,
    selectedMotif,
    onMotifSelect,
}: {
    motifs: Motif[];
    selectedMotif: Motif | null;
    onMotifSelect: (motif: Motif) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(true)

    // Filter motifs based on the search query
    const filteredMotifs = motifs.filter((motif) =>
        motif.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box
            sx={{
                width: drawerOpen ? { xs: "100%", sm: "100%", md: "20%" } : "0%",
                height: "100vh", // Respect header/footer
                position: "relative", // Not fixed, part of the layout
                overflowY: "auto", // Allow scrolling of drawer content
                backgroundColor: "white",
                borderRight: "1px solid #ccc",
                transition: "width 0.3s ease", // Smooth transition when opening/closing
            }}
        >
            {!drawerOpen && (
                <Tooltip title="Open Experiment Selection" placement="right">
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            position: "fixed",
                            top: "50%", // Center the button vertically
                            left: 5,
                            transform: "translateY(-50%)", // Adjust centering
                            zIndex: 2000,
                            backgroundColor: "white",
                            boxShadow: 3,
                        }}
                        color="primary"
                    >
                        <ArrowForwardIos />
                    </IconButton>
                </Tooltip>
            )}
            <Box sx={{ padding: "16px", borderBottom: "1px solid #ccc" }}>
                <Stack direction="row" p={1} gap={0.5}>
                    <TextField
                        label="Search Motifs"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearchTerm("")}>
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: "rgba(129, 105, 191, 0.09)",
                                borderRadius: "50px",
                                paddingLeft: "20px",
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#8169BF" },
                            },
                        }}
                    />
                    <Tooltip title="Collapse Motif Selection" placement="top">
                        <IconButton onClick={() => setDrawerOpen(false)} color="primary">
                            <ArrowBackIosNewSharp />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            <List disablePadding>
                {filteredMotifs.map((motif) => (
                    <ListItem
                        key={motif.name}
                        style={{
                            paddingLeft: "30px",
                            cursor: "pointer",
                            backgroundColor:
                                selectedMotif?.name === motif.name
                                    ? "#D3D3D3"
                                    : "transparent", // Change background color if selected
                        }}
                        onClick={() => onMotifSelect(motif)}
                    >
                        <ListItemText primary={motif.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default MotifDrawer;
