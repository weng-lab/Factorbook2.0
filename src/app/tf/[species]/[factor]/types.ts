import { BiosamplePartitionedDatasetCollection, GenomicRange } from "@/components/types"


export type PeakQueryResponse = {
    peaksrange: {
        data: PeakResult[];
        error?: {
            message?: string;
            errortype?: string;
        };
    };
  };
  
  export type PeakResult = {
    chrom: string;
    chrom_start: number;
    chrom_end: number;
    target: string;
    biosample: string;
    q_value: number;
    p_value?: number;
    experiment_accession?: string;
    file_accession: string;
  };
type TOMTOMMatch = {
    e_value: number;
    jaspar_name?: string | null;
    target_id: string;
  };
  
  
  export type TomtomMatchQueryData = {
      target_motifs: TOMTOMMatch[];
  };

export type MotifQueryDataOccurrence = {
    peaks_accession: string;
    consensus_regex: string;
    q_value: number;
    genomic_region: {
        chromosome: string;
        start: number;
        end: number;
    };
    motif: MotifQueryDataOccurrenceMotif;
};

export type MotifQueryDataOccurrenceMotif = {
    id: string;
    pwm: number[][];
    flank_z_score: number;
    flank_p_value: number;
    shuffled_z_score: number;
    shuffled_p_value: number;
};

export type MotifQueryData = {
    meme_occurrences: MotifQueryDataOccurrence[];
};

export type CentralityPlotProps = {
    peak_centrality: { [key: string]: number };
};

export type MotifEnrichmentProps = {
    data: BiosamplePartitionedDatasetCollection[];
    factor: string;
    methyl?: boolean;
    sequenceSpecific?: boolean;
};

export type MemeMotif = {
    consensus_regex: string;
    pwm: number[][];
    sites: number;
    e_value: number;
    original_peaks: number;
    original_peaks_occurrences: number;
    flank_occurrences_ratio: number;
    flank_z_score: number;
    flank_p_value: number;
    shuffled_occurrences_ratio: number;
    shuffled_z_score: number;
    shuffled_p_value: number;
    background_frequencies?: number[];
    peak_centrality: { [key: string]: number };
    id: string;
    name: string;
};

export type MotifQueryResponse = {
    meme_motifs: MemeMotif[];
    target_motifs: TOMTOMMatch[];
};

export type DeepLearnedMotifOccurrencesResponse = {
    deep_learned_motif_peak_occurrences: DeepLearnedMotifOccurrence[];
};

export type DeepLearnedMotifOccurrence = {
    genomic_region: {
        chromosome: string;
        start: number;
        end: number;
    };
    tf: string;
    sequence: string;
    rdhs: string;
    score: number;
    name: string;
    strand: string;
    number_of_datasets_instance_found_in: number;
    number_of_celltypes_instance_found_in: number;
    annotation: string;
    class_of_transposable_element: string;
};
export type DeepLearnedMotifsQueryResponse = {
    deep_learned_motifs: {
        tf: string;
        ppm: number[][];
        total_number_of_datasets_instance_found_in?: number;
        total_number_of_celltypes_instance_found_in?: number;
        consensus_regex?: string;
    }[];
};

export type DeepLearnedSELEXMotifsQueryResponse = {
    deep_learned_motifs: {
        selex_round: number;
        ppm: number[][];
        roc_curve: number[][];
        au_roc: number;
        fractional_enrichment: number;
    }[];
};

export type DeepLearnedSELEXMotifsMetadataQueryResponse = {
    deep_learned_motifs: {
        selex_round: number;
        assay: string;
        source: string;
        protein_type: string;
        tf: string;
    }[];
};

export interface MemeMotifOccurrence {
    peaks_accession: string;
    consensus_regex: string;
    genomic_region: {
        chromosome: string;
        start: number;
        end: number;
    };
    strand: string;
    q_value: number;
    methyl: boolean;
}

export type MemeMotifOccurrenceResponse = {
    meme_occurrences: MemeMotifOccurrence[]
}

export type DownloadMemeOccurrencesProps = {
    peaks_accession: string;
    consensus_regex: string;
    genomic_region?: GenomicRange[]
    onComplete: () => void;
    onError: (error: any) => void;
    streamMemeOccurrencesService: string;
};

export type BatchResponse = {
    memeoccurrences: MemeMotifOccurrence[];
    progress: number;
};