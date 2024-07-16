export const bin = (values: number[], bin_size: number) => {
  const newVals: number[] = [];
  for (let i = 0; i < values.length; i = i + bin_size) {
    let arr = values.slice(i, i + bin_size);
    let sum = arr.reduce((prev, cur) => (cur += prev));
    let avg = sum / arr.length;
    newVals.push(avg);
  }
  return newVals;
};

export const range = (min: number, max: number, by: number = 1) => {
  let newVals: number[] = [];
  for (let i = min; i < max; i = i + by) {
    newVals.push(i);
  }
  return newVals;
};

export function formatFactorName(target: string, species: string): string {
  if (species === "human" || species === "Homo sapiens") return target;
  return target[0] + target.substring(1).toLowerCase();
}

export function shadeHexColor(color: string, percent: number): string {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

type Range = { chromosome: string; start: number; end: number };
export function splitRange(range: Range, size: number): Range[] {
  const regions: Range[] = [];
  for (
    let i = Math.floor(range.start / size) * size;
    i < Math.ceil(range.end / size) * size;
    i += size
  ) {
    regions.push({ chromosome: range.chromosome, start: i, end: i + size });
  }
  return regions;
}
