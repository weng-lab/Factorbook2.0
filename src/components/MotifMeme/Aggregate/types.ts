import React from 'react';
import { BiosamplePartitionedDatasetCollection } from "@/components/Types";

export interface AggregateMetadataQueryResponse {
    dnase_aggregate_values: {
        peaks_dataset_accession: string;
        dnase_dataset_accession: string;
    }[];
    histone_aggregate_values: {
        peaks_dataset_accession: string;
        histone_dataset_accession: string;
    }[];
    peakDataset: {
        datasets: TFDataset[];
    };
}

export interface TFDataset {
    accession: string;
    biosample: string;
}

export interface HistoneAggregateValue {
    histone_dataset_accession: string;
    distal_values: number[];
    proximal_values: number[];
}

export type ATACAggregateResponse = {
    atac_aggregate: {
        forward_values: number[];
        reverse_values: number[];
    }[];
    dnase_aggregate: {
        forward_values: number[];
        reverse_values: number[];
    }[];
};

export type ConservationAggregateResponse = {
    conservation_aggregate: {
        values: number[];
        conservation_type: string;
    }[];
};

export interface AggregateDataQueryResponse {
    histone_aggregate_values: HistoneAggregateValue[];
}

export interface HistoneMetadataQueryResponse {
    peakDataset: {
        datasets: HistoneDatasetMetadata[];
    };
}

export interface HistoneDatasetMetadata {
    accession: string;
    target: string;
}

export type HistoneAggregatePageProps = {
    assembly: string;
    target: string;
};

export type MappedDatasetCollection = {
    list: BiosamplePartitionedDatasetCollection[];
    biosampleMap: { [accession: string]: string };
    accessionMap: { [biosample: string]: string };
};

export type PlotPageProps = {
    metadata: MappedDatasetCollection;
    type: string;
};

export type GraphSetProps = {
    tfAccession: string;
};

export type AxisProps = {
    fontSize: number;
    title: string;
};

export type GraphProps = {
    proximal_values: number[];
    distal_values: number[];
    dataset: HistoneDatasetMetadata;
    is_forward_reverse?: boolean;
    title?: string;
    limit?: number;
    xlabel?: string;
    ylabel?: string;
    height?: number;
    width?: number;
    yMax?: number;
    padBottom?: boolean;
    hideTitle?: boolean;
    sref?: React.RefObject<SVGSVGElement> | ((e: any) => void);
    lref?: React.RefObject<SVGSVGElement> | ((e: any) => void);
    is_stranded_motif?: boolean;
    yMin?: number;
    semiTransparent?: boolean;
    xAxisProps?: AxisProps;  // Add xAxisProps
    yAxisProps?: AxisProps;  // Add yAxisProps
};


export type AggregateGroups = {
    [key: string]: {
        [key: string]: HistoneAggregateValue;
    };
};

export type CollapsibleGraphsetProps = {
    title: string;
    graphs: GraphProps[];
};
