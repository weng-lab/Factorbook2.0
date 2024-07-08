"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const TranscriptionFactors = dynamic(
  () => import("@/components/TranscriptionFactors")
);
const TranscriptionTabs = dynamic(
  () => import("@/components/TranscriptionTabs")
);

type ContentType = "Human" | "Mouse";

const TranscriptionFactorsPage: React.FC = () => {
  const pathname = usePathname();
  const type = pathname.split("/").pop() as ContentType;

  const contentMap: Record<
    ContentType,
    { header: string; content: string; image: string }
  > = {
    Human: {
      header: "Human Transcription Factors",
      content: `
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
      `,
      image: "/Face.png",
    },
    Mouse: {
      header: "Mouse Transcription Factors",
      content: `
        Transcription factors (TFs) are regulatory proteins in the
        complex networks that underpin cellular function. They bind to
        specific DNA sequences, typically in the regulatory regions of
        the genome. They activate or repress the transcription of genes,
        thereby controlling the flow of genetic information from DNA to
        mRNA. The mouse genome encodes for approximately 1800 TFs, each
        with unique binding sites and mechanisms of action. TFs are
        often categorized based on their DNA binding domains and the
        sequences they recognize. Their activity is regulated by various
        mechanisms, including post-translational modifications,
        interaction with other proteins, and environmental signals. TFs
        are central to many biological processes, such as development,
        cell cycle, and response to stimuli. Dysregulation of TF
        activity can lead to a variety of diseases, including cancer,
        making them significant targets in biomedical research.
      `,
      image: "/Mouse.png",
    },
  };

  if (!type || !(type in contentMap)) {
    return <p>Loading...</p>;
  }

  const { header, content, image } = contentMap[type];

  return (
    <>
      <TranscriptionFactors header={header} content={content} image={image} />
      <TranscriptionTabs species={type} />
    </>
  );
};

export default TranscriptionFactorsPage;
