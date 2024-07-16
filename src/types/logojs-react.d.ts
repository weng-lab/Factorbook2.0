declare module 'logojs-react' {
    import { FC, Ref } from 'react';
  
    export interface LogoProps {
      ppm: number[][];
      height?: number;
      width?: string | number;
      alphabet?: any;
      ref?: Ref<SVGSVGElement>;
    }
  
    export const DNALogo: FC<LogoProps>;
  }
  