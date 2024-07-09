"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import ReferenceSection from "@/components/Container";
import ContentCard from "@/components/ContentCard";

const looksBiological = (value: string): boolean => {
  const v = value.toLowerCase();
  return v.includes("gene") || v.includes("protein");
};

const FunctionTab = () => {
  const router = useRouter();
  const { species, factor } = useParams();
  const [imageVisible, setImageVisible] = useState(true);

  const { data, loading, error } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species === "Human" ? "GRCh38" : "mm10",
        name: [factor],
      },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const factorData = data?.factor[0];
  const imageUrl = getRCSBImageUrl(factorData?.pdbids);

  const references = [
    {
      name: "ENCODE",
      url: `https://www.encodeproject.org/search/?searchTerm=${factor}&type=Experiment&assembly=${
        species === "Human" ? "GRCh38" : "mm10"
      }&assay_title=TF+ChIP-seq&files.output_type=optimal+IDR+thresholded+peaks&files.output_type=pseudoreplicated+IDR+thresholded+peaks&status=released`,
    },
    {
      name: "Ensembl",
      url: `http://www.ensembl.org/Human/Search/Results?q=${factor};site=ensembl;facet_species=Human`,
    },
    {
      name: "GO",
      url: `http://amigo.geneontology.org/amigo/search/bioentity?q=${factor}`,
    },
    {
      name: "GeneCards",
      url: `http://www.genecards.org/cgi-bin/carddisp.pl?gene=${factor}`,
    },
    {
      name: "HGNC",
      url: `http://www.genenames.org/cgi-bin/gene_search?search=${factor}&submit=Submit`,
    },
    {
      name: "RefSeq",
      url: `http://www.ncbi.nlm.nih.gov/nuccore/?term=${factor}+AND+${
        species !== "mm10"
          ? '"Homo sapiens"[porgn:__txid9606]'
          : '"Mus musculus"[porgn]'
      }`,
    },
    {
      name: "UCSC Genome Browser",
      url: `https://genome.ucsc.edu/cgi-bin/hgTracks?clade=mammal&org=Human&db=hg19&position=${factor}&hgt.suggestTrack=knownGene&Submit=submit`,
    },
    {
      name: "UniProt",
      url: `http://www.uniprot.org/uniprot/?query=${factor}&sort=score`,
    },
    {
      name: "Wikipedia",
      url: `https://en.wikipedia.org/wiki/${factor}`,
    },
  ];

  const renderCards = () => (
    <>
      {factorData?.ncbi_data && (
        <ContentCard
          title="NCBI"
          description={factorData.ncbi_data}
          sx={{ marginBottom: 2 }}
        />
      )}
      {factorData?.uniprot_data && (
        <ContentCard
          title="UniProt"
          description={factorData.uniprot_data}
          sx={{ marginBottom: 2 }}
        />
      )}
      {factorData?.factor_wiki && looksBiological(factorData.factor_wiki) && (
        <ContentCard
          title="Wikipedia"
          description={factorData.factor_wiki}
          sx={{ marginBottom: 2 }}
        />
      )}
      {factorData?.hgnc_data && (
        <ContentCard
          title="HGNC"
          description={`HGNC ID: ${factorData.hgnc_data.hgnc_id}\nLocus Type: ${
            factorData.hgnc_data.locus_type
          }\nChromosomal Location: ${
            factorData.hgnc_data.location
          }\nGene Groups: ${
            Array.isArray(factorData.hgnc_data.gene_group)
              ? factorData.hgnc_data.gene_group.join(", ")
              : ""
          }\nPrevious Names: ${
            Array.isArray(factorData.hgnc_data.prev_name)
              ? factorData.hgnc_data.prev_name.join(", ")
              : ""
          }`}
          sx={{ marginBottom: 2 }}
        />
      )}
      {factorData?.ensemble_data && (
        <ContentCard
          title="Ensembl"
          description={`Gene Type: ${
            factorData.ensemble_data.biotype
          }\nDescription: ${
            factorData.ensemble_data.description
          }\nEnsembl Version: ${factorData.ensemble_data.id}\nCCDS: ${
            Array.isArray(factorData.ensemble_data.ccds_id)
              ? factorData.ensemble_data.ccds_id.join(", ")
              : ""
          }`}
          sx={{ marginBottom: 2 }}
        />
      )}
    </>
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "var(--grey-500, #494A50)",
          padding: "16px",
          borderRadius: "8px",
          marginRight: "20px",
          width: "300px",
          minHeight: "calc(100vh - 80px)", // Adjust height to fill the viewport without overlapping header/footer
        }}
      >
        <Typography
          variant="h4"
          style={{ color: "white", marginBottom: "20px" }}
        >
          {factorData?.name}
        </Typography>
        {imageVisible && imageUrl && (
          <Box position="relative" mb={2}>
            <img
              src={imageUrl}
              alt={factorData?.name}
              style={{
                width: "200px",
                marginBottom: "20px",
              }}
            />
            <IconButton
              onClick={() => setImageVisible(!imageVisible)}
              style={{
                position: "absolute",
                top: "0",
                right: "-40px",
                color: "white",
              }}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        )}
        {!imageVisible && (
          <IconButton
            onClick={() => setImageVisible(!imageVisible)}
            style={{ color: "white" }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        )}
        <ReferenceSection title="References" sources={references} />
      </Box>

      <Box style={{ flex: 1 }}>{renderCards()}</Box>
    </Box>
  );
};

export default FunctionTab;
