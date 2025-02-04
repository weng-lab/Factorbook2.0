import React, { useState, useCallback, useEffect } from 'react';
import { GENE_AUTOCOMPLETE_QUERY, SNP_AUTOCOMPLETE_QUERY } from './queries';
import { uniq, isCoordinate } from './utils';
import { SearchBoxProps, Result } from './types';
import { fetchGenomicObject } from './hooks';
import { Autocomplete, TextField } from '@mui/material';

const SearchBox: React.FC<SearchBoxProps> = props => {
    const [results, setResults] = useState<Result[]>();
    const [isResultSelected, setIsResultSelected] = useState(false);

    const onSubmit = useCallback((value: Result) => {
        let domainString = ""
        switch (value.type) {
            case 'gene':
                domainString = value.description.split('\n')[1]
                break
            case 'snp':
                domainString = value.description
                break
            case 'coordinate':
                domainString = value.title || ""
                break
        }
        const chromosome = domainString.split(':')[0]
        let start = parseInt(domainString.split(':')[1].split('-')[0])
        let end = parseInt(domainString.split(':')[1].split('-')[1])
        if (value.type === 'snp' || value.type === 'gene') {
            const center = Math.floor((start + end) / 2)
            const halfWindow = 2500
            start = center - halfWindow
            end = center + halfWindow
        }

        props.onSearchSubmit && props.onSearchSubmit({ chromosome, start, end });
    }, [props.onSearchSubmit])

    const onSearchChange = useCallback(
        async (_event: React.SyntheticEvent, { value }: { value: string }) => {
            const val: string = value.toLowerCase();
            let rs: Result[] = [];
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
                if (item.title?.startsWith('rs')) {
                    item.type = 'snp';
                } else if (item.title?.startsWith('chr')) {
                    item.type = 'coordinate';
                } else {
                    item.type = 'gene';
                }
            })
            setResults(list);
        }, [props.assembly]
    );

    return (
        <>
            <Autocomplete
                options={results || []}
                getOptionLabel={(option: Result) => option.title || ''}
                groupBy={(option: Result) => option.type || ''}
                renderOption={(props, option: Result) => (
                    <li {...props} key={option.title}>
                        <div>
                            <strong>{option.title}</strong>
                            <br />
                            <span>{option.description}</span>
                        </div>
                    </li>
                )}
                onChange={(_event, value) => {
                    console.log(value)
                    if (value) {
                        setIsResultSelected(true);
                        onSubmit(value);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        onChange={(e) => {
                            onSearchChange(e, { value: e.target.value });
                            setIsResultSelected(false);
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                color: isResultSelected ? 'green' : 'gray',
                            }
                        }}
                    />
                )}
                style={{ width: 300 }}
            />
        </>
    );
};

export default SearchBox;