export interface Row {
    title: string;
    partitions: {
        title: string;
        footprint: number;
    }[];
    url: string;
    factors?: number;
    peaks: number;
    motifs?: number;
    motifSource?: string;
}

export const motifRows: Row[] = [{
    title: "any ENCODE cell type",
    partitions: [{
        title: "Motif Sites",
        footprint: 1.1
    }],
    url: "https://downloads.wenglab.org/ldr-models/all-peak-motif-sites.tar.gz",
    peaks: 627669,
    motifs: 1047362,
    motifSource: "ChIP-seq, MEME/FIMO"
}, {
    title: "seven ENCODE cell lines",
    partitions: [{
        title: "motif sites in K562 peaks",
        footprint: 0.73
    }, {
        title: "K562 peak sequences outside motifs",
        footprint: 19.6
    }, {
        title: "motif sites in A549 peaks",
        footprint: 0.59
    }, {
        title: "A549 peak sequences outside motifs",
        footprint: 30.9
    }, {
        title: "motif sites in GM12878 peaks",
        footprint: 0.37
    }, {
        title: "GM12878 peak sequences outside motifs",
        footprint: 10.5
    }, {
        title: "motif sites in H1-hESC peaks",
        footprint: 0.41
    }, {
        title: "H1-hESC peak sequences outside motifs",
        footprint: 18.5
    }, {
        title: "motif sites in HepG2 peaks",
        footprint: 0.56
    }, {
        title: "HepG2 peak sequences outside motifs",
        footprint: 22.7
    }, {
        title: "motif sites in MCF-7 peaks",
        footprint: 0.46
    }, {
        title: "MCF-7 peak sequences outside motifs",
        footprint: 16.7
    }, {
        title: "motif sites in HEK293 peaks",
        footprint: 0.72
    }, {
        title: "HEK293 peak sequences outside motifs",
        footprint: 14.2
    }],
    url: "https://downloads.wenglab.org/ldr-models/seven-cell-type-motifs.tar.gz",
    peaks: 1181695,
    motifs: 1024475,
    motifSource: "ChIP-seq, MEME/FIMO"
}].sort((a, b) => a.title.localeCompare(b.title));

export const peaksRows: Row[] = [{
    title: "GM12878",
    partitions: [{
        title: "peaks",
        footprint: 10.9
    }],
    url: "https://downloads.wenglab.org/ldr-models/GM12878.tar.gz",
    factors: 136,
    peaks: 456036
}, {
    title: "MCF-7",
    partitions: [{
        title: "peaks",
        footprint: 17.2
    }],
    url: "https://downloads.wenglab.org/ldr-models/MCF-7.tar.gz",
    factors: 90,
    peaks: 575454
}, {
    title: "A549",
    partitions: [{
        title: "peaks",
        footprint: 31.3
    }],
    url: "https://downloads.wenglab.org/ldr-models/A549.tar.gz",
    factors: 46,
    peaks: 736179
}, {
    title: "K562",
    partitions: [{
        title: "peaks",
        footprint: 20.3
    }],
    url: "https://downloads.wenglab.org/ldr-models/K562.tar.gz",
    factors: 319,
    peaks: 724468
}, {
    title: "H1-hESC",
    partitions: [{
        title: "peaks",
        footprint: 18.9
    }],
    url: "https://downloads.wenglab.org/ldr-models/H1.tar.gz",
    factors: 51,
    peaks: 810772
}, {
    title: "HepG2",
    partitions: [{
        title: "peaks",
        footprint: 23.3
    }],
    url: "https://downloads.wenglab.org/ldr-models/HepG2.tar.gz",
    factors: 201,
    peaks: 808860
}, {
    title: "HEK293",
    partitions: [{
        title: "peaks",
        footprint: 14.9
    }],
    url: "https://downloads.wenglab.org/ldr-models/HEK293.tar.gz",
    factors: 191,
    peaks: 613333
}].sort((a, b) => a.title.localeCompare(b.title));


export function sum(x: number[]): number {
    let xx = 0;
    x.forEach(xxx => xx += xxx);
    return xx;
}

// Configure the table with headers and cells
export type TableConfig = {
    rows: Row[]; // the data for each row to utilize
    headers: string[]; // headers for the table
    getCells: (row: Row) => (string | number | undefined)[]; // a function that gets the display informartion for each cell in a row
}

// Configure the cells for the peak table
export const peakConfig: TableConfig = {
    rows: peaksRows,
    headers: [
        "Model Title",
        "Total Peak Regions (Overlaps Merged)",
        "Distinct TFs represented",
        "Genomic Footprint of Peaks",
        "Download"
    ],
    getCells: (row: Row) => [
        row.title,
        row.peaks.toLocaleString(),
        row.factors,
        `${sum(row.partitions.map(p => p.footprint)).toFixed(1)}%`,
    ]
}

// Configure the cells for the motif table
export const motifConfig: TableConfig = {
    rows: motifRows,
    headers: [
        "Model Title",
        "Motif Identification Method",
        "Total Motif Sites (Overlaps Merged)",
        "Number of (merged) Peak Regions included",
        "Genomic Footprint of Motifs",
        "Download"
    ],
    getCells: (row: Row) => [
        row.title,
        row.motifSource,
        row.motifs?.toLocaleString(),
        row.peaks.toLocaleString(),
        `${row.partitions[0].footprint.toFixed(2)}%`,
    ]
}

