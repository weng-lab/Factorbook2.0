import React, { useState } from "react";
import {
    Box,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    TextField,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
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

    // Filter motifs based on the search query
    const filteredMotifs = motifs.filter((motif) =>
        motif.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "100%", md: "20%" },
                height: "100vh", // Respect header/footer
                position: "relative", // Not fixed, part of the layout
                overflowY: "auto", // Allow scrolling of drawer content
                paddingRight: { md: "10px" },
                backgroundColor: "white",
                borderRight: "1px solid #ccc",
            }}
        >
            {/* Search Bar */}
            <Box sx={{ padding: "16px", borderBottom: "1px solid #ccc" }}>
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
            </Box>

            {/* Motif List */}
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
