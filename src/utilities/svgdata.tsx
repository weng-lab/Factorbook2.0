import { RefObject } from "react";

export const svgData = (_svg: any): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, "").replace(/[ ]{8}/g, "");
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
) =>
  ref.current &&
  downloadData(svgData(ref.current!), filename, "image/svg;charset=utf-8");

export const combineSVG = (
  graphSVG: SVGSVGElement,
  legendSVG: SVGSVGElement,
  filename: string
) => {
  const combinedSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  const graphClone = graphSVG.cloneNode(true) as SVGSVGElement;
  const legendClone = legendSVG.cloneNode(true) as SVGSVGElement;

  const graphWidth = graphSVG.getAttribute("width");
  const graphHeight = graphSVG.getAttribute("height");
  const legendHeight = legendSVG.getAttribute("height");

  if (!graphWidth || !graphHeight || !legendHeight) {
    console.error("SVG attributes missing");
    return;
  }

  combinedSVG.setAttribute("width", graphWidth);
  combinedSVG.setAttribute(
    "height",
    (parseInt(graphHeight) + parseInt(legendHeight)).toString()
  );

  graphClone.setAttribute("y", "0");
  legendClone.setAttribute("y", graphHeight);

  combinedSVG.appendChild(graphClone);
  combinedSVG.appendChild(legendClone);

  const serializer = new XMLSerializer();
  const combinedSVGString = serializer.serializeToString(combinedSVG);
  const blob = new Blob([combinedSVGString], {
    type: "image/svg+xml;charset=utf-8",
  });
  downloadBlob(blob, filename);
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const svgToImage = async (
  svgElement: SVGSVGElement,
  filename: string
) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svgData);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        // Draw white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            resolve(true);
          } else {
            reject(new Error("Canvas conversion failed"));
          }
        });
      } else {
        reject(new Error("Canvas context is null"));
      }
    };

    img.onerror = (error) => reject(error);
  });
};
