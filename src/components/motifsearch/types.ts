import { ReactElement, ReactNode } from "react";

export type TOMTOMMatch = {
    e_value: number;
    target_id: string;
    sites: number;
    jaspar_name?: string;
    motifid: string;
};

export type MotifSearchResult = {
    motif: {
        pwm: number[][];
        peaks_accession: string;
        tomtom_matches: TOMTOMMatch[];
    };
    distance: number;
    offset: number;
    reverseComplement: boolean;
};

export type MotifResultProps = {
    query: number[][];
    alignment: MotifSearchResult;
};

export type MotifInfoProps = {
    target: string;
    biosample: string;
    labName: string;
    accession: string
};

export type MotifMatchProps = {
    tomtom_match: TOMTOMMatch;
}

export type MotifTableProps = {
    motifRows: MotifTableRow[];
    // onPageChane: (event: React.ChangeEvent<unknown>, value: number) => void;
};

export type MotifTableRow = {
    distance: number;
    motif: ReactElement;
    info: ReactElement;
    match: ReactElement;
};