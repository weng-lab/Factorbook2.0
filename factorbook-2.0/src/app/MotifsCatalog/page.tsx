import * as React from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";

const MotifsSiteCatlog = () => {
  const motifsContent = `
  Sequence motifs of transcription factors (TFs) are logos, matrices, or more complex mathematical models of specific, short DNA sequences that TFs recognize and bind to, effectively serving as molecular addresses that guide these regulatory proteins to their target sites in the genome. 
  These motif sites, typically ranging from 6 to 20 base pairs, are essential for the precise regulation of gene expression. The binding of a TF to its motif sites can either activate or repress the transcription of adjacent genes, depending on the nature of the TF and the context of the site.
  The diversity and specificity of these motifs underlie the complexity of gene regulation, with different TFs having distinct motifs that correspond to their unique roles in cellular processes.
  `;

  return (
    <TranscriptionFactors
      header="Motifs Site Catlog"
      content={motifsContent}
      image="/IllustrationsNew.png"
    />
  );
};

export default MotifsSiteCatlog;
