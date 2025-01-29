"use client";

import MotifUMAP from "@/components/motifsearch/umap";

const MemeUmapPage = () => {
    return (
        <MotifUMAP key="meme" title="meme" url="/human-meme-umap.json.gz" />
    );
};

export default MemeUmapPage;
