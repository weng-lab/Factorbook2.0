/**
 * hooks.ts: hooks related to genome browser navigation.
 */

import React from 'react';

import { GenomicRange } from "./types";
import { RESOLVE_QUERY } from "./queries";

export async function fetchGenomicObject(id: string, assembly: string): Promise<GenomicRange | null> {
    return fetch('https://ga.staging.wenglab.org/graphql', {
        method: 'POST',
        body: JSON.stringify({
            query: RESOLVE_QUERY,
            variables: { id: id.toLocaleUpperCase(), assembly }
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(result => {
            const r = result && result.data && result.data.resolve && result.data.resolve[0];
            return r ? r.coordinates : null;
        });
}

export function useGenomicObject(id: string, assembly: string): GenomicRange | null {
    const [object, setObject] = React.useState<GenomicRange | null>(null);
    React.useEffect(() => {
        fetchGenomicObject(id, assembly).then(setObject);
    }, [id, assembly]);
    return object;
}