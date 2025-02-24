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
    title: string;
    // onPageChane: (event: React.ChangeEvent<unknown>, value: number) => void;
};

export type MotifTableRow = {
    distance: number;
    motif: ReactElement;
    info: ReactElement;
    match: ReactElement;
};

// Define MetaData to include `tooltipValues` and `pwm` properties
export interface MetaData {
    tooltipValues?: {
      accession: string;
      dbd: string;
      factor: string;
    };
    pwm: { A: number; C: number; G: number; T: number }[];
    sites?: number;
    e?: number;
    coordinates?: [number, number];
    color?: string;
  }