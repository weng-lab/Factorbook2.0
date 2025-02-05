'use client'

import { gql, useQuery } from '@apollo/client'
import {
    GenomeBrowser, useBrowserState, InitialState,
    DefaultBigWig, BigWigTrackProps, ImportanceTrackProps,
    DefaultImportance, DisplayMode, TrackType, BrowserActionType,
    DefaultTranscript, TranscriptTrackProps, TranscriptMouseVersion,
    TranscriptHumanVersion, TrackProps, DefaultMotif, MotifTrackProps,
    Controls, BrowserAction, GQLCytobands
} from '@weng-lab/genomebrowser'
import { Dispatch, useEffect } from 'react'
import SearchBox from './autoComplete';
import { Button, TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const FILES_QUERY = gql`
query signal($accession: [String], $assembly: String) {
    peakDataset(accession: $accession) {
      datasets {
        files(types: [ "normalized_signal" ], assembly: $assembly) {
          accession
        }
      }
    }
}
`;

export const importanceTrack = (assembly: string): ImportanceTrackProps => {
    return {
        ...DefaultImportance,
        signalURL: assembly === "hg38" ? "gs://gcp.wenglab.org/factorbook-download/phyloP-100-way.hg38.bigWig" : "gs://gcp.wenglab.org/factorbook-download/phyloP-60-way.mm10.bigWig",
        id: "importance",
        title: "importance",
        height: 100,
        color: "#ffaa33",

        displayMode: DisplayMode.FULL,
        trackType: TrackType.IMPORTANCE,
        url: assembly === "hg38" ? "gs://gcp.wenglab.org/hg38.2bit" : "gs://gcp.wenglab.org/mm10.2bit"
    }
}


function defaultHumanTracks(regex: string, accession: string) {
    return [
        { ...DefaultTranscript, id: 'default-transcript', title: 'GENCODE v47 genes', height: 100, color: "#8b0000", assembly: "GRCh38", queryType: "gene", version: TranscriptHumanVersion.V47 } as TranscriptTrackProps,
        { ...DefaultBigWig, id: 'default-phylo-p', title: 'PhyloP 100-way', height: 100, color: "#000088", url: 'gs://gcp.wenglab.org/factorbook-download/phyloP-100-way.hg38.bigWig' } as BigWigTrackProps,
        { ...DefaultBigWig, id: 'default-dnase', title: 'Aggregated DNAse signal across all ENCODE biosamples', height: 100, color: "#06DA93", url: 'gs://data.genomealmanac.org/dnase.hg38.sum.bigWig' } as BigWigTrackProps,
        { ...DefaultMotif, id: 'default-motif', title: `ChIP-seq peaks with motif sites (${accession})`, height: 100, rowHeight: 12, color: "#000088", assembly: "GRCh38", consensusRegex: regex, peaksAccession: accession, occurences: false } as MotifTrackProps
    ]
}

function defaultMouseTracks(regex: string, accession: string) {
    return [
        { ...DefaultTranscript, id: 'default-transcript', title: 'GENCODE v36 genes', height: 100, color: "#8b0000", assembly: "mm10", queryType: "gene", version: TranscriptMouseVersion.V36 } as TranscriptTrackProps,
        { ...DefaultBigWig, id: 'default-phylo-p', title: 'PhyloP 60-way', height: 100, color: "#000088", url: 'gs://gcp.wenglab.org/factorbook-download/phyloP-60-way.mm10.bigWig' } as BigWigTrackProps,
        { ...DefaultBigWig, id: 'default-dnase', title: 'Aggregated DNAse signal across all ENCODE biosamples', height: 100, color: "#06DA93", url: 'gs://data.genomealmanac.org/dnase.mm10.sum.bigWig' } as BigWigTrackProps,
        { ...DefaultMotif, id: 'default-motif', title: 'ChIP-seq peaks with motif sites', height: 100, rowHeight: 12, color: "#000088", assembly: "mm10", consensusRegex: regex, peaksAccession: accession, occurences: false } as MotifTrackProps
    ]
}

function generateTracks(species: string, experimentID: string): TrackProps[] {
    const { data, loading, error } = useQuery(FILES_QUERY, {
        variables: {
            accession: [experimentID],
            assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10"
        }
    })

    if (loading) return []
    if (error) return []
    console.log(data)
    const file = data.peakDataset.datasets[0].files[0]
    if (!file) return []
    const url = `https://www.encodeproject.org/files/${file.accession}/@@download/${file.accession}.bigWig`
    const tracks = [] as TrackProps[]
    const bigWig = { ...DefaultBigWig, id: 'peak-signal-bw', title: "ChIP-seq signal (" + file.accession + ")", height: 100, color: "#3287a8", url: url } as BigWigTrackProps
    tracks.push(bigWig)
    return tracks
}

export default function Browser({ species, consensusRegex, experimentID }: { species: string, consensusRegex: string, experimentID: string }) {
    const domain = { chromosome: 'chr18', start: 35494852, end: 35514000 }

    const specificTracks = generateTracks(species, experimentID)
    const assembly = species.toLowerCase() === "human" ? "hg38" : "mm10"
    const initialState = {
        domain,
        width: 1500,
        tracks: species.toLowerCase() === "human" ? defaultHumanTracks(consensusRegex, experimentID) : defaultMouseTracks(consensusRegex, experimentID)
    } as InitialState

    const [state, dispatch] = useBrowserState(initialState)

    useEffect(() => {
        if (state.domain.end - state.domain.start <= 2000) {
            dispatch({ type: BrowserActionType.ADD_TRACK, track: importanceTrack(assembly) })
        }
        else {
            dispatch({ type: BrowserActionType.DELETE_TRACK, id: 'default-importance' })
        }
    }, [state.domain])

    useEffect(() => {
        if (specificTracks.length > 0) {
            specificTracks.forEach(track => {
                dispatch({ type: BrowserActionType.ADD_TRACK, track })
            })
        }
    }, [specificTracks])

    const onSearchSubmit = (domain: Domain) => {
        dispatch({ type: BrowserActionType.SET_LOADING })
        dispatch({ type: BrowserActionType.SET_DOMAIN, domain })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg id="cytobands" width={"700px"} height={20}>
                <GQLCytobands assembly={assembly} chromosome={domain.chromosome} currentDomain={state.domain} />
            </svg>
            <ControlDiv domain={state.domain} dispatch={dispatch} />
            <SearchBox assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"} onSearchSubmit={onSearchSubmit} />
            <GenomeBrowser width={"95%"} browserState={state} browserDispatch={dispatch} />
        </div>
    )
}

type Domain = {
    chromosome?: string;
    start: number;
    end: number;
}

function ControlDiv({ domain, dispatch }: { domain: Domain, dispatch: Dispatch<BrowserAction> }) {
    return (
        <div style={{ width: "100%" }}>
            <Controls
                inputButtonComponent={
                    <IconButton type="button" sx={{
                        color: "black",
                        maxHeight: "100%",
                        padding: "4px"
                    }}>
                        <Search fontSize="small" />
                    </IconButton>
                }
                inputComponent={SearchInput(domain.chromosome + ":" + domain.start + "-" + domain.end)}
                buttonComponent={
                    <Button
                        variant="outlined"

                        sx={{
                            minWidth: "0px",
                            width: { xs: "100%", sm: "80%" },
                            maxWidth: "120px",
                            fontSize: "0.8rem",
                            padding: "4px 8px"
                        }}
                    />
                }
                domain={domain}
                dispatch={dispatch}
                withInput={false}
                style={{
                    paddingBottom: "4px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    width: "100%"
                }}
            />
        </div>
    )
}
function SearchInput(placeholder: string) {
    return (
        <TextField
            variant="outlined"
            id="region-input"
            label="Enter a genomic region"
            placeholder={placeholder}
            InputLabelProps={{
                shrink: true,
                htmlFor: "region-input",
                style: {
                    color: '#000F9F',
                    fontSize: "0.8rem"
                },
            }}
            sx={{
                mr: { xs: "0.5rem", sm: "0.5rem" },
                minWidth: { xs: "100%", sm: "14rem" },
                maxWidth: "250px",
                fieldset: { borderColor: "#000F9F" },
                height: "30px",
                mb: "5px"
            }}
            size="small"
        />
    )
}