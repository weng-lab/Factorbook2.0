"use client";

import React from "react";
import Summary from "./summary";

const CtPage: React.FC<{ species: string }> = ({ species }) => {
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";

  return (
    <>
      <Summary assembly={assembly} species={species} />
    </>
  );
};

export default CtPage;
