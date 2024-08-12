export type GeneExpressionPageProps = {
    gene_name: string;
    assembly: string;
};

export type GeneExpressionQueryResponse = {
    gene_dataset: {
        accession: string;
        biosample: string;
        biosample_type: string;
        tissue: string;
        gene_quantification_files: {
            accession: string;
            quantifications: {
                tpm?: number;
            }[];
        }[];
    }[];
};

export type GeneIdQueryResponse = {
    gene: {
        id: string;
    }[];
};

import { RefObject } from 'react';

export type LegendProps = {
    x: number;
    y: number;
    width: number;
    fill: string;
    stroke?: string;
    title: string;
    content: { [key: string]: string };
    fontSize: number;
};

export type PlotMenuProps = {
    svgRef: RefObject<SVGSVGElement>;
    fileName: string;
    onDataDownload: () => void;
    study: string;
};

export type TooltipProps = {
    x: number;
    y: number;
    width: number;
    fill: string;
    stroke?: string;
    title: string;
    content: { [key: string]: string };
    fontSize: number;
};
