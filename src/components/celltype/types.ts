import { BiosamplePartitionedDatasetCollection } from '../types';

export type CtDetailProps = {
  species: string;
  celltype: string;
  hideFactorCounts?: boolean;  // Optional prop
  row?: any; 
}

export type CellTypeDescription = {
    ct_image_url?: string;
    wiki_desc?: string;
};

export interface SummaryProps {
    assembly: string;
    species: string;
    celltype?: string; 
  }  

export type Dataset = {
    lab: {
        friendly_name: string;
        name: string;
    };
    accession: string;
    target: string;
    replicated_peaks: {
        accession: string;
    }[];
};

export type DatasetQueryResponse = {
  peakDataset: {
    datasets: Dataset[];
    partitionByTarget: {
      target: {
        name: string;
      };
      counts: {
        total: number;
        biosamples: number;
      };
    }[];
    counts: {
      total: number;
    };
    partitionByBiosample: {
      biosample: {
        name: string;
      };
      counts: {
        targets: number;
        total: number;
      };
    }[];
  };
};

export type FunctionPageProps = {
  factor: string;
  assembly: "GRCh38" | "mm10";
};

export type TFInfoQueryResponse = {
    peakDataset: {
        counts: {
            biosamples: number;
            targets: number;
            total: number;
        };
        partitionByTarget: TargetPartitionedDatasetCollection[];
        partitionByBiosample: BiosamplePartitionedDatasetCollection[];
    };
};

export type FactorData = {
    name: string;
    gene_id?: string;
    coordinates?: {
        start: number;
        end: number;
        chromosome: string;
    };
    pdbids?: string;
    modifications?: {
        symbol: string;
        modification: {
            position: number;
            modification: string;
            amino_acid_code: string;
        };
    };
    ensemble_data?: {
        id: string;
        biotype: string;
        description: string;
        display_name: string;
        hgnc_synonyms: string[];
        hgnc_primary_id: string;
        uniprot_synonyms: string[];
        uniprot_primary_id: string;
        version: string;
        ccds_id: string[];
    };
    hgnc_data?: {
        hgnc_id: string;
        symbol: string;
        name: string;
        uniprot_ids: string[];
        locus_type: string;
        locus_group: string;
        location: string;
        prev_name: string;
        gene_group: string;
        gene_group_id: string;
        ccds_id: string;
    };
    uniprot_data?: string;
    ncbi_data?: string;
    factor_wiki?: string;
    peaks_accession?: string[];
};

export type FactorQueryResponse = {
    factor: FactorData[];
};

export type TargetPartitionedDatasetCollection = {
    target: {
        name: string;
    };
    counts: {
        total: number;
        biosamples: number;
    };
    datasets?: Dataset[];
};

export type FactorRow = {
    image?: string;
    label?: string;
    name: string;
    experiments: number;
    cellTypes: number;
    description?: string;
  };