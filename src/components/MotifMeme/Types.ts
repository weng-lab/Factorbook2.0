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
  
  export type Dataset = {
    lab: {
      friendly_name: string;
    };
    accession: string;
  };
  
  export type MotifResponse = {
    meme_motifs: {
      consensus_regex: string;
      pwm: string;
      sites: number;
      e_value: number;
      original_peaks_occurrences: number;
      original_peaks: string;
      flank_occurrences_ratio: number;
      flank_z_score: number;
      flank_p_value: number;
      shuffled_occurrences_ratio: number;
      shuffled_z_score: number;
      shuffled_p_value: number;
      peak_centrality: number;
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
  