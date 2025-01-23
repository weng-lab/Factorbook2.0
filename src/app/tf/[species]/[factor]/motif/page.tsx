'use client'

import MotifEnrichmentMEME from "./motifenrichmentmeme";

export default function MotifEnrichmentPage({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  return (
    <MotifEnrichmentMEME factor={factor} species={species} />
  )
}