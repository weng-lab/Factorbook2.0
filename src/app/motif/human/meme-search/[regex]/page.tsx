"use client";

import RegexSearchResults from "@/components/motifsearch/regexsearchresults";
import { Box, Typography, Grid, Breadcrumbs, Button, Divider, useTheme, useMediaQuery, Link } from "@mui/material";
import { useParams } from "next/navigation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const MotifDetails = () => {
    const { regex } = useParams<{ regex: string  }>();
    const decodedRegex = decodeURIComponent(regex || "");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // For mobile devices
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // For tablet devices

    return (
        <Box sx={{ padding: isMobile ? 2 : 4 }}>
            <Typography variant={isMobile ? "h5" : "h4"}>
                Motif search results for {decodedRegex}
            </Typography>

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
                        >
                            Homepage
                        </Link>
                        <Link
                            color="inherit"
                            underline="hover"
                            onClick={() => window.open(`/motif/human/meme-search`, "_self")}
                        >
                            Motif Catalog
                        </Link>
                        <Typography color="textPrimary">{decodedRegex}</Typography>
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

            <Divider sx={{ my: isMobile ? 2 : 4 }} />

            <Box sx={{ padding: isMobile ? 2 : 4 }}>
                <RegexSearchResults regex={regex} />
            </Box>
        </Box>
    );
};

export default MotifDetails