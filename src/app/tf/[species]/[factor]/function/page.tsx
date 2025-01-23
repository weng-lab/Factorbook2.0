'use client'

import FunctionTab from "./function";

export default function FunctionPage({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  return (
    /**
     * @todo this species === "human" ? "GRCh38" : "mm10" is used many places, define utlity shared
     */
    <FunctionTab factor={factor} assembly={species === "human" ? "GRCh38" : "mm10"} />
  )
}