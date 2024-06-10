import * as React from "react";
import TranscriptionFactors from "@/components/TranscriptionFactors";
import TranscriptionTabs from "@/components/TranscriptionTabs";

const MouseTranscriptionFactors = () => {
  const mouseContent = `
    Transcription factors (TFs) are regulatory proteins in the
    complex networks that underpin cellular function. They bind to
    specific DNA sequences, typically in the regulatory regions of
    the genome. They activate or repress the transcription of genes,
    thereby controlling the flow of genetic information from DNA to
    mRNA. The human genome encodes for approximately 1800 TFs, each
    with unique binding sites and mechanisms of action. TFs are
    often categorized based on their DNA binding domains and the
    sequences they recognize. Their activity is regulated by various
    mechanisms, including post-translational modifications,
    interaction with other proteins, and environmental signals. TFs
    are central to many biological processes, such as development,
    cell cycle, and response to stimuli. Dysregulation of TF
    activity can lead to a variety of diseases, including cancer,
    making them significant targets in biomedical research.
  `;

  return (
    <>
      <TranscriptionFactors
        header="Mouse Transcription Factors"
        content={mouseContent}
        image="/Mouse.png"
      />
      <TranscriptionTabs />
    </>
  );
};

export default MouseTranscriptionFactors;
