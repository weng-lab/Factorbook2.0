import { GenomicRange } from "@/app/annotationsvariants/types";

export const parseBed = (e: string): GenomicRange[] => {
  const lines: string[] = e.split("\n");
  return lines
    .map((l: string): string[] => l.split("\t"))
    .filter((l: string[]): boolean => l.length >= 3)
    .map(
      (r: string[]): GenomicRange => ({
        chromosome: r[0],
        start: +r[1],
        end: +r[2],
      })
    )
    .filter((r: GenomicRange): boolean => !isNaN(r.start!) && !isNaN(r.end!));
};
