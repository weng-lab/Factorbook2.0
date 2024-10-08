import { RefObject } from 'react';

export function linearTransform(d: [number, number], r: [number, number]): (v: number) => number {
    return v => r[0] + (r[1] - r[0]) * ((v - d[0]) / (d[1] - d[0]));
}

export const reverseComplement = (ppm: number[][]): number[][] =>
    ppm && ppm[0] && ppm[0].length === 4
      ? ppm.map((inner) => inner.slice().reverse()).reverse()
      : ppm.map((entry) => [entry[3], entry[2], entry[1], entry[0], entry[5], entry[4]]).reverse();  

function hslToRgb(h: number, s: number, l: number): [ number, number, number ] {
    let r: number, g: number, b: number;
    if (s === 0)
        r = g = b = l; // achromatic
    else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}


export const tissueColors: { [key: string]: string} = {
    liver: "#aabb66",
    nerve: "#fdd800",
    skin: "#6f74b6",
    muscle: "#aba8d4",
    "large intestine": "#ca9855",
    pancreas: "#995724",
    epithelium: "#dd7e6b",
    bone: "#a2c4c9",
    lung: "#a4cd39",
    eye: "#d5a6bd",
    "adrenal gland": "#5eba47",
    uterus: "#c878b2",
    "spinal cord": "#ebe71b",
    spleen: "#778955",
    thyroid: "#186833",
    "small intestine": "#565624",
    prostate: "#dddddd",
    "urinary bladder": "#a91d22",
    kidney: "#74cac1",
    blood: "#dd4297",
    "bone marrow": "#ea9999",
    embryo: "#93c47d",
    penis: "#144a9f",
    esophagus: "#8b7257",
    nose: "#b5834f",
    stomach: "#ffdd99",
    "connective tissue": "#aca8d3",
    vagina: "#ef5898",
    gallbladder: "#674ea7",
    adipose: "#f26822",
    placenta: "#7bcb54",
    limb: "#5f58ed",
    "blood vessel": "#ee2124",
    brain: "#ebe71b",
    heart: "#652c90",
    breast: "#4ac2c5",
    ovary: "#e1aed0",
    intestine: "#565624",
    trachea: "#c27ba0",
    thymus: "#8e7cc3",
    testis: "#aaabab",
    NA: "#000000",
    //Added as fallback
    missing: "#000000",
    //Sample Types
    "cell line": "#4964c6",
    "primary cell": "#e4973f",
    "in vitro differentiated cells": "#852795",
    tissue: "#bf4a27",
    organoid: "#eec54d",
  }
export function spacedColors(n: number, s: number = 50, l: number = 50): (i: number) => string {
    return i => {
        const [ r, g, b ] = hslToRgb(((i * (360 / (n || 1))) % 360) / 360, s / 100, l / 100);
        return `rgb(${r},${g},${b})`
    };
}

export function assignColors(items: Set<string>): { [key: string]: string } {
    const colors = spacedColors(items.size);
    const r: { [key: string]: string } = {};
    [...items].forEach((item, i) => {
        r[item] = colors(i);
    });
    return r;
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function svgData(svgNode: RefObject<SVGSVGElement>): string {
    if (!svgNode.current) return '';
    const svg = svgNode.current.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const preface = '<?xml version="1.0" standalone="no"?>';
    return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
}

export function svgDataE(svgNode: SVGSVGElement[], translations: ([ number, number ] | undefined)[]): string {
    const svgs = svgNode.map(x => x.cloneNode(true) as SVGSVGElement);
    svgs[0].setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgs.slice(1).forEach( (x, i) => {
        Array.from(x.children).forEach(c => {
            const cc = c.cloneNode(true) as SVGGElement;
            if (translations[i]) {
                const s = svgs[0].createSVGTransform();
                s.setTranslate(...(translations[i] as [ number, number ]));
                cc.transform.baseVal.appendItem(s);
            }
            svgs[0].getRootNode().appendChild(cc);
        });
    });
    const preface = '<?xml version="1.0" standalone="no"?>';
    return preface + svgs[0].outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
}

export function downloadSVG(svg: RefObject<SVGSVGElement>, filename: string) {
    downloadBlob(new Blob([svgData(svg)], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

export function downloadTSV(text: string, filename: string) {
    downloadBlob(new Blob([text], { type: 'text/plain' }), filename);
}
