import { useRouter } from "next/router";
import { Redirect } from "next";
import Summary from "./Summary";

const CellTypePage: React.FC = () => {
  const router = useRouter();
  const { species, celltype, details } = router.query;

  if (!details) {
    return <Redirect to={`/${species}/${celltype}/summary`} />;
  }

  const assembly = species === "human" ? "GRCh38" : "mm10";

  return (
    <div
      style={{ paddingTop: "5em", paddingLeft: "1em", position: "relative" }}
    >
      <div style={{ marginTop: "1rem" }}>
        {details.toLowerCase() === "summary" ? (
          <Summary
            assembly={assembly}
            celltype={celltype as string}
            species={species as string}
          />
        ) : (
          <Redirect to={`/${species}/${celltype}/summary`} />
        )}
      </div>
    </div>
  );
};

export default CellTypePage;
