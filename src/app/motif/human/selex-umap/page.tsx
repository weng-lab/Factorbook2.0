"use client";

import dynamic from "next/dynamic";

const MotifUMAP = dynamic(() => import("@/components/motifsearch/umap"), { ssr: false });

const SelexUmapPage = () => {
    return (
        <MotifUMAP key="selex" title="selex" url="/ht-selex-umap.json.gz" />
    );
};

export default SelexUmapPage;
