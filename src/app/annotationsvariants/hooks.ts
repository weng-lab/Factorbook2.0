import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { associateBy } from 'queryz';
import { ChainFile, Region } from 'liftover';
import { useMemo } from 'react';
import { MINOR_ALLELE_FREQUENCY, SNP_QUERY } from './queries';
import { MinorAlleleFrequencyResponse, SNPQueryResponse } from './types';

type GenomicRange = {
    chromosome?: string;
    start?: number;
    end?: number;
};

const client = new ApolloClient<any>({
    uri: 'https://ga.staging.wenglab.org/graphql',
    cache: new InMemoryCache(),
});
function liftOver(region: GenomicRange, chainFile: ChainFile): GenomicRange[] {
    const l = chainFile.liftOverRegion(new Region(region.chromosome!, region.start!, region.end!));
    return l.map(x => ({
        chromosome: x.chromosome,
        start: x.start,
        end: x.stop,
    }));
}

export function useSNPData(id: string, assembly: string, population?: string, subpopulation?: string, chainFile?: ChainFile) {
    const { data, loading } = useQuery<SNPQueryResponse>(SNP_QUERY, {
        client,
        variables: {
            snpids: id,
            assembly,
            population,
            subpopulation: subpopulation === 'NONE' ? undefined : subpopulation,
        },
        skip: !chainFile,
        errorPolicy: 'ignore',
    });
    const filteredLD = useMemo( () => data?.snpQuery[0]?.linkageDisequilibrium.filter(x => x.snp), [ data ]);
    const coordinates: [ GenomicRange[], number, string ][] = useMemo( () => [
        ...(data?.snpQuery.map((x, i) => [ liftOver(x.coordinates as any as GenomicRange, chainFile!), i, x.id ]) || []),
        ...(filteredLD?.map((x, i) => [ liftOver(x.snp.coordinates as any as GenomicRange, chainFile!), i, x.snp.id ]) || [])
    ] as [ GenomicRange[], number, string ][], [ data, filteredLD ]);
    const coordinateMap = useMemo( () => coordinates && associateBy(coordinates, x => `${x[0][0].chromosome}:${x[0][0].end}`, x => x[2]), [ data, coordinates, filteredLD ]);
    const { data: snpData } = useQuery<MinorAlleleFrequencyResponse>(MINOR_ALLELE_FREQUENCY, {
        skip: loading || !coordinates,
        variables: {
            positions: coordinates?.filter(x => x.length > 0).map(x => ({ chromosome: x[0][0].chromosome!, position: x[0][0].end }))
        },
        client
    });
    const mafResults = useMemo( () => coordinateMap && snpData && (
        associateBy(snpData.maf, x => coordinateMap!.get(`${x.position.chromosome}:${x.position.position}`), x => ({
            ...x,
            refFrequency: 1.0 - x.minorAlleles.reduce((x, c) => x + c.frequency, 0)
        }))
    ), [ coordinateMap, snpData ]);
    return { data, loading, mafResults };
}