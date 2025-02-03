'use client'

import DeepLearnedSelexMotifs from "./motifenrichmentselex";

export default function DeepLearnedSelexPage({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  return (
    <DeepLearnedSelexMotifs factor={factor} species={species} />
  )
}