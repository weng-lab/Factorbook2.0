import { ChainFile, loadChainFile } from "liftover";
import { inflate } from "pako";

let cachedChainFile: ChainFile | undefined;

export const chainFileFetch = async (): Promise<ChainFile | undefined> => {
  if (cachedChainFile) {
    return cachedChainFile;
  }

  try {
    const response = await fetch(
      "https://hgdownload.cse.ucsc.edu/goldenpath/hg38/liftOver/hg38ToHg19.over.chain.gz"
    );
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const decodedData = new TextDecoder().decode(inflate(new Uint8Array(arrayBuffer)));
    cachedChainFile = loadChainFile(decodedData);
    return cachedChainFile;
  } catch (err) {
    console.error("Error loading chain file:", err);
    return undefined;
  }
};
