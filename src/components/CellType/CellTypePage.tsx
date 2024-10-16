import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Summary from "./summary";

const CellTypePage: React.FC = () => {
  const router = useRouter();
  const { species, celltype, details } = router.query as {
    species: string;
    celltype: string;
    details: string;
  };

  useEffect(() => {
    if (!details) {
      router.replace(`/${species}/${celltype}/summary`);
    }
  }, [details, router, species, celltype]);

  const assembly = species === "human" ? "GRCh38" : "mm10";

  if (!details) {
    return null;
  }

  return (
    <div
      style={{ paddingTop: "5em", paddingLeft: "1em", position: "relative" }}
    >
      <div style={{ marginTop: "1rem" }}>
        {details.toLowerCase() === "summary" ? (
          <Summary assembly={assembly} celltype={celltype} species={species} />
        ) : (
          <Summary assembly={assembly} celltype={celltype} species={species} />
        )}
      </div>
    </div>
  );
};

export default CellTypePage;
