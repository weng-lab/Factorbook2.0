import { Dialog, DialogContent, DialogTitle, Table, TableCell, TableRow, TableHead, TableBody, ListItemText, ListItem, List, Link, Typography, Box, Button, useTheme } from "@mui/material";
import { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { peakConfig, motifConfig, Row, TableConfig, sum } from "./config";

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
                        <Button
                            variant="contained"
                            href={row?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download
                        </Button>
                    </Box>
                    : "Select a model for more information"}
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
    const [hoverRow, setHoverRow] = useState<Row | undefined>(undefined);
    const theme = useTheme();
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
                    <TableRow key={row.title} sx={{ cursor: 'pointer', backgroundColor: hoverRow === row ? theme.palette.action.hover : theme.palette.background.default }} onMouseEnter={() => setHoverRow(row)} onMouseLeave={() => setHoverRow(undefined)}>
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

function ModelInfo({ model, content }: { model: Row, content: string }) {
    const isMotif = content === "motif";

    return (
        <div>
            {/* How to use the model */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>How to use the model</Typography>
            <List dense sx={{ pt: 0, pb: 0 }}>
                <ListItem sx={{ py: 0 }}>
                    <ListItemText primary={<>1. Create a folder to store inputs and outputs</>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                    <ListItemText primary={<>2. Download the model files from the button provided</>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                    <ListItemText primary={<>3. Run the following command to unpack the model and partition heritability for a set of summary statistics:</>} />
                </ListItem>
            </List>
            {content === "motif" ? <MotifCode model={model} /> : <PeakCode model={model} />}
            <Typography variant="body1">
                Output will be located at partitioned-heritability.txt when the command finishes. The final line in this file will include heritability enrichment for the specified peak partition.
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