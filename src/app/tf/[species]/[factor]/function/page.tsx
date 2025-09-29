'use client'

import FunctionTab from "./function";
import { useEffect, useState } from "react";

type TFEntry = {
  tf: string;
  ppm: number[][];
};
export default function FunctionPage({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  const [dataMap, setDataMap] = useState<Map<string, number[][]>>(new Map());
  
  useEffect(() => {
    fetch("/TF-ChIP-Canonical-Motifs-w-Trimmed.json") // Replace with actual filename in public folder
      .then((res) => res.json())
      .then((json) => {
        const tfMap = new Map<string, number[][]>();

        Object.keys(json).forEach((entry) => {
          tfMap.set(entry, json[entry].trimmed_ppm);
        });

        setDataMap(tfMap);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
      });
  }, []);

  console.log("dataMap",dataMap)
  return (
    /**
     * @todo this species === "human" ? "GRCh38" : "mm10" is used many places, define utlity shared
     */
    (<FunctionTab factorlogo={ species === "human" ? dataMap && dataMap.get(factor): undefined} factor={factor} assembly={species === "human" ? "GRCh38" : "mm10"} />)
  );
}