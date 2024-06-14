import { TargetPartitionedDatasetCollection, BiosamplePartitionedDatasetCollection } from '../../components/Types';

export type CtDetailProps = {
    celltype: string;
    species: string;
    row: BiosamplePartitionedDatasetCollection;
    hideFactorCounts?: boolean;
};

export type CellTypeDescription = {
    ct_image_url?: string;
    wiki_desc?: string;
};

export type SummaryProps = {
    assembly: string;
    species: string;
    celltype: string;
};

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
    };
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
