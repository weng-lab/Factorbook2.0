import React from 'react';
import { linearTransform } from '../utils';
import { ticks } from './utils';
import { AxisProps } from './types';

const YAxis: React.FC<AxisProps> = props => {
    const verticalTransform = linearTransform(props.range, [props.height * 0.9, props.height * 0.1]);
    return (
        <>
            <text
                transform="rotate(-90)"
                textAnchor="middle"
                x={-props.height / 2}
                y={props.width * 0.2}
                dominantBaseline="center"
                fontSize="150px"
            >
                {props.title}
            </text>
            <rect height={props.height * 0.8} y={props.height * 0.1} x={props.width * 0.8} width={2} fill="#000000" />
            {ticks(props.range)
                .filter(x => verticalTransform(x) > props.height * 0.1 && verticalTransform(x) < props.height * 0.9)
                .map(rangeValue => (
                    <g transform={`translate(0,${verticalTransform(rangeValue)})`} key={rangeValue}>
                        <text textAnchor="end" x={props.width * 0.6} fontSize="140px" alignmentBaseline="middle">
                            {rangeValue.toFixed(Math.log10(props.range[1] + 0.01) > 1.0 ? 0 : 0)}
                        </text>
                        <rect width={props.width * 0.1} height={2} x={props.width * 0.7} y={-2} fill="#000000" />
                    </g>
                ))}
        </>
    );
};
export default YAxis;
