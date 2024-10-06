import React, { useContext, useEffect } from 'react';
import { ApiContext } from "../../ApiContext";
import { useQuery } from "@apollo/client";
import { gql } from '@apollo/client';
import { Divider } from '@mui/material';
import MotifResult from './results';
import { logLikelihood } from './MotifUtil';

const MOTIFS_PER_PAGE = 3
export const reverseComplement = (ppm: number[][]): number[][] =>
    ppm && ppm[0] && ppm[0].length === 4
        ? ppm.map(inner => inner.slice().reverse()).reverse()
        : ppm.map(entry => [entry[3], entry[2], entry[1], entry[0], entry[5], entry[4]]).reverse();

export const MOTIF_SEARCH_QUERY = gql`
    query MemeMotifSearch($assembly: String!, $pwms: [[[Float!]]]!, $limit: Int!, $offset: Int!) {
        meme_motif_search(pwms: $pwms, assembly: $assembly, limit: $limit, offset: $offset) {
            results {
                motif {
                    pwm
                    peaks_accession
                    tomtom_matches {
                        target_id
                        jaspar_name
                        e_value
                    }
                }
                distance
                offset
                reverseComplement
            }
            total
        }
    }
`;


export const MotifSearchResultSet: React.FC<{
    assembly: string;
    pwm: number[][];    
    offset?: number;
    onResultsLoaded?: (n: number) => void;
}> = ({    
    assembly,
    pwm,
    offset,
    onResultsLoaded,
}) => {
    const client = useContext(ApiContext)!!.client;
    const { data, loading } = useQuery<any>(MOTIF_SEARCH_QUERY, {
        client,
        variables: {
            assembly,
            pwms: [pwm],
            offset: (offset || 0) * MOTIFS_PER_PAGE,
            limit: MOTIFS_PER_PAGE,
        },
    });
    useEffect(() => {
        data && onResultsLoaded && onResultsLoaded(data.meme_motif_search[0].total);
    });
    

    return (
        <>
        <>
        
            {data &&
                data.meme_motif_search[0].results.map((m: any, i: number) => {
                    const rpwm = m.motif.pwm.map(logLikelihood([0.25, 0.25, 0.25, 0.25]));
                    const alignment = {
                        ...m,
                        motif: {
                            ...m.motif,
                            pwm: m.reverseComplement ? reverseComplement(rpwm) : rpwm,
                        },
                    };
                    return (
                        <>                        
                        <MotifResult
                            key={i}
                            species='human'
                            peak_accession={m.motif.peaks_accession}
                            alignment={alignment}
                            query={pwm}                            
                            tomtom_match={m.motif.tomtom_matches?.slice().sort((a: any, b: any) => a.e_value - b.e_value)[0]}
                        />
                        <Divider style={{ margin: "20px 0" }} />
                        </>
                    );
                })}
        </>
        </>
    );
};

