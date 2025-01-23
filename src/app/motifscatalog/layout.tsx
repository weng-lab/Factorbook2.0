"use client";

import { Box, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MotifLayout({ children }: { children: React.ReactNode }) {
    // const [value, setValue] = React.useState(0);
    const tab = usePathname().split('/')[3];

    // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setValue(newValue);
    //     switch (newValue) {
    //         case 0:
    //             window.history.pushState({}, "", "/motifscatalog/human/meme-search");
    //             break;
    //         case 1:
    //             window.history.pushState({}, "", "/motifscatalog/human/meme-umap");
    //             break;
    //         case 2:
    //             window.history.pushState({}, "", "/motifscatalog/human/selex-umap");
    //             break;
    //         case 3:
    //             window.history.pushState({}, "", "/motifscatalog/human/downloads");
    //             break;
    //         default:
    //             window.history.pushState({}, "", "/motifscatalog");
    //             break;
    //     }
    // };

    return (
        <section>
            <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 4 }}>
                <Tabs
                    value={tab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="full width tabs example"
                    variant="fullWidth"
                    centered
                >
                    <Tab
                        label="Motif Search"
                        value="meme-search"
                        component={Link}
                        href="/motifscatalog/human/meme-search"
                    />
                    <Tab
                        label="MEME Motif UMAP"
                        value="meme-umap"
                        component={Link}
                        href="/motifscatalog/human/meme-umap"
                    />
                    <Tab
                        label="HT SELEX Motif UMAP"
                        value="selex-umap"
                        component={Link}
                        href="/motifscatalog/human/selex-umap"
                    />
                    <Tab
                        label="Downloads"
                        value="downloads"
                        component={Link}
                        href="/motifscatalog/human/downloads"
                    />
                </Tabs>
            </Box>
            {children}
        </section>
    )
}
