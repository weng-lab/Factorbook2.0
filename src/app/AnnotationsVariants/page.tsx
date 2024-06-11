import * as React from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";

const AnnotationsVariants = () => {
  const motifsContent = `
  Genetic variants in regulatory elements of the human genome play a critical role in influencing traits and disease susceptibility by modifying transcription factor (TF) binding and gene expression. Often identified in genome-wide association studies, these variants can disrupt gene regulatory networks, leading to varied phenotypic effects or predispositions to diseases. Factorbook offers a comprehensive resource of TF binding motifs and sites, enabling researchers to predict the impact of genetic variants on TF binding and gene regulation, providing valuable insights into the functional consequences of these variants.
  `;

  return (
    <TranscriptionFactors
      header="Motifs Site Catlog"
      content={motifsContent}
      image="/Human.png"
    />
  );
};

export default AnnotationsVariants;
