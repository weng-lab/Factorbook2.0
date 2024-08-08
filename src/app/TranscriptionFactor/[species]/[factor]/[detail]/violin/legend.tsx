import React from 'react';


type LegendProps = {
    x: number;
    y: number;
    width: number;
    fill: string;
    stroke?: string;
    title: string;
    content: { [key: string]: string };
    fontSize: number;
};


const Legend: React.FC<LegendProps> = props => (
    <g transform={`translate(${props.x},${props.y})`}>
        <rect
            width={props.width}
            height={props.fontSize * (Object.keys(props.content).length + 3)}
            fill={props.fill}
            stroke={props.stroke}
            strokeWidth={2}
        />
        <text
            fontWeight="bold"
            fontSize={props.fontSize * 1.25}
            textAnchor="middle"
            x={props.width / 2}
            y={props.fontSize * 1.4}
        >
            {props.title}
        </text>
        {Object.keys(props.content).map((key, i) => (
            <React.Fragment key={i}>
                <rect
                    x={props.width * 0.1}
                    y={props.fontSize * (i + 2.5)}
                    width={props.fontSize * 0.8}
                    height={props.fontSize * 0.8}
                    fill={key}
                />
                <text fontSize={props.fontSize * 0.9} x={props.width * 0.18} y={props.fontSize * (i + 3.2)}>
                    {props.content[key]}
                </text>
            </React.Fragment>
        ))}
    </g>
);
export default Legend;
