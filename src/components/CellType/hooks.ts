import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation'; 
import { ApiContext } from '../../ApiContext';
import { CellTypeDescription, TFInfoQueryResponse } from './types';
import { CELLTYPE_DESCRIPTION_QUERY, TF_INFO_QUERY } from './Queries';
import { includeTargetTypes, excludeTargetTypes } from "./../../consts";

export function useCellTypeDescription(assembly: string, celltype: string) {
    const client = useContext(ApiContext).client;
    return useQuery<{ celltype: CellTypeDescription[] }>(CELLTYPE_DESCRIPTION_QUERY, {
        client,
        variables: {
            assembly,
            name: [celltype],
        },
    });
}

export function useTFInfo() {
    const params = useParams();
    const species = params?.species ?? '';
    const assembly = species === 'human' ? 'GRCh38' : 'mm10';
    const client = useContext(ApiContext).client;
    return useQuery<TFInfoQueryResponse>(TF_INFO_QUERY, {
        client,
        variables: {
            processed_assembly: assembly,
            replicated_peaks: true,
            include_investigatedas: includeTargetTypes,
            exclude_investigatedas: excludeTargetTypes,
        },
    });
}
