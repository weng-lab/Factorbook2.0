export type TOMTOMMatch = {
    e_value: number;
    target_id: string;
    sites: number;
    jaspar_name?: string;
    motifid: string;
};

export type GenomicRange = {
    chromosome?: string;
    start?: number;
    end?: number;
};

export type ParsedMotifFile = {
    file: File;
    motifs?: ParsedMotif[];
    error?: any;
};

export type ParsedMotif = {
    pwm: number[][];
    name: string;
};

export type SNPAutocompleteSearchBoxProps = {
    onSearchEnter: (snp: string) => void;
    assembly: string;
};

export type MinorAlleleFrequencyResponse = {
    maf: {
        snp: string;
        refAllele: string;
        position: {
            chromosome: string;
            position: number;
        };
        minorAlleles: (MinorAlleleFrequency & {
            frequency: number;
        })[];
    }[];
};

export type MinorAlleleFrequency = {
    sequence: string;
    afr_af: number;
    amr_af: number;
    eas_af: number;
    eur_af: number;
    sas_af: number;
};

export interface SNP {
    rSquared?: number;
    refAllele: string;
    refFrequency: number;
    id: string;
    minorAlleleFrequency: (MinorAlleleFrequency & { frequency: number })[];
    coordinates: GenomicRange;
}

export interface QuerySNP extends SNP {
    linkageDisequilibrium: {
        snp: SNP;
        rSquared: number;
    }[];
}

export type SNPQueryResponse = {
    snpQuery: QuerySNP[];
};

export type AutocompleteSNPQueryResponse = {
    snpAutocompleteQuery: SNP[];
};

export type IntersectionViewProps = {
    snps: SNP[];
    assembly: string;
    rdhs?: boolean;
};

export type PeakQueryResponse = {
    peaks: { peaks: Peak[] };
};

export interface Peak {
    q_value: number;
    experiment_accession: string;
    file_accession: string;
    dataset: {
        target: string;
        biosample: string;
    };
    chrom: string;
    chrom_start: number;
    chrom_end: number;
}

export interface PeakWithSNP extends Peak {
    snp: SNP;
}

export type PeakIntersectionMergerProps = IntersectionViewProps & {
    onResultsReceived: (peaks: PeakWithSNP[]) => void;
};

export type MotifIntersectionMergerProps = IntersectionViewProps & {
    onResultsReceived: (peaks: MotifOccurrenceMatchWithSNP[]) => void;
};

export interface SNPWithPeakCount extends SNP {
    peakCount: number;
    factorCount: number;
}

export interface SNPWithMotifCount extends SNP {
    motifCount: number;
}

export interface MotifOccurrenceMatch {
    motif: {
        pwm: number[][];
        peaks_file: {
            assembly: string;
            accession: string;
            dataset_accession: string;
        };
        tomtom_matches: TOMTOMMatch[];
        shuffled_p_value: number;
        flank_p_value: number;
    };
    q_value?: number;
    rdhs?: string;
    p_value?: number;
    strand: string;
    genomic_region: GenomicRange;
}

export interface MotifOccurrenceMatchWithSNP extends MotifOccurrenceMatch {
    snp: SNP;
}

export type MotifOccurrenceQueryResponse = {
    meme_occurrences: MotifOccurrenceMatch[];
};
export type OccurrenceQueryResponse = RdhsOccurrenceQueryResponse | MotifOccurrenceQueryResponse;
export type RdhsOccurrenceQueryResponse = {
    rdhs_motif_occurrences: RdhsOccurrenceMatch[];
};
export interface RdhsOccurrenceMatch {
    motif: {
        pwm: number[][];
        peaks_file: {
            assembly: string;
            accession: string;
            dataset_accession: string;
        };
        tomtom_matches: TOMTOMMatch[];
        shuffled_p_value: number;
        flank_p_value: number;
    };
    p_value: number;
    rdhs: string;
    strand: string;
    genomic_region: GenomicRange;
}
export type AnnotatedLogoProps = {
    pwm: number[][];
    motifCoordinates: GenomicRange;
    snpCoordinates: GenomicRange;
    refAllele: string;
    refFrequency: number;
    strand: string;
    minorAlleles: {
        sequence: string;
        frequency: number;
    }[];
};