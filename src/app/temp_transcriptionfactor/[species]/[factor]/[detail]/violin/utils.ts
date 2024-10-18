/**
 * Smooths the input data with a normal kernel density estimator.
 * @param input: the input vector to smooth.
 * @param sampleDomain: the domain over which to smooth; defaults to the domain of the input data.
 * @param bandWidth: the standard deviation of the kernel; defaults to 1/20 of the domain width.
 * @param sampleRate: the rate at which to sample the density; defaults to 1/100 of the domain width.
 */
export function standardNormalKernel(
    input: number[],
    sampleDomain: number[] = [],
    bandWidth: number = -1.0,
    sampleRate: number = -1.0
): number[] {
    const minimum = 2 === sampleDomain.length ? sampleDomain[0] : Math.min(...input);
    const maximum = 2 === sampleDomain.length ? sampleDomain[1] : Math.max(...input);
    if (-1.0 === bandWidth) bandWidth = (maximum - minimum) / 30.0;
    if (-1.0 === sampleRate) sampleRate = (maximum - minimum) / 100.0;
    const samplePositions: number[] = [];
    for (let i = minimum + sampleRate; i <= maximum; i += sampleRate) samplePositions.push(i);
    const retval = samplePositions.map(x => 0.0);
    input.forEach(x => {
        let values = gaussian(Math.sqrt(2.0 * Math.PI) * bandWidth, x, bandWidth, samplePositions);
        values.forEach((x, i) => {
            retval[i] += x;
        });
    });
    return retval;
}

export function ticks(range: [number, number], cscale: number = 1.0): number[] {
    const sfig = Math.pow(10.0, Math.floor(Math.log10(range[1])));
    const r: number[] = [],
        lrange = [Math.floor(range[0] / sfig) * sfig, Math.ceil(range[1] / sfig) * sfig];
    for (let i = lrange[0]; i <= lrange[1]; i += sfig * cscale) {
        r.push(i);
    }
    if (r.length <= 2) return range;
    return r.length > 10 ? ticks(range, cscale * 2) : r;
}

export function linearTransform(d: [number, number], r: [number, number]): (v: number) => number {
    return v => r[0] + (r[1] - r[0]) * ((v - d[0]) / (d[1] - d[0]));
}

export const FRIENDLY: Map<string, string> = new Map([]);

/**
 * Samples a normal distribution at the given positions.
 * @param amplitude the amplitude of the distribution.
 * @param mean the mean of the distribution.
 * @param stdev the standard deviation of the distribution.
 * @param positions the positions at which to sample the distribution.
 */
export function gaussian(amplitude: number, mean: number, stdev: number, positions: number[]): number[] {
    const a = amplitude / (Math.sqrt(2.0 * Math.PI) * stdev);
    const d = 2.0 * stdev * stdev;
    return positions.map(x => a * Math.exp((-(x - mean) * (x - mean)) / d));
}

export function groupByThenBy<T, U>(
    data: T[],
    keyA: (v: T) => string,
    keyB: (v: T) => string,
    val: (v: T) => U
): Map<string, Map<string, U[]>> {
    const results: Map<string, Map<string, U[]>> = new Map();
    data.forEach(d => {
        const kA = keyA(d),
            kB = keyB(d);
        if (results.get(kA) === undefined) results.set(kA, new Map<string, U[]>());
        const mA = results.get(kA)!;
        if (mA.get(kB) === undefined) mA.set(kB, []);
        mA.get(kB)!.push(val(d));
    });
    return results;
}

export function median(values: number[]): number {
    if (values.length === 0) return 0;
    values = [...values].sort();
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
}
