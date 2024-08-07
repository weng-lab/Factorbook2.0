import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getClient } from "../../../lib/client";
import { MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import MotifEnrichmentMEME from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/MotifEnrichmentMEME";

interface Params extends ParsedUrlQuery {
  accession: string;
}

interface AccessionPageProps {
  accession: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = getClient();
  const { accession } = context.params as Params;

  await client.query({
    query: MOTIF_QUERY,
    variables: { peaks_accession: [accession] },
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
      accession,
    },
  };
};

const AccessionPage: React.FC<AccessionPageProps> = ({ accession }) => {
  return <MotifEnrichmentMEME accession={accession} />;
};

export default AccessionPage;
