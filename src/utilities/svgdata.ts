import { MutableRefObject, RefObject } from "react";

export const svgData = (_svg: SVGSVGElement): string => {
  const svg = _svg.cloneNode(true) as SVGSVGElement;
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const preface = '<?xml version="1.0" standalone="no"?>';
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
  ref: MutableRefObject<SVGSVGElement | null>,
  filename: string
) => {
  if (ref.current) {
    downloadData(svgData(ref.current), filename, "image/svg+xml;charset=utf-8");
  }
};

export const addWhiteBackgroundToSVG = (svg: SVGSVGElement) => {
  const background = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", svg.getAttribute("width") || "100%");
  background.setAttribute("height", svg.getAttribute("height") || "100%");
  background.setAttribute("fill", "white");

  svg.insertBefore(background, svg.firstChild);
};

export const downloadSVGElementAsSVG = (
  ref: MutableRefObject<SVGSVGElement | null>,
  filename: string
) => {
  if (ref.current) {
    const svg = ref.current.cloneNode(true) as SVGSVGElement;
    addWhiteBackgroundToSVG(svg);
    downloadData(svgData(svg), filename, "image/svg+xml;charset=utf-8");
  }
};