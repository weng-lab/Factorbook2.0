import React from 'react';
import { linearTransform } from '../utils';
import { ticks } from './utils';
import { AxisProps } from './types';

const XAxis: React.FC<AxisProps> = props => {
    const horizontalTransform = linearTransform(props.range, [0, props.width]);
    return (
        <>
            <text textAnchor="middle" x={props.width / 2} y={props.height * 0.5} fontSize="20px">
                {props.title}
            </text>
            <rect width={props.width} y={0} x={0} height={2} fill="#000000" />
            {ticks(props.range)
                .filter(x => horizontalTransform(x) > 0 && horizontalTransform(x) < props.width)
                .map(rangeValue => (
                    <g transform={`translate(${horizontalTransform(rangeValue)},0)`}>
                        <text transform="rotate(-90)" textAnchor="end" x={-props.height * 0.15} y={5} fontSize="15px">
                            {rangeValue.toFixed(Math.log10(props.range[1] + 0.01) > 1.0 ? 0 : 2)}
                        </text>
                        <rect height={props.height * 0.1} width={2} y={0} x={-2} fill="#000000" />
                    </g>
                ))}
        </>
    );
};
export default XAxis;
