import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getClient } from "../../../lib/client";
import { MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import MotifEnrichmentMEME from "./MotifEnrichmentMEME";

interface Params extends ParsedUrlQuery {
  accession: string;
}

interface AccessionPageProps {
  accession: string;
  factor: string;
  species: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = getClient();
  const { accession } = context.params as Params;

  await client.query({
    query: MOTIF_QUERY,
    variables: { peaks_accession: [accession] },
  });

  // Mock the factor, replace this with actual logic to retrieve the factor
  const factor = "CTCF";

  return {
    props: {
      initialApolloState: client.cache.extract(),
      accession,
      factor, // Pass the factor
    },
  };
};

const AccessionPage: React.FC<AccessionPageProps> = ({ accession, factor }) => {
  return (
    <MotifEnrichmentMEME accession={accession} factor={factor} species={""} />
  );
};

export default AccessionPage;
