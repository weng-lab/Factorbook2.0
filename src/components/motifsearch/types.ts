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
    peak_accession: string;
    species: string;
    tomtom_match?: TOMTOMMatch;
};

