import React from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getClient } from "../../../lib/client";
import { MOTIF_QUERY } from "@/components/MotifMeme/Queries";
import MotifEnrichmentMEME from "./MotifEnrichmentMEME";
import { MotifResponse } from "@/components/MotifMeme/Types";

interface Params extends ParsedUrlQuery {
  peakAccession: string;
  species: string;
  factor: string;
}

interface MotifPageProps {
  peakAccession: string;
  species: string;
  factor: string;
  initialMotifData: MotifResponse;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = getClient();
  const { peakAccession, species, factor } = context.params as Params;

  const { data } = await client.query({
    query: MOTIF_QUERY,
    variables: { peaks_accession: [peakAccession] },
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
      peakAccession,
      species,
      factor,
      initialMotifData: data,
    },
  };
};

const MotifPage: React.FC<MotifPageProps> = ({
  peakAccession,
  species,
  factor,
  initialMotifData,
}) => {
  return (
    <MotifEnrichmentMEME
      accession={peakAccession}
      factor={factor}
      species={species}
    />
  );
};

export default MotifPage;
