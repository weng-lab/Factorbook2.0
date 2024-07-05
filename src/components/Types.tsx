export type GenomicRange = {
  chromosome?: string;
  start?: number;
  end?: number;
};

export type Region = {
  chrom: string;
  chrom_start: number;
  chrom_end: number;
};

export type Dataset = {
  lab: {
    friendly_name: string;
    name: string;
  };
  accession: string;
  replicated_peaks: {
    accession: string;
  }[];
};

export type BiosamplePartitionedDatasetCollection = {
  biosample: {
    name: string;
  };
  counts: {
    total: number;
    targets: number;
  };
  datasets?: Dataset[];
};
