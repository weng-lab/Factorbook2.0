import { GenomicRange } from "../types";

export type ReplicatedPeaks = {
  accession: string;
};

export type Dataset = {
  replicated_peaks: ReplicatedPeaks[];
  lab: {
    friendly_name: string;
  };
  accession: string;
};

export type DataResponse = {
  peakDataset: {
    partitionByBiosample: BiosamplePartition[];
  };
};

export type BiosamplePartition = {
  biosample: {
    name: string;
  };
  counts: {
    total: number;
  };
  datasets: Dataset[];
};

export type MotifResponse = {
  meme_motifs: {
    atac_data: boolean;
    tomtomMatch: any;
    consensus_regex: string;
    pwm: number[][];
    e_value: number;
    original_peaks_occurrences: number;
    original_peaks: number;
    flank_occurrences_ratio: number;
    flank_z_score: number;
    flank_p_value: number;
    shuffled_occurrences_ratio: number;
    shuffled_z_score: number;
    shuffled_p_value: number;
    peak_centrality: { [key: string]: number };
    id: string;
    name: string;
  }[];
  target_motifs: {
    e_value: number;
    target_id: string;
    sites: number;
    jaspar_name: string;
    motifid: string;
  }[];
};

export type MotifQueryResponse = {
  meme_motifs: MemeMotif[];
  target_motifs: TOMTOMMatch[];
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

export type TOMTOMMatch = {
  e_value: number;
  target_id: string;
  sites: number;
  jaspar_name?: string;
  motifid: string;
};

export type GraphDataset = {
  title: string;
  forward_values: number[];
  reverse_values?: number[];
  color: string;
};

export type CentralityPlotProps = {
  peak_centrality: { [key: string]: number };
};

export type TOMTOMMessageProps = {
  tomtomMatch?: TOMTOMMatch;
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
  meme_occurrences: MemeMotifOccurrence[];
};

export type DownloadMemeOccurrencesProps = {
  peaks_accession: string;
  consensus_regex: string;
  genomic_region?: GenomicRange[];
  onComplete: () => void;
  onError: (error: any) => void;
  streamMemeOccurrencesService: string;
};

export type BatchResponse = {
  memeoccurrences: MemeMotifOccurrence[];
  progress: number;
};