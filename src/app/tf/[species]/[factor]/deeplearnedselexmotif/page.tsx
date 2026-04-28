'use client'

import DeepLearnedSelexMotifs from "./motifenrichmentselex";
import { useParams } from "next/navigation";

export default function DeepLearnedSelexPage() {
  const { species, factor } = useParams<{ species: string; factor: string }>();
  return (
    <DeepLearnedSelexMotifs factor={factor} species={species} />
  )
}