/**
 * 
 * @param url 
 * @returns the file size for download at url (in bytes)
 */
export const getFileSize = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      return parseInt(contentLength, 10)
    } else return null
  } catch (error) {
    console.log("error fetching file size for ", url)
    return null
  }
}

export const svgData = (_svg: any): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, "").replace(/[ ]{8}/g, "");
};


/**
 * Generates the content for a .meme file based on provided motifs.
 */
export const meme = (
  motifs: Array<{
    accession: string;
    pwm: number[][];
    factor: string;
    dbd: string;
    color: string;
    coordinates: [number, number];
  }>
): string => {
  let content = "MEME version 4\n\n";
  content += "ALPHABET= ACGT\n\n";
  content += "strands: + -\n\n";
  content += "Background letter frequencies:\n";
  content += "A 0.25 C 0.25 G 0.25 T 0.25\n\n";

  for (const motif of motifs) {
    content += `MOTIF ${motif.accession}\n`;
    content +=
      "letter-probability matrix: alength= 4 w= " +
      motif.pwm.length +
      " nsites= 20 E= 0.000\n";
    for (const row of motif.pwm) {
      content += row.map((val) => val.toFixed(6)).join(" ") + "\n";
    }
    content += "\n";
  }

  return content;
};

export const downloadData = (
  text: string,
  filename: string,
  type: string = "text/plain"
) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.setAttribute("style", "display: none");
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (
  ref: React.MutableRefObject<any>,
  filename: string
) => {
  if (ref.current) {
    downloadData(svgData(ref.current.querySelector("svg")), filename, "image/svg+xml;charset=utf-8");
  }
};

export const defaultPrompt1 = 
`Act as a useful genomic agent to help biologists understand genome regulation.
You have access to a few functions (RNA_EXPR, CHIP_INFO, MOTIF_INFO) to help you answer them, their answers will be directly shown to the user, so explain why you call them.`

export const defaultPrompt2 = 
`Act as an agent for helping biologists query genomic databases.
You will have access to a set of databases and tools on genomic data that will be described bellow.

The tools you have access to are:
* RNA_EXPR(gene_name, sample_type): returns the gene expression in TPM for a given TF for the given sample type. This tool should not be used to answer general questions about a TF.
* CHIP_INFO(transcription_factor, sample_type): returns a link to download the bed file containing the binding sites for a given TF in that sample type.
* MOTIF_INFO(transcription_factor, sample_type): returns the binding motif for that transcription factor, it can either be for a given sample type or the special sample "all" which will be computed across all samples, note that this is the only tool that can take "all" as a sample_type.
Note that MOTIF_INFO is the only tool that can take 'all' as an argument for the sample, as this would not be defined for the other tools.

If you use the tools, provide the query between double brackets [[Function]].
If you use a tool, you can explain why you chose it, and your thought process, you can also add additional information.

You will try to answer the questions to the best of your abilities, you can either use these tools or rely on your existing knowledge, if the user question is unclear you can ask clarifying questions.

User queries start with USER, your previous answers start with SYSTEM.`
