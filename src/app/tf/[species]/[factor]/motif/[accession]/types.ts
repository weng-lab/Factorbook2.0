export type GenomicRange = {
    chromosome?: string;
    start?: number;
    end?: number;
};

export type SearchBoxProps = {
    assembly: string;
    onSearchSubmit: (domain: string, name?: string, isSnp?: boolean) => void;
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