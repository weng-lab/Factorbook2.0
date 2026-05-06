'use client'

import GeneExpressionPage from "./geneexpression";
import { useParams } from "next/navigation";

export default function GeneExpressionPage_() {
  const { species, factor } = useParams<{ species: string; factor: string }>();
  return (
    /**
     * @todo this species === "human" ? "GRCh38" : "mm10" is used many places, define utlity shared
     */
    (<GeneExpressionPage gene_name={factor} assembly={species === "human" ? "GRCh38" : "mm10"} />)
  );
}