"use client";

import { Box, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MotifLayout({ children }: { children: React.ReactNode }) {
    const [searchURL, setSearchURL] = useState<string>("/motif/human/meme-search")
    const tab = usePathname().split('/')[3];

    //Change the url of motif search based on storage
    useEffect(() => {
        const motifSearchData = sessionStorage.getItem("motifSearch");

        if (motifSearchData) {
            const parsedData = JSON.parse(motifSearchData);
            //if this prop exists, that means a file has been uploaded recently, so set the url to fileupload
            if (parsedData.motifs !== undefined) {
                setSearchURL("/motif/human/meme-search/fileupload")
            } else {
                //if it doesnt exist but something is in storage under the key "motifSearch" then its a regular expression
                setSearchURL(`/motif/human/meme-search/${parsedData}`)
            }
        } else {
            //otherwise, go back to base search page
            setSearchURL("/motif/human/meme-search")
        }
    }, [])

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
                        href={searchURL}
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
