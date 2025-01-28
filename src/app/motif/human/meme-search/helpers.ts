import { ACMAPType, PCMAPType, Result } from "./types";

// All helper functions take directly from old factorbook
//TODO comment out functions, figure out what each does

const parseBackgroundLine = (line: string): Record<string, number> => {
    const p = line.split(/\s+/g);
    let result: Record<string, number> = {};
    for (let i = 0; i < p.length / 2; ++i) {
        const f = +p[i * 2 + 1];
        if (!isNaN(f)) result[p[i * 2]] = f;
    }
    return result;
};


export const parseMemeTxt = (text: string) => {
    let inmotif = false;
    let results: Result[] = [],
        alphabet: string[] = [],
        cppm: number[][] = [],
        cmotifname: string = "";
    let name = null;
    let motifnames: string[] = [];
    let alength = 0;
    let backgroundFrequencies: Record<string, number> = {},
        inBackgroundFrequencies = false;
    text.split('\n').forEach(line => {
        if (line.startsWith('letter-probability')) {
            inmotif = true;
            alength = line.split('alength= ')[1] ? +line.split('alength= ')[1].split(' ')[0] : alphabet.length;
            if (alphabet && alphabet.length !== 0) alength = alphabet.length;
        } else if (line.startsWith('MOTIF')) {
            cmotifname = line.split('MOTIF ')[1];
            inBackgroundFrequencies = false;
        } else if (inmotif && alength !== -1 && line.trim().split(/\s+/).length !== alength) {
            inmotif = false;
            results.push({ ppm: cppm });
            motifnames.push(cmotifname);
            cppm = [];
            cmotifname = "";
        } else if (inmotif) {
            const values = line
                .trim()
                .split(/\s+/)
                .map(parseFloat);
            cppm.push(values);
            if (alength < 1) alength = values.length;
        } else if (line.trim().startsWith('DATAFILE=')) name = line.split('DATAFILE=')[1].trim();
        else if (line.trim().startsWith('Background letter frequencies')) inBackgroundFrequencies = true;
        else if (inBackgroundFrequencies)
            backgroundFrequencies = { ...backgroundFrequencies, ...parseBackgroundLine(line.trim()) };
    });
    return {
        logos: results.map((result, i) => ({
            ...result,
            name: motifnames[i],
            alphabet,
            backgroundFrequencies: alphabet.map(a =>
                backgroundFrequencies[a] === undefined ? 1.0 / alphabet.length : backgroundFrequencies[a]
            ),
        })),
        name,
    };
};

export const memeTxtToMotifs = (content: string) =>
    parseMemeTxt(content).logos.map(x => {
        const llh = logLikelihood(
            x.backgroundFrequencies.length === 0 ? [0.25, 0.25, 0.25, 0.25] : x.backgroundFrequencies
        );
        return {
            pwm: x.ppm.map(llh),
            name: x.name,
        };
    });

export const logLikelihood = (backgroundFrequencies: number[]) => (r: number[]): number[] => {
    let sum = 0.0;
    r.map((x, i) => (sum += x === 0 ? 0 : x * Math.log2(x / (backgroundFrequencies[i] || 0.01))));
    return r.map(x => {
        const v = x * sum;
        return v <= 0.0 ? 0.0 : v;
    });
};

const ONETHIRD = 1 / 3;
const ACMAP: ACMAPType = { a: 0, c: 1, g: 2, t: 3 };
const PCMAP: PCMAPType = {
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

export const regexToPWM = (regex: string) => {
    const pwm: number[][] = [];
    const lregex = regex.toLowerCase();
    let inBracket = false,
        cbracket = [0.0, 0.0, 0.0, 0.0],
        ccount = 0.0;
    for (let i = 0; i < lregex.length; ++i) {
        if (inBracket) {
            if (lregex[i] === ']') {
                inBracket = false;
                for (let j = 0; j < cbracket.length; ++j) cbracket[j] /= ccount;
                pwm.push(cbracket);
                cbracket = [0.0, 0.0, 0.0, 0.0];
                ccount = 0.0;
            } else if (ACMAP[lregex[i]] && cbracket[ACMAP[lregex[i]]] === 0.0) {
                ccount += 1.0;
                cbracket[ACMAP[lregex[i]]] = 1.0;
            }
        } else if (lregex[i] === '[') inBracket = true;
        else if (PCMAP[lregex[i]]) pwm.push(PCMAP[lregex[i]]);
    }
    return pwm.map(logLikelihood([0.25, 0.25, 0.25, 0.25]));
};