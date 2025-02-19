import { Dialog, DialogContent, DialogTitle, Table, TableCell, TableRow, TableHead, TableBody, ListItemText, ListItem, List, Link, Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledButton from "@/components/styledbutton";

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

export default function Popup({ content, open, onClose }: { content: string, open: boolean, onClose: () => void }) {
    const [row, setRow] = useState<Row | undefined>(undefined);

    const handleClose = () => {
        setRow(undefined);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='md'
            fullWidth
            disableScrollLock
        >
            <DialogTitle>
                {row ?
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <strong>{row.title}</strong>
                        <Link
                            href={row?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                        >
                            <StyledButton
                                text="Download"
                                onClick={() => { }}
                                href={row?.url}
                            />
                        </Link>
                    </Box>
                    : "Select or Download a Model"}
                <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 0 }}>
                    {row && (
                        <IconButton onClick={() => setRow(undefined)}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ overflowY: 'visible' }}>
                {row ?
                    <ModelInfo content={content} model={row} /> :
                    <ModelTable onRowClick={setRow} config={content === "motif" ? motifConfig : peakConfig} />
                }
            </DialogContent>
        </Dialog>
    )
}

function ModelTable({ onRowClick, config }: { onRowClick: (row: Row) => void, config: TableConfig }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {config.headers.map((header, i) => (
                        <TableCell key={i}>{header}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {config.rows.map((row) => (
                    <TableRow key={row.title} sx={{ cursor: 'pointer' }}>
                        {config.getCells(row).map((cell, i) => (
                            <TableCell key={i} onClick={() => onRowClick(row)}>
                                {typeof cell === 'number' ? cell.toLocaleString() : cell}
                            </TableCell>
                        ))}
                        <TableCell>
                            <Link href={row.url} target="_blank" rel="noopener noreferrer">
                                {row.url}
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


const motifInfo = {
    steps: [
        "2. Create a folder to store inputs and outputs. In this example we use a folder called 'idr' in the current user's home directory.",
        "3. Download the model files from the button provided",
        "4. Run the following command to unpack the model and partition heritability for a set of summary statistics:"
    ],
    lastMessage: "Output will be located at partitioned-heritability.txt when the command finishes. The final lines in this file will include heritability enrichment for the partitions in the model."
}

const peakInfo = {
    steps: [
        "1. Create a folder to store inputs and outputs",
        "2. Download the model files from the button provided",
        "3. Run the following command to unpack the model and partition heritability for a set of summary statistics:"
    ],
    lastMessage: "Output will be located at partitioned-heritability.txt when the command finishes. The final line in this file will include heritability enrichment for the specified peak partition."
}

function ModelInfo({ model, content }: { model: Row, content: string }) {
    const isMotif = content === "motif";
    const steps = isMotif ? motifInfo.steps : peakInfo.steps;
    const lastMessage = isMotif ? motifInfo.lastMessage : peakInfo.lastMessage;
    return (
        <div>
            {/* How to use the model */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>How to use the model</Typography>
            <List dense sx={{ pt: 0, pb: 0 }}>
                {steps.map((step, i) => (
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary={step} />
                    </ListItem>
                ))}
            </List>
            {content === "motif" ? <MotifCode model={model} /> : <PeakCode model={model} />}
            <Typography variant="body1">
                {lastMessage}
            </Typography>

            {/* Model overview */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Model Overview</Typography>
            <List dense sx={{ pt: 0, pb: 0 }}>
                {isMotif ?
                    <>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<><strong>Total motif sites included:</strong> {model.motifs?.toLocaleString()}</>} />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<><strong>Motif identification method:</strong> {model.motifSource}</>} />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<><strong>Total (merged) peak regions represented:</strong> {sum(model.partitions.map(p => p.footprint)).toFixed(1)}%</>} />
                        </ListItem>
                    </> :
                    <>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<>Total TFs represented: {model.factors?.toLocaleString()}</>} />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<>Total non-overlapping peak included: {model.peaks?.toLocaleString()}</>} />
                        </ListItem>
                    </>
                }
            </List>

            {/* Genomic Partitions */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Genomic Partitions in this Model</Typography>
            <List dense sx={{ pt: 0, pb: 0 }}>
                {model.partitions.map((p, i) => (
                    <ListItem sx={{ py: 0 }} key={i}>
                        <ListItemText primary={<>{i + 1}. <strong>{p.title}</strong>: {p.footprint.toFixed(1)}% of peaks</>} />
                    </ListItem>
                ))}
            </List>

            {/* Limitations */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Limitations of this Model</Typography>
            <List dense sx={{ pt: 0, pb: 0 }}>
                {isMotif ?
                    <>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<><strong>Cell type representation</strong>: This model includes data from several distinct cell types, some of which are more
                                deeply covered by ENCODE ChIP-seq data than others.</>} />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary={<><strong>Factor representation</strong>: This model includes data from several distinct TFs, some of which are more broadly profiled
                                across cell types than others.</>} />
                        </ListItem>
                    </> :
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primary={<><strong>Cell type representation</strong>: This model <em>only</em> includes TF ChIP-seq peaks for {model.title}. The {model.factors} factors in this model may have other regulatory
                            binding sites active only in other cell types which are not represented here.</>} />
                    </ListItem>
                }
            </List>
        </div>
    )
}

interface Row {
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

function sum(x: number[]): number {
    let xx = 0;
    x.forEach(xxx => xx += xxx);
    return xx;
}

type TableConfig = {
    rows: Row[]; // the data for each row to utilize
    headers: string[]; // headers for the table
    getCells: (row: Row) => (string | number | undefined)[]; // a function that gets the display informartion for each cell in a row
}

const peakConfig: TableConfig = {
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

const motifConfig: TableConfig = {
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

function MotifCode({ model }: { model: Row }) {
    return (
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBlock: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            tar xfvz {model.url.split("/")[model.url.split("/").length - 1]} &amp;&amp; \<br />
            \ <br />
            docker run \<br />
            &nbsp;&nbsp;--volume ~/ldr:/input \<br />
            &nbsp;&nbsp;ghcr.io/weng-lab/ldr/ldr:latest \<br />
            &nbsp;&nbsp;python3 -m ldr.h2 \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--ld-scores /input/{model.url.split("/")[model.url.split("/").length - 1].split(".")[0]} \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--ld-prefix annotations \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--summary-statistics /input/summary-stats.txt.gz &gt; partitioned-heritability.txt
        </pre>
    )
}

function PeakCode({ model }: { model: Row }) {
    return (
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBlock: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            tar xfvz {model.url.split('/')[model.url.split('/').length - 1]} &amp;&amp; \<br />
            \<br />
            docker run \<br />
            &nbsp;&nbsp;--volume /path/to/inputs:/input \<br />
            &nbsp;&nbsp;ghcr.io/weng-lab/ldr/ldr:latest \<br />
            &nbsp;&nbsp;python3 -m ldr.h2 \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--ld-scores /input/{model.url.split('/')[model.url.split('/').length - 1].split('.')[0]} \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--ld-prefix annotations \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;--summary-statistics /inputs/summary-stats.txt &gt; partitioned-heritability.txt
        </pre>
    )
}