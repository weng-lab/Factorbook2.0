"use client";

import dynamic from "next/dynamic";

const MotifUMAP = dynamic(() => import("@/components/motifsearch/umap"), { ssr: false });

const MemeUmapPage = () => {
    return (
        <MotifUMAP key="meme" title="meme" url="/human-meme-umap.json.gz" />
    );
};

export default MemeUmapPage;
