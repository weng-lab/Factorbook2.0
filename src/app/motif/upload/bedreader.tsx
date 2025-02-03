import { inflate } from "pako";

import { parseBed } from "@/utilities/parsebed";
import { GenomicRange } from "@/app/snpannotation/types";

export function readBed(
  file: File,
  onComplete: (regions: GenomicRange[]) => void,
  onError: (e: any) => void
): void {
  const textReader = new FileReader();
  textReader.onload = (e: any) => {
    const newRegions = parseBed(e.target.result);
    if (newRegions.length > 0) onComplete(newRegions);
    else {
      const binaryReader = new FileReader();
      binaryReader.onload = (e: any) => {
        try {
          onComplete(
            parseBed(new TextDecoder().decode(inflate(e.target.result)))
          );
        } catch (e) {
          onError(e);
        }
      };
      binaryReader.readAsBinaryString(file);
    }
  };
  textReader.readAsText(file);
}
