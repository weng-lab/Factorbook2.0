import React, { useMemo } from "react";
import { RawLogo, DNAAlphabet } from "logojs-react";
import { AnnotatedLogoProps } from "../../types";
import { reverseComplement } from "@/components/tf/geneexpression/utils";

DNAAlphabet[0].color = "#228b22";
DNAAlphabet[3].color = "red";

const SEQUENCE_MAP = new Map([
  ["A", [2, 0, 0, 0]],
  ["C", [0, 2, 0, 0]],
  ["G", [0, 0, 2, 0]],
  ["T", [0, 0, 0, 2]],
]);

function pwm(sequence: string): number[][] {
  return (
    sequence
      ?.toUpperCase()
      .split("")
      .map((x) => SEQUENCE_MAP.get(x) || [0, 0, 0, 0]) || []
  );
}

function logLikelihood(
  backgroundFrequencies: number[]
): (r: number[]) => number[] {
  return (r: number[]): number[] => {
    let sum = 0.0;
    r.map(
      (x, i) =>
        (sum +=
          x === 0 ? 0 : x * Math.log2(x / (backgroundFrequencies[i] || 0.01)))
    );
    return r.map((x) => x * sum);
  };
}

const AnnotatedLogo: React.FC<AnnotatedLogoProps> = (props) => {
  const backgroundFrequencies = props.pwm[0].map(
    (_) => 1.0 / props.pwm[0].length
  );
  const ll = useMemo(
    () => logLikelihood(backgroundFrequencies),
    [backgroundFrequencies]
  );
  const ppwm = useMemo(
    () =>
      props.strand === "-"
        ? reverseComplement(props.pwm.map(ll))
        : props.pwm.map(ll),
    [props.pwm, ll, props.strand]
  );
  const offset = useMemo(
    () => (props.snpCoordinates.start! - props.motifCoordinates.start!) * 10,
    [props.snpCoordinates, props.motifCoordinates]
  );

  return (
    <svg
      width={(props.pwm.length + 6) * 10}
      height={(props.minorAlleles.length + 1) * 40 + 140}
    >
      <rect
        width={10}
        height={50 + 37 * props.minorAlleles.length + 130}
        x={40 + offset}
        y={0}
        fill="#999999"
        fillOpacity={0.3}
      />
      <g transform="translate(40,110)">
        <g transform="scale(1,0.4)">
          <RawLogo
            values={ppwm}
            alphabet={DNAAlphabet}
            x={0}
            y={0}
            glyphWidth={10}
            stackHeight={25}
          />
        </g>
        <g transform={`translate(${offset},50)`}>
          <g transform="scale(1,0.15)">
            <RawLogo
              values={pwm(props.refAllele)}
              alphabet={DNAAlphabet}
              glyphWidth={10}
              stackHeight={25}
            />
          </g>
          <text x={offset <= 10 ? 20 : -50} y={-10} fontSize="15px">
            REF
          </text>
        </g>
        {props.minorAlleles.map((x, i) => (
          <g transform={`translate(${offset},${50 + 37 * (i + 1)})`}>
            <g transform="scale(1,0.15)">
              <RawLogo
                values={pwm(x.sequence)}
                alphabet={DNAAlphabet}
                glyphWidth={10}
                stackHeight={25}
              />
            </g>
            <text x={offset <= 10 ? 20 : -50} y={-10} fontSize="15px">
              ALT
            </text>
            <text x={offset <= 10 ? 20 : -50} y={3} fontSize="10px">
              {(100 * x.frequency).toFixed(2)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
export default AnnotatedLogo;
