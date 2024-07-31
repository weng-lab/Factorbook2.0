"use client";

import { ApiContext } from "@/ApiContext";
import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GENE_EXPRESSION_QUERY, GENE_ID_QUERY } from './Queries';
import { GeneExpressionQueryResponse, GeneIdQueryResponse } from './types';

export function useGeneExpressionData(assembly: string, gene_name: string, assay_term_name: string) {
    const apiContext = useContext(ApiContext);

    if (!apiContext || !apiContext.client) {
        throw new Error("ApiContext client is not defined");
    }

    const client = apiContext.client;

    const { data, loading } = useQuery<GeneIdQueryResponse>(GENE_ID_QUERY, {
        client,
        variables: {
            gene_name,
            assembly,
        },
    });

    const geneId = data?.gene?.[0]?.id?.split('.')[0] || '';

    return useQuery<GeneExpressionQueryResponse>(GENE_EXPRESSION_QUERY, {
        client,
        variables: {
            gene_id: geneId,
            assembly,
            assay_term_name,
        },
        skip: loading || !data || !geneId,
    });
}
