import React, { useState, useCallback, useEffect } from 'react';
import { GENE_AUTOCOMPLETE_QUERY, SNP_AUTOCOMPLETE_QUERY } from './queries';
import { uniq, isCoordinate } from './utils';
import { SearchBoxProps, Result } from './types';
import { fetchGenomicObject } from './hooks';
import { Autocomplete, TextField } from '@mui/material';

const SearchBox: React.FC<SearchBoxProps> = props => {
    const [searchVal, setSearchVal] = useState<string | undefined>();
    const [selectedSearchVal, setSelectedsearchVal] = useState<Result | undefined>();
    const [results, setResults] = useState<Result[]>();

    const onSubmit = useCallback(async () => {
        if (searchVal && isCoordinate(searchVal)) {
            props.onSearchSubmit && props.onSearchSubmit(searchVal);
            return;
        }
        const coordinates = selectedSearchVal ? null : await fetchGenomicObject(searchVal || "---", "GRCh38");
        const gene = selectedSearchVal ? selectedSearchVal : results && results[0];
        if (!coordinates) {
            if (gene === undefined) return;
            const coords = gene.description.split('\n');
            props.onSearchSubmit &&
                isCoordinate(coords.length === 2 ? coords[1] : coords[0]) &&
                props.onSearchSubmit(coords.length === 2 ? coords[1] : coords[0], gene.title, !(coords.length === 2));
        } else
            props.onSearchSubmit && props.onSearchSubmit(`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`);
    }, [searchVal, results, props, selectedSearchVal]);

    const onSearchChange = useCallback(
        async (event: React.SyntheticEvent, { value }: { value: string }) => {
            const val: string = value.toLowerCase();
            let rs: Result[] = [];
            setSearchVal(value);
            if (val.startsWith('rs') && props.assembly === 'GRCh38') {
                const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                    method: 'POST',
                    body: JSON.stringify({
                        query: SNP_AUTOCOMPLETE_QUERY,
                        variables: { snpid: value, assembly: 'hg38', limit: 3 },
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
                const rst = (await response.json()).data
                    ?.snpAutocompleteQuery
                    ?.slice(0, 3)
                    .map((result: { id: string; coordinates: { chromosome: string; start: number; end: number } }) => ({
                        title: result.id,
                        description: `${result.coordinates.chromosome}:${result.coordinates.start}-${result.coordinates.end}`
                    }));
                rs = uniq(rst, value);
            }
            if (
                value.toLowerCase().match(/^chr[0-9x-y]+$/g)?.length === 1 &&
                value.length <= 5
            )
                rs = [
                    { title: value + ':1-100000', description: `\n${value}:1-100000` },
                    { title: value + ':1-1000000', description: `\n${value}:1-1000000` },
                    {
                        title: `${value}:1-10000000`,
                        description: `\n${value}:1-10000000`,
                    },
                ];
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: GENE_AUTOCOMPLETE_QUERY,
                    variables: { name_prefix: [value], assembly: props.assembly, orderby: 'name', limit: 5 },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            const genesRes = (await response.json()).data
                ?.gene
                ?.map((result: { name: string, id: string, coordinates: { chromosome: string; start: number; end: number } }) => ({
                    title: result.name,
                    description: `${result.id}\n${result.coordinates.chromosome}:${result.coordinates.start}-${result.coordinates.end}`
                })
                );
            const res: Result[] | undefined = genesRes && genesRes.length === 0 && rs.length > 0 ? undefined : uniq(genesRes, value);
            const list = rs ? (res ? [...rs, ...res] : rs) : res
            list?.forEach(item => {
                item.type = item.title?.startsWith('rs') ? 'snp' : 'gene'
            })
            setResults(list);
        }, [props.assembly]
    );
    const onResultSelect = useCallback((_e: any, d: { result: React.SetStateAction<Result | undefined>; }) => {
        setSelectedsearchVal(d.result);
    }, []);

    useEffect(() => {
        console.log(results)
    }, [results])

    return (
        <>
            <Autocomplete
                options={results || []}
                getOptionLabel={(option: Result) => option.title || ''}
                groupBy={(option: Result) => option.type || ''}
                renderOption={(props, option: Result) => (
                    <li {...props}>
                        <div>
                            <strong>{option.title}</strong>
                            <br />
                            <span>{option.description}</span>
                        </div>
                    </li>
                )}
                renderInput={(params) => <TextField {...params} label="Search" onChange={(e) => onSearchChange(e, { value: e.target.value })} />}
                style={{ width: 300 }}
            />
        </>
    );
};

export default SearchBox;