export type GenomicRange = {
    chromosome?: string;
    start?: number;
    end?: number;
};

type Domain = {
    chromosome?: string;
    start: number;
    end: number;
}

export type SearchBoxProps = {
    assembly: string;
    onSearchSubmit: (domain: Domain) => void;
};


export type RefSeqSearchBoxProps = {
    assembly: string;
    onSearchSubmit: (domain: string) => void;
};

export type Result = {
    title?: string;
    description: string;
    type?: string;
};