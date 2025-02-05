"use client"

import { Box, Button, Typography } from "@mui/material";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { LinePath } from "@visx/shape";
import { useMemo, useRef } from "react";
import { scaleLinear } from "@visx/scale";
import { PlotProps } from "./types";
import { colors } from "./motifenrichmentselex";

const SelexLinePlot: React.FC<PlotProps> = ({ data, downloadSVGElement, onHover }) => {
    const lineref = useRef<SVGSVGElement | null>(null);
    const margin = { top: 20, right: 90, bottom: 70, left: 70 };

    const presentCycles = data.map((d) => d.selex_round);

    const points = useMemo(
        () =>
            data.flatMap((d) =>
                d.roc_curve.map((r) => ({
                    x: r[0],
                    y: r[1],
                    round: d.selex_round,
                }))
            ),
        [data]
    );

    const domain = useMemo(
        () => ({
            x: {
                start: 0,
                end: 1,
            },
            y: {
                start: 0,
                end: 1,
            },
        }),
        []
    );

    const lineGraphHeight = 300;
    const lineGraphWidth = 300;

    const xScale = useMemo(
        () =>
            scaleLinear({
                domain: [domain.x.start, domain.x.end],
                range: [3, lineGraphWidth - (margin.right)],
            }),
        [domain, lineGraphWidth, margin]
    );

    const yScale = useMemo(
        () =>
            scaleLinear({
                domain: [domain.y.start, domain.y.end],
                range: [lineGraphHeight - margin.bottom, margin.top],
            }),
        [domain, lineGraphHeight, margin]
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <svg ref={lineref} width={lineGraphWidth} height={lineGraphHeight}>

                <Group left={margin.left} top={margin.top}>

                    <AxisLeft
                        scale={yScale}
                        label="1-Specificity"
                        labelProps={{
                            fontSize: 12,
                            fill: "black",
                            textAnchor: "middle",
                            transform: "translate(-60, 0) rotate(-90)",
                        }}
                        strokeWidth={3}
                        tickValues={[0, 0.5, 1.0]}
                        tickLabelProps={() => ({
                            fontSize: 10,
                            fill: "black",
                            textAnchor: "end",
                            dx: "-0.25em",
                            dy: "0.25em",
                        })}
                    />
                    <AxisBottom
                        scale={xScale}
                        top={lineGraphHeight - margin.bottom}
                        label="Sensitivity"
                        labelProps={{
                            fontSize: 12,
                            fill: "black",
                            textAnchor: "middle",
                            transform: "translate(0, 40)",
                        }}
                        strokeWidth={3}
                        tickValues={[0, 0.5, 1.0]}
                        tickLabelProps={() => ({
                            fontSize: 10,
                            fill: "black",
                            textAnchor: "middle",
                            dy: "0.25em",
                        })}
                    />
                    {data.map((d, i) => {
                        const lineData = points.filter((p) => p.round === d.selex_round);
                        return (
                            <g key={i}>
                                {/* Invisible wider path to capture hover */}
                                <LinePath
                                    data={lineData}
                                    x={(p) => xScale(p.x)}
                                    y={(p) => yScale(p.y)}
                                    stroke="transparent"
                                    strokeWidth={10} // Ensures better hover detection
                                    style={{ pointerEvents: "stroke" }} // Ensures only the stroke captures events
                                    onMouseEnter={() => onHover(d.selex_round)}
                                    onMouseLeave={() => onHover(null)}
                                />
                                {/* Visible actual line */}
                                <LinePath
                                    data={lineData}
                                    x={(p) => xScale(p.x)}
                                    y={(p) => yScale(p.y)}
                                    stroke={colors[d.selex_round]}
                                    strokeWidth={2}
                                    pointerEvents="none" // Prevents interference with the hover detection
                                />
                            </g>
                        );
                    })}
                    <Text
                        x={105}
                        y={270}
                        fontSize={14}
                        textAnchor="middle"
                        fill="black"
                    >
                        1-Specificity
                    </Text>
                    <Text
                        x={-125}
                        y={-40}
                        fontSize={14}
                        textAnchor="middle"
                        fill="black"
                        transform="rotate(-90)"
                    >
                        Sensitivity
                    </Text>
                </Group>
            </svg>
            <Typography variant="caption" component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: "14px" }} gutterBottom>
                Cycle  {presentCycles.map((cycle) => (
                    <div style={{
                        marginLeft: "5px", 
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    ><div
                        style={{
                            width: '10px',
                            height: '3px',
                            backgroundColor: colors[cycle],
                            display: 'inline-block',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    > </div>
                        <Typography style={{ marginLeft: '2px' }}
                            fontSize={14}
                        > {cycle} </Typography>
                    </div>
                ))}
            </Typography>
            <Button
                variant="contained"
                startIcon={<SaveAltIcon />}
                onClick={() => downloadSVGElement(lineref, "lineplot.svg")}
            >
                Download Line Plot
            </Button>
        </Box>
    );
};

export default SelexLinePlot;