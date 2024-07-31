import { RefObject } from "react";

export type SubGroupedData = Map<string, Map<string, number[]>>;

export type ViolinPlotData = {
  data: SubGroupedData;
  innerKeys: Set<string>;
  width: number;
  domain: [number, number];
};

export type ViolinPlotMousedOverState = {
  inner: string | null;
  outer: string | null;
};

export type ViolinPlotProps = {
  data: SubGroupedData;
  title: string;
  width: number;
  height: number;
  logScale?: boolean;
  bandWidth?: number;
  sampleRate?: number;
  showMedian?: boolean;
  mousedOver?: ViolinPlotMousedOverState;
  onViolinMousedOver?: (s: ViolinPlotMousedOverState) => void;
  onViolinMousedOut?: () => void;
  legendTitle?: string;
  legendKeys?: Set<string>;
  colors: Map<string, string>;
  domain: [number, number];
  tKeys?: number;
  sref?: RefObject<SVGSVGElement>;
} & React.SVGProps<SVGPathElement>;

interface GenericViolinProps {
  width: number;
  height: number;
  x: number;
  domain: [number, number];
  colors?: string[];
  mousedOver?: string | null;
  onMousedOver?: (x: string) => void;
  onMousedOut?: () => void;
}

interface ViolinSProps extends GenericViolinProps {
  rendered: number[][];
}

interface SingleViolinSProps extends GenericViolinProps {
  rendered: number[];
  median?: number;
}

export type ViolinProps = ViolinSProps & React.SVGProps<SVGPathElement>;

export type SingleViolinProps = SingleViolinSProps & React.SVGProps<SVGPathElement>;
