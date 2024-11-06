import { useContext, useEffect, useState } from 'react';
import { useQuery, QueryResult } from '@apollo/client';
import { ApiContext } from '@/apicontext';
import {
    AggregateMetadataQueryResponse,
    AggregateDataQueryResponse,
    HistoneMetadataQueryResponse,
    ATACAggregateResponse,
    ConservationAggregateResponse,
} from "./types";
import {
    AGGREGATE_METADATA_QUERY,
    AGGREGATE_DATA_QUERY,
    HISTONE_METADATA_QUERY,
    FOOTPRINT_AGGREGATE_QUERY,
} from './queries';

function useApiClient() {
    const context = useContext(ApiContext);
    if (!context || !context.client) {
        throw new Error("ApiContext must be used within a provider and the client must be defined.");
    }
    return context.client;
}

/**
 * Queries metadata for DNase-seq and histone ChIP-seq experiments with aggregate data available.
 * @param assembly the genomic assembly for which to query experiments.
 */
export function useAggregateMetadata(assembly: string, target: string): QueryResult<AggregateMetadataQueryResponse> {
    const client = useApiClient();
    return useQuery<AggregateMetadataQueryResponse>(AGGREGATE_METADATA_QUERY, {
        client,
        variables: { assembly, target },
    });
}

/**
 * Queries aggregate data for a given transcription factor experiment accession.
 * @param accession the accession of the transcription factor experiment.
 */
export function useAggregateData(accession: string): QueryResult<AggregateDataQueryResponse> {
    const client = useApiClient();
    return useQuery<AggregateDataQueryResponse>(AGGREGATE_DATA_QUERY, {
        client,
        variables: { accession },
    });
}

/**
 * Queries aggregate data for a given transcription factor experiment accession.
 * @param accession the accession of the transcription factor experiment.
 */
export function useFootprintAggregateData(peaks_accession: string, motif: string): QueryResult<ATACAggregateResponse> {
    const client = useApiClient();
    return useQuery<ATACAggregateResponse>(FOOTPRINT_AGGREGATE_QUERY, {
        client,
        variables: { peaks_accession, motif },
    });
}

/**
 * Queries aggregate data for a given transcription factor experiment accession.
 * @param accession the accession of the transcription factor experiment.
 */
export function useConservationAggregateData(
    peaks_accession: string,
    motif: string
): { data?: ConservationAggregateResponse, loading: boolean } {
    const [data, setData] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        setData(null);
        fetch(`https://screen-beta-api.wenglab.org/motif_conservation/conservation-aggregate/all/${peaks_accession}-${motif}.sum.npy`)
            .then(x => x.json())
            .then(x => { setData(x.slice(16)); setLoading(false) });
    }, [peaks_accession, motif]);
    return { data: data ? { conservation_aggregate: [{ values: data!, conservation_type: "phyloP 100-way" }] } : undefined, loading };
}

/**
 * Queries metadata for a set of histone ChIP-seq experiment accessions.
 * @param accessions the accessions to query.
 */
export function useHistoneMetadata(
    accessions: string[],
    skip: boolean = false
): QueryResult<HistoneMetadataQueryResponse> {
    const client = useApiClient();
    return useQuery<HistoneMetadataQueryResponse>(HISTONE_METADATA_QUERY, {
        client,
        variables: { accessions },
        skip,
    });
}