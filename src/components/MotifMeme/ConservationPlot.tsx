import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { Graph } from "./Aggregate/Graphs";
import { downloadSVG } from "@/utilities/svgdata";

const ConservationPlot: React.FC<{ name: string; accession: string; pwm: number[][] }> = ({ name, accession, pwm }) => {
    const [data, setData] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(true);
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        setLoading(true);
        setData(null);
        fetch(`https://screen-beta-api.wenglab.org/motif_conservation/conservation-aggregate/all/${accession}-${name}.sum.npy`)
            .then(x => x.json())
            .then(x => {
                setData(x.slice(16));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [accession, name]);

    if (loading) return <CircularProgress />;
    if (!data || data.length === 0) return <div>No data available</div>;

    const max = Math.max(...data);
    const min = Math.min(...data);

    return (
        <div>
            <Graph
                dataset={{ target: 'conservation', accession }}
                proximal_values={data}
                distal_values={data}
                is_forward_reverse
                xlabel="distance from motif (bp)"
                ylabel="conservation"
                height={220}
                yMax={max * 1.2}
                padBottom
                hideTitle
                sref={ref}
            />
            <Button variant="contained" color="primary" onClick={() => downloadSVG(ref, "conservation.svg")} style={{ marginTop: '1em' }}>
                Export SVG
            </Button>
        </div>
    );
};

const CentralityPlot: React.FC<{ peak_centrality: Record<number, number> }> = ({ peak_centrality }) => {
    const pcX = Object.keys(peak_centrality).map((s) => +s).sort((a, b) => a - b);
    const pcY = pcX.map((p) => peak_centrality[p]);
    const ref = useRef<SVGSVGElement>(null);

    return (
        <div>
            <Graph
                dataset={{ target: 'peak_centrality', accession: '' }}
                proximal_values={pcY}
                distal_values={pcY}
                is_forward_reverse={false}
                xlabel="distance from peak summit (bp)"
                ylabel="motif density"
                height={220}
                yMax={Math.max(...pcY) * 1.2}
                padBottom
                hideTitle
                sref={ref}
            />
            <Button variant="contained" color="primary" onClick={() => downloadSVG(ref, "peak-centrality.svg")} style={{ marginTop: '1em' }}>
                Export SVG
            </Button>
        </div>
    );
};

// The parent component that renders both plots side by side
const QCPlots: React.FC<{ peak_centrality: Record<number, number>; name: string; accession: string; pwm: number[][] }> = ({
    peak_centrality,
    name,
    accession,
    pwm,
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <CentralityPlot peak_centrality={peak_centrality} />
            </Grid>
            <Grid item xs={12} md={6}>
                <ConservationPlot name={name} accession={accession} pwm={pwm} />
            </Grid>
        </Grid>
    );
};

export default ConservationPlot;
