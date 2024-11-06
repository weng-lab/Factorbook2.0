export type TOMTOMMatch = {
    e_value: number;
    target_id: string;
    sites: number;
    jaspar_name?: string;
    motifid: string;
};

export type TOMTOMMessageProps = {
    tomtomMatch?: TOMTOMMatch;
};
