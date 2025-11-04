export type MMotif = {
  pwm: { A: number; C: number; G: number; T: number }[] | number[][];
  dbd: string;
  color: string;
  factor: string;
  accession: string;
  coordinates: [number, number];
  e?: number;
  sites?: number;
};

export function logLikelihood(
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
const ONETHIRD: number = 1 / 3;
const ACMAP: { [letter: string]: number } = { a: 0, c: 1, g: 2, t: 3 };
const PCMAP: { [letter: string]: number[] } = {
  a: [1, 0, 0, 0],
  c: [0, 1, 0, 0],
  g: [0, 0, 1, 0],
  t: [0, 0, 0, 1],
  w: [0.5, 0, 0, 0.5],
  s: [0, 0.5, 0.5, 0],
  m: [0.5, 0.5, 0, 0],
  k: [0, 0, 0.5, 0.5],
  r: [0.5, 0, 0.5, 0],
  y: [0, 0.5, 0, 0.5],
  b: [0, ONETHIRD, ONETHIRD, ONETHIRD],
  d: [ONETHIRD, 0, ONETHIRD, ONETHIRD],
  h: [ONETHIRD, ONETHIRD, 0, ONETHIRD],
  v: [ONETHIRD, ONETHIRD, ONETHIRD, 0],
  n: [0.25, 0.25, 0.25, 0.25],
};

export const regexToPWM = (regex: any) => {
  //brackets being seen as 5%B and 5%D, have to decode first
  const decodedpwm = decodeURIComponent(regex);
  const pwm = [];
  const lregex = decodedpwm.toLowerCase();
  let inBracket = false,
    cbracket = [0.0, 0.0, 0.0, 0.0],
    ccount = 0.0;
  for (let i = 0; i < lregex.length; ++i) {
    if (inBracket) {
      if (lregex[i] === "]") {
        inBracket = false;
        for (let j = 0; j < cbracket.length; ++j) cbracket[j] /= ccount;
        pwm.push(cbracket);
        cbracket = [0.0, 0.0, 0.0, 0.0];
        ccount = 0.0;
      } else if ((ACMAP[lregex[i]] || lregex[i] === "a") && cbracket[ACMAP[lregex[i]]] === 0.0) {
        ccount += 1.0;
        cbracket[ACMAP[lregex[i]]] = 1.0;
      }
    } else if (lregex[i] === "[") inBracket = true;
    else if (PCMAP[lregex[i]]) pwm.push(PCMAP[lregex[i]]);
  }
  return pwm.map(logLikelihood([0.25, 0.25, 0.25, 0.25]));
};

export function pwmArray(
  pwm: { A: number; C: number; G: number; T: number }[] | number[][]
): number[][] {
  if (
    (pwm as { A: number; C: number; G: number; T: number }[])[0].A === undefined
  )
    return pwm as number[][];
  return (pwm as { A: number; C: number; G: number; T: number }[]).map((x) => [
    x.A,
    x.C,
    x.G,
    x.T,
  ]);
}

export function rc(x: number[][]): number[][] {
  const m = [...x.map((xx) => [...xx])];
  return m.map((xx) => xx.reverse()).reverse();
}

export function lower5(x: number): number {
  return Math.floor(x / 5) * 5;
}

export function upper5(x: number): number {
  return Math.ceil(x / 5) * 5;
}

export function range(start: number, end: number, step: number): number[] {
  const arr = [];
  for (let i = start; i <= end; i += step) {
    arr.push(i);
  }
  return arr;
}

export function meme(motifs: MMotif[]): string {
  return `MEME version 4.5
ALPHABET= ACGT

${motifs
  .map(
    (x) => `MOTIF ${x.accession.split(" ")[0]}_${x.factor}
letter-probability matrix: alength= 4 w= ${x.pwm.length} nsites= ${
      x.sites || 0
    } E= ${x.e?.toExponential(3) || 0}
${pwmArray(x.pwm)
  .map((xx) => xx.map((xxx) => xxx.toFixed(4)).join(" "))
  .join("\n")}`
  )
  .join("\n\n")}\n`;
}
