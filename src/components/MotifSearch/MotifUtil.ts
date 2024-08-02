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
  
  export function pwmArray(
    pwm: { A: number; C: number; G: number; T: number }[] | number[][]
  ): number[][] {
    if ((pwm as { A: number; C: number; G: number; T: number }[])[0].A === undefined) return pwm as number[][];
    return (pwm as { A: number; C: number; G: number; T: number }[]).map((x) => [x.A, x.C, x.G, x.T]);
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
  letter-probability matrix: alength= 4 w= ${x.pwm.length} nsites= ${x.sites || 0} E= ${x.e?.toExponential(3) || 0}
  ${pwmArray(x.pwm)
    .map((xx) => xx.map((xxx) => xxx.toFixed(4)).join(" "))
    .join("\n")}`
    )
    .join("\n\n")}\n`;
  }
  