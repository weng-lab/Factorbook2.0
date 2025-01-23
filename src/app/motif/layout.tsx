"use client";

import { Box, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MotifLayout({ children }: { children: React.ReactNode }) {
    const tab = usePathname().split('/')[3];

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
                        href="/motif/human/meme-search"
                    />
                    <Tab
                        label="MEME Motif UMAP"
                        value="meme-umap"
                        component={Link}
                        href="/motif/human/meme-umap"
                    />
                    <Tab
                        label="HT SELEX Motif UMAP"
                        value="selex-umap"
                        component={Link}
                        href="/motif/human/selex-umap"
                    />
                    <Tab
                        label="Downloads"
                        value="downloads"
                        component={Link}
                        href="/motif/human/downloads"
                    />
                </Tabs>
            </Box>
            {children}
        </section>
    )
}
