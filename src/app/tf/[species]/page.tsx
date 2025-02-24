"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const TranscriptionFactors = dynamic(
  () => import("@/components/transcriptionfactors")
);
const TranscriptionTabs = dynamic(
  () => import("@/components/transcriptiontabs")
);

type ContentType = "human" | "mouse";

export default function TranscriptionFactorsPage({searchParams}: {searchParams: { [key: string]: string | string[] | undefined }}) {
  const pathname = usePathname();
  const type = pathname.split("/").pop() as ContentType;

  const contentMap: Record<
    ContentType,
    { header: string; content: string; image: string }
  > = {
    human: {
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
    mouse: {
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
  const assembly: string = type === "human" ? "GRCh38" : "mm10";
  return (
    <>
      <TranscriptionFactors
        tf
        header={header}
        content={content}
        image={image}
        assembly={assembly}
      />
      <TranscriptionTabs species={type} initialTab={searchParams?.tab === "1" ? 1 : 0}  />
    </>
  );
};
