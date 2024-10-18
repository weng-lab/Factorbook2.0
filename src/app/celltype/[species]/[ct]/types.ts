
export type CellTypeDescription = {
    ct_image_url?: string;
    wiki_desc?: string;
};

export type Dataset = {
    lab: {
        friendly_name: string;
        name: string;
    };
    accession: string;
    biosample: string;
    replicated_peaks: {
        accession: string;
    }[];
    released: string;
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


export type DatasetMatches = {
    counts: {
        total: number;
    };
    partitionByBiosample: BiosamplePartitionedDatasetCollection[];
};

export type DatasetMatchesWithDetails = DatasetMatches & {
    datasets: Dataset[];
};

export type DatasetMatchesWithTarget = DatasetMatchesWithDetails & {
    partitionByTarget: TargetPartitionedDatasetCollection[];
};

export type DatasetQueryResponse = {
    peakDataset: DatasetMatchesWithTarget;
};
