import { MutableRefObject } from "react";

export type Data = {
    selex_round: number;
    ppm: number[][];
    fractional_enrichment: number;
    roc_curve: number[][];
    selex?: any;
}[];

export type PlotProps = {
    data: Data;
    downloadSVGElement: (ref: MutableRefObject<SVGSVGElement | null>, filename: string) => void;
}