"use client";

import { useEffect, useState } from "react";
import { Box, Breadcrumbs, Button, Divider, Grid, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import RegexSearchResults from "@/components/motifsearch/regexsearchresults";
import { Motif } from "../types";
import MotifDrawer from "@/components/motifsearch/motiffileuploaddrawer";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const FileUploadMotifDetails = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // For mobile devices
    
    const [uniqueMotifs, setUniqueMotifs] = useState<Motif[]>([]);
    const [filename, setFileName] = useState<string>("");
    const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);

    useEffect(() => {
        // Access sessionStorage only on the client side
        const fileData = sessionStorage.getItem("motifSearch");
        if (fileData) {
            const parsedData = JSON.parse(fileData) as { name: string; motifs: Motif[] };
            //if no file was uploaded but the last search was for an expression, redirect back to the main search
            if (parsedData.motifs === undefined) {
                window.open(`/motif/human/meme-search/`, "_self");
            } else {
                setFileName(parsedData.name)

                // Deduplicate motifs by name
                const seenNames = new Set<string>();
                const deduplicatedMotifs = parsedData.motifs.filter((motif) => {
                    if (!seenNames.has(motif.name)) {
                        seenNames.add(motif.name);
                        return true;
                    }
                    return false;
                });

                // Set deduplicated motifs and default selection
                setUniqueMotifs(deduplicatedMotifs);
                if (deduplicatedMotifs.length > 0) {
                    setSelectedMotif(deduplicatedMotifs[0]); // Default to the first motif
                }
            }
        } else {
            //if no file was uploaded redirect back to the main search
            window.open(`/motif/human/meme-search/`, "_self");
        }
    }, []);

    // Function to handle motif selection
    const handleMotifSelect = (motif: Motif) => {
        setSelectedMotif(motif);
    };

    return (
        <Box sx={{ padding: isMobile ? 2 : 4 }}>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: isMobile ? 2 : 4 }}
            >
                <Grid item>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={<NavigateNextIcon fontSize="small" />}
                        sx={{ mb: 2 }}
                        style={{ margin: "3px" }}
                    >
                        <Link
                            color="inherit"
                            underline="hover"
                            onClick={() => (window.location.href = `/`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            Homepage
                        </Link>
                        <Link
                            color="inherit"
                            underline="hover"
                            onClick={() => window.open(`/motif/human/meme-search`, "_self")}
                            sx={{ cursor: 'pointer' }}
                        >
                            Motif Catalog
                        </Link>
                        <Typography color="textPrimary">{filename}</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item>
                    <Button
                        onClick={() => {
                            window.open("/motif/human/meme-search", "_self");
                        }}
                        variant="contained"
                        color="secondary"
                        sx={{
                            width: isMobile ? "160px" : "220px",
                            height: isMobile ? "36px" : "41px",
                            padding: isMobile ? "6px 16px" : "8px 24px",
                            borderRadius: "24px",
                            backgroundColor: "#8169BF",
                            color: "white",
                            fontSize: isMobile ? "13px" : "15px",
                            fontWeight: 500,
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
            <Divider sx={{ my: isMobile ? 2 : 4 }}/>
            {uniqueMotifs.length > 0 ? (
                <div style={{ display: "flex" }}>
                    <MotifDrawer
                        motifs={uniqueMotifs}
                        selectedMotif={selectedMotif}
                        onMotifSelect={handleMotifSelect}
                    />
                    <div style={{ flexGrow: 1, padding: "1rem" }}>
                        {selectedMotif && <RegexSearchResults pwm={selectedMotif.pwm} />}
                    </div>
                </div>
            ) : (
                <Typography>No file data found.</Typography>
            )}
        </Box>
    );
};

export default FileUploadMotifDetails;
