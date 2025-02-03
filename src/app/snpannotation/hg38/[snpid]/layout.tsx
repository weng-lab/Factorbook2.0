"use client";

import { Box, Breadcrumbs, Button, Divider, Grid, Typography, Link, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export default function SnpLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const snpid = usePathname().split('/')[3];

    return (
        <section>
            <Box sx={{ paddingX: isMobile ? 2 : isTablet ? 3 : 4, paddingTop: isMobile ? 2 : isTablet ? 3 : 4 }}>
                <Typography variant={isMobile ? "h5" : "h4"}>
                    Annotations for {snpid}
                </Typography>

                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ marginTop: isMobile ? 1 : 2 }}
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
                                onClick={() => window.open("/snpannotation", "_self")}
                                sx={{ cursor: 'pointer' }}
                            >
                                Annotations
                            </Link>
                            <Typography color="textPrimary">{snpid}</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={() => {
                                window.open("/snpannotation", "_self")
                            }}
                            variant="contained"
                            color="secondary"
                            sx={{
                                width: isMobile ? "160px" : "220px",
                                height: "41px",
                                padding: "8px 24px",
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
            </Box>
            {children}
        </section>
    )
}
