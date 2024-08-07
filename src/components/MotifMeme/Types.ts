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

export type BiosamplePartition = {
    biosample: {
        name: string;
    };
    counts: {
        total: number;
        targets: number;
    };
    datasets: Dataset[];
};

export type PeakDataset = {
    partitionByBiosample: BiosamplePartition[];
};

export type DataResponse = {
    peakDataset: PeakDataset;
};
