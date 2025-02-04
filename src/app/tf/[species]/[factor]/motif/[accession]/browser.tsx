'use client'

import { gql, useQuery } from '@apollo/client'
import { GenomeBrowser, useBrowserState, InitialState, DefaultBigWig, BigWigTrackProps, ImportanceTrackProps, DefaultImportance, DisplayMode, TrackType, GQLWrapper, BrowserActionType, DefaultTranscript, TranscriptTrackProps, TranscriptMouseVersion, TranscriptHumanVersion, TrackProps, DefaultMotif, MotifTrackProps, Controls } from '@weng-lab/genomebrowser'
import { useEffect } from 'react'
import SearchBox from './search';

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

export const importanceTrack: ImportanceTrackProps = {
    ...DefaultImportance,
    signalURL: "gs://gcp.wenglab.org/hg38.phyloP100way.bigWig",
    id: "importance",
    title: "importance",
    height: 100,
    color: "#ffaa33",
    displayMode: DisplayMode.FULL,
    trackType: TrackType.IMPORTANCE,
    url: "gs://gcp.wenglab.org/hg38.2bit"
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
        { ...DefaultTranscript, id: 'default-transcript', title: 'GENCODE v47 genes', height: 100, color: "#8b0000", assembly: "mm10", queryType: "gene", version: TranscriptMouseVersion.V36 } as TranscriptTrackProps,
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

    const file = data.peakDataset.datasets[0].files[0]
    const url = `https://www.encodeproject.org/files/${file.accession}/@@download/${file.accession}.bigWig`
    const tracks = [] as TrackProps[]
    const bigWig = { ...DefaultBigWig, id: 'peak-signal-bw', title: "", height: 100, color: "#3287a8", url: url } as BigWigTrackProps
    tracks.push(bigWig)
    return tracks
}

export default function Browser({ species, consensusRegex, experimentID }: { species: string, consensusRegex: string, experimentID: string }) {
    const domain = { chromosome: 'chr18', start: 35494852, end: 35514000 }

    const specificTracks = generateTracks(species, experimentID)

    const initialState = {
        domain,
        width: 1500,
        tracks: species.toLowerCase() === "human" ? defaultHumanTracks(consensusRegex, experimentID) : defaultMouseTracks(consensusRegex, experimentID)
    } as InitialState

    const [state, dispatch] = useBrowserState(initialState)

    useEffect(() => {
        console.log(state.domain)
        if (state.domain.end - state.domain.start <= 2000) {
            dispatch({ type: BrowserActionType.ADD_TRACK, track: importanceTrack })
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

    const onSearchSubmit = (domain: string, name?: string, isSnp?: boolean) => {
        console.log(domain, name, isSnp)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Controls domain={state.domain} dispatch={dispatch} />
            <SearchBox assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"} onSearchSubmit={onSearchSubmit} />
            <GenomeBrowser width={"95%"} browserState={state} browserDispatch={dispatch} />
        </div>
    )
}