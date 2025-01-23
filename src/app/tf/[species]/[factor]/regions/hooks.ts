import { useContext, useEffect, useState, useCallback } from 'react';
import { MOTIFS_QUERY } from '../queries';
import { MotifQueryDataOccurrence, MotifQueryData } from '../types';

import { ApiContext } from "@/apicontext";
type Range = { chromosome: string; start: number; end: number };
export function splitRange(range: Range, size: number): Range[] {
    const regions: Range[] = [];
    for (let i = Math.floor(range.start / size) * size; i < Math.ceil(range.end / size) * size; i += size) {
        regions.push({ chromosome: range.chromosome, start: i, end: i + size });
    }
    return regions;
}
const useAsync = <Data>(asyncFunction: () => Promise<Data>, immediate = true) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [value, setValue] = useState<Data | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(() => {
        setStatus('pending');
        setValue(null);
        setError(null);

        return asyncFunction()
            .then(response => {
                setValue(response);
                setStatus('success');
            })
            .catch(error => {
                setError(error);
                setStatus('error');
            });
    }, [asyncFunction]);

    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, value, error };
};


type MotifsResult = {
    status: 'pending' | 'error' | 'success';
    data: MotifQueryDataOccurrence[] | null;
    error: Error | null;
};
export function useMotifsInPeak(genomic_region: Range): MotifsResult {
    const client = (useContext(ApiContext) as any).client as any;
    

    const queries = useCallback(
        () =>
            Promise.all(
                splitRange(genomic_region, 200).map((genomic_region: any) =>
                    client.query({
                        query: MOTIFS_QUERY,
                        variables: { genomic_region },
                    }) as any
                )
            ),
        // eslint-disable-next-line
        [client, genomic_region.chromosome, genomic_region.start, genomic_region.end]
    );
    const { error, value } = useAsync(queries);

    if (error !== null) {
        return { status: 'error', error, data: null };
    }

    const firstError = value?.find(v => !!v.error);
    if (!!firstError) {
        const error = firstError.error!!;
        return { status: 'error', error, data: null };
    }

    const allData = value?.flatMap(v => v.data.meme_occurrences);
    if (!allData) {
        return { status: 'pending', error: null, data: null };
    }

    const overlaps = (first: Range, second: Range) => second.start < first.end && second.end > first.start;
    const occurrences = allData
        .filter(occurrence => !!occurrence.motif) // Currently, metadata is missing which makes motifs be null
        .filter(occurrence => overlaps(genomic_region, occurrence.genomic_region))
        .filter(occurrence => {
            const poorCentrality = occurrence.motif.flank_z_score < 0 || occurrence.motif.flank_p_value > 0.05;
            const poorPeakEnrichment =
                occurrence.motif.shuffled_z_score < 0 || occurrence.motif.shuffled_p_value > 0.05;
            return !poorCentrality && !poorPeakEnrichment;
        });

    return { status: 'success', error: null, data: occurrences };
}
