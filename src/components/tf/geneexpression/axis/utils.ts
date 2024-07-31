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
