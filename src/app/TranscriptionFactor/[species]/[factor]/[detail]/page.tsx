"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import ContentCard from "@/components/ContentCard";
import ReferenceSection from "@/components/Container";

import FunctionTab from "./Function";
import Expression from "./Expression";
import MotifEnrichmentMEME from "./MotifEnrichmentMEME";
import MotifEnrichmentSELEX from "./MotifEnrichmentSELEX";
import EpigeneticProfile from "./EpigeneticProfile";

const FactorDetailsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const species = segments[2];
  const factor = segments[3];
  const detail = segments[4] || "Function";

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`/TranscriptionFactor/${species}/${factor}/${newValue}`);
  };

  const renderTabContent = () => {
    switch (detail) {
      case "Function":
        return <FunctionTab />;
      case "Expression":
        return <Expression />;
      case "MotifEnrichmentMEME":
        return <MotifEnrichmentMEME />;
      case "MotifEnrichmentSELEX":
        return <MotifEnrichmentSELEX />;
      case "EpigeneticProfile":
        return <EpigeneticProfile />;
      default:
        return <FunctionTab />;
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={2}>
        {imageUrl && (
          <Box>
            <img
              src={imageUrl}
              alt={factorData?.name}
              style={{ maxWidth: "300px" }}
            />
          </Box>
        )}
        <Box style={{ flex: 1, marginLeft: "20px" }}>
          <Typography variant="h4">{factorData?.name}</Typography>
          <Typography variant="h6">Function</Typography>
          <Typography variant="body1">{factorData?.factor_wiki}</Typography>
          <IconButton
            onClick={() => {
              const tsvData = [
                "image\tlabel\tname\tdescription",
                `${imageUrl || ""}\t${factorData?.name}\t${
                  factorData?.factor_wiki || ""
                }`,
              ].join("\n");
              const dataStr = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(
                tsvData
              )}`;
              const downloadAnchorNode = document.createElement("a");
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute(
                "download",
                `${factorData?.name}.tsv`
              );
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            aria-label="download"
          >
            <SaveAltIcon />
          </IconButton>
        </Box>
      </Box>
      <ContentCard
        title={factorData?.name || ""}
        count={0}
        description={factorData?.factor_wiki || ""}
      />
      <ReferenceSection title="References" sources={references} />
      <Tabs value={detail} onChange={handleTabChange}>
        <Tab
          label="Function"
          value="Function"
          component="a"
          href={`/TranscriptionFactor/${species}/${factor}/Function`}
        />
        <Tab
          label="Expression (RNA-seq)"
          value="Expression"
          component="a"
          href={`/TranscriptionFactor/${species}/${factor}/Expression`}
        />
        <Tab
          label="Motif Enrichment (MEME, ChIP-seq)"
          value="MotifEnrichmentMEME"
          component="a"
          href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME`}
        />
        <Tab
          label="Motif Enrichment (SELEX)"
          value="MotifEnrichmentSELEX"
          component="a"
          href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentSELEX`}
        />
        <Tab
          label="Epigenetic Profile"
          value="EpigeneticProfile"
          component="a"
          href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
        />
      </Tabs>
      <Box mt={4}>{renderTabContent()}</Box>
    </Container>
  );
};

export default FactorDetailsPage;
