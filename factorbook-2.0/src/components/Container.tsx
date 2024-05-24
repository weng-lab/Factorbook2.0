"use client";

import * as React from "react";
import { useState } from "react";

type ReferenceProps = {
  title: string;
  sources: { name: string; url: string }[];
};

const ReferenceSection: React.FC<ReferenceProps> = ({ title, sources }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <section className="flex flex-col self-stretch text-white shadow w-full">
      <header className="flex gap-5 justify-between px-4 py-1 w-full text-xl font-medium tracking-normal leading-8 whitespace-nowrap max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
        <h1 className="cursor-default">{title}</h1>
        <div
          className="flex items-center justify-center p-2 cursor-pointer"
          onClick={handleToggleVisibility}
          style={{
            padding: "8px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.88 9.28957L12 13.1696L8.11998 9.28957C7.72998 8.89957 7.09998 8.89957 6.70998 9.28957C6.31998 9.67957 6.31998 10.3096 6.70998 10.6996L11.3 15.2896C11.69 15.6796 12.32 15.6796 12.71 15.2896L17.3 10.6996C17.69 10.3096 17.69 9.67957 17.3 9.28957C16.91 8.90957 16.27 8.89957 15.88 9.28957Z"
              fill="black"
              fillOpacity="0.54"
            />
          </svg>
        </div>
      </header>
      {isVisible && (
        <div className="flex flex-col justify-center px-4 py-3 w-full text-sm tracking-normal leading-5 rounded-3xl bg-neutral-600 max-md:max-w-full">
          <div className="flex flex-wrap gap-5 justify-center px-6 max-md:flex-wrap max-md:px-5">
            {sources.map((source, index) => (
              <a
                href={source.url}
                className="mt-5 text-white hover:bg-white hover:text-black transition duration-200 px-3 py-2 rounded cursor-pointer"
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const Container: React.FC = () => {
  const referenceSources = [
    { name: "ENCODE", url: "https://www.encodeproject.org/" },
    { name: "Ensembl", url: "https://www.ensembl.org/" },
    { name: "GO", url: "http://geneontology.org/" },
    { name: "GeneCards", url: "https://www.genecards.org/" },
    { name: "HGNC", url: "https://www.genenames.org/" },
    { name: "RefSeq", url: "https://www.ncbi.nlm.nih.gov/refseq/" },
    { name: "UCSC Genome Browser", url: "https://genome.ucsc.edu/" },
    { name: "UniProt", url: "https://www.uniprot.org/" },
    { name: "Wikipedia", url: "https://www.wikipedia.org/" },
  ];

  return <ReferenceSection title="References" sources={referenceSources} />;
};

export default Container;
