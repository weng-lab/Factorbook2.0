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