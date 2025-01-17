'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import FunctionTab from "./function";
import MotifEnrichmentMEME from "@/components/motifmeme/motifenrichmentmeme";
import PeakSearch from "./peaksearch";
import DeepLearnedSelexMotifs from "./motifenrichmentselex";
import GeneExpressionPage from "./geneexpression";
import EpigeneticProfile from "./epigeneticprofile";


export default function FactorDetailsPage({ 
  params: {
    species,
    factor,
    detail = "function"
  }
}: {
  params: {
    species: string,
    factor: string,
    detail: string
  }
}) {
  const router = useRouter();

  // Normalize factor name for URL
    /**
   * @todo this is in both this layout file and in page.tsx. I feel like this duplication should be fixed
   */
  const factorForUrl =
    species.toLowerCase() === "human"
      ? factor.toUpperCase()
      : species.toLowerCase() === "mouse"
      ? factor.charAt(0).toUpperCase() + factor.slice(1).toLowerCase()
      : factor;

  // Redirect for consistent URL structure
  useEffect(() => {
    if (species.toLowerCase() === "human" && factor !== factorForUrl) {
      router.replace(
        `/transcriptionfactor/${species}/${factorForUrl}/${detail}`
      );
    }
  }, [species, factor, factorForUrl, detail, router]);

  switch (detail) {
    case "function":
      return (
        <FunctionTab
          factor={factorForUrl}
          assembly={species === "human" ? "GRCh38" : "mm10"}
        />
      );
    case "expression":
      return (
        <GeneExpressionPage
          gene_name={factorForUrl}
          assembly={species === "human" ? "GRCh38" : "mm10"}
        />
      );
    case "motifenrichmentmeme":
      return <MotifEnrichmentMEME factor={factorForUrl} species={species} />;
    case "motifenrichmentselex":
      return <DeepLearnedSelexMotifs factor={factorForUrl} species={species} />
    // case "epigeneticprofile":
    //   return <EpigeneticProfile factor={factorForUrl} species={species} />;
    case "peaksearch":
      return <PeakSearch />;
    default:
      return (
        <FunctionTab
          factor={factorForUrl}
          assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"}
        />
      );
  }
};
