"use client"

import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Bar } from "@visx/shape";
import { useMemo, useRef } from "react";
import { scaleLinear, scaleBand } from "@visx/scale";
import { PlotProps } from "./types";
import React from "react";

const colors: { [key: number]: string } = {
    1: "#FFA500",
    2: "#FF0000",
    3: "#008000",
    4: "#0000FF",
    5: "#A52A2A",
    6: "#FFD700",
    7: "#90EE90",
};

const SelexBarPlot: React.FC<PlotProps> = ({ data, downloadSVGElement }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const barplotDomain = useMemo(
        () => ({
            x: {
                start: Math.min(...data.map((x) => x.selex_round)) - 1,
                end: Math.max(...data.map((x) => x.selex_round)) + 1,
            },
            y: {
                start: 0.0,
                end: Math.max(...data.map((x) => x.fractional_enrichment)) * 1 + 0.1,
            },
        }),
        [data]
    );

    const barGraphHeight = 300;
    const barGraphWidth = 300;
    const margin = { top: 20, right: 90, bottom: 70, left: 70 };

    const barXScale = useMemo(
        () =>
            scaleBand({
                domain: data.map((d) => d.selex_round),
                range: [0, barGraphWidth - (isMobile ? 0 : margin.right)],
                paddingInner: 0.5,
                paddingOuter: 0.3,
            }),
        [data, barGraphWidth, margin, isMobile]
    );

    const barYScale = useMemo(
        () =>
            scaleLinear({
                domain: [barplotDomain.y.start, barplotDomain.y.end],
                range: [barGraphHeight - margin.bottom, margin.top],
            }),
        [barplotDomain, barGraphHeight, margin]
    );

    const barref = useRef<SVGSVGElement | null>(null);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "center",
            }}
        >
            <Button
                variant="contained"
                startIcon={<SaveAltIcon />}
                onClick={() => downloadSVGElement(barref, "barplot.svg")}
                sx={{
                    marginTop: "20px",
                }}
            >
                Download Bar Plot
            </Button>

            <svg ref={barref} width={barGraphWidth} height={barGraphHeight}>
                <Group left={isMobile ? 0 : margin.left} top={margin.top}>
                    <AxisLeft
                        scale={barYScale}
                        label="Fractional Enrichment"
                        labelProps={{
                            fontSize: 12,
                            fill: "black",
                            textAnchor: "middle",
                            transform: "translate(-60, 0) rotate(-90)",
                        }}
                        strokeWidth={3}
                        tickValues={[0, data[data.length - 1].fractional_enrichment * 0.5, data[data.length - 1].fractional_enrichment, data[data.length - 1].fractional_enrichment * 1.5]}
                        tickLabelProps={() => ({
                            fontSize: 10,
                            fill: "black",
                            textAnchor: "end",
                            dx: "-0.25em",
                            dy: "0.25em",
                        })}
                    />
                    <AxisBottom
                        scale={barXScale}
                        top={barGraphHeight - margin.bottom}
                        label="Cycle"
                        strokeWidth={3}
                        labelProps={{
                            fontSize: 12,
                            fill: "black",
                            textAnchor: "middle",
                            transform: "translate(0, 40)",
                        }}
                        tickLabelProps={() => ({
                            fontSize: 10,
                            fill: "black",
                            textAnchor: "middle",
                            dy: "0.25em",
                        })}

                    />
                    {data.map((d, i) => (
                        <React.Fragment key={i}>
                            <Bar
                                x={barXScale(d.selex_round)}
                                y={barYScale(d.fractional_enrichment)}
                                height={
                                    barGraphHeight -
                                    margin.bottom -
                                    barYScale(d.fractional_enrichment)
                                }
                                width={barXScale.bandwidth()}
                                fill={colors[d.selex_round]}

                            />
                            <Text
                                x={barXScale(d.selex_round)! + barXScale.bandwidth() / 2}
                                y={barYScale(d.fractional_enrichment) - 5}
                                fontSize={12}
                                fill={colors[d.selex_round]}
                                textAnchor="middle"
                            >
                                {d.fractional_enrichment.toFixed(2)}
                            </Text>
                        </React.Fragment>
                    ))}
                    <Text
                        x={100}
                        y={270}
                        fontSize={14}
                        textAnchor="middle"
                        fill="black"
                    >
                        Cycle
                    </Text>
                    <Text
                        x={-135}
                        y={-40}
                        fontSize={14}
                        textAnchor="middle"
                        fill="black"
                        transform="rotate(-90)"
                    >
                        Fractional Enrichment
                    </Text>
                </Group>
            </svg>
            <Typography variant="caption" component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '20px', fontSize: "14px" }}>
                Cycle  {[2, 3, 4].map((cycle, index) => (
                    <div style={{
                        marginLeft: "5px", display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',
                    }}
                    ><div
                        style={{
                            width: '10px',
                            height: '8px',
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
        </Box>
    );
};

export default SelexBarPlot;