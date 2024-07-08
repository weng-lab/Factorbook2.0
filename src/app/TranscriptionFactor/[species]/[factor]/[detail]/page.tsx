"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
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
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import ContentCard from "@/components/ContentCard";
import ReferenceSection from "@/components/Container";
import FunctionTab from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/Function";
import Expression from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/Expression";
import MotifEnrichmentMEME from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/MotifEnrichmentMEME";
import MotifEnrichmentSELEX from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/MotifEnrichmentSELEX";
import EpigeneticProfile from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/EpigeneticProfile";
import Search from "@/app/TranscriptionFactor/[species]/[factor]/[detail]/Search";
import Link from "next/link";

const FactorDetailsPage = () => {
  const router = useRouter();
  const { species, factor, detail = "Function" } = useParams();

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
      case "Search":
        return <Search />;
      default:
        return <FunctionTab />;
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        {imageUrl && (
          <Box>
            <img
              src={imageUrl}
              alt={factorData?.name}
              style={{ width: "150px", marginRight: "20px" }}
            />
          </Box>
        )}
        <Box>
          <Typography variant="h4" style={{ color: "#494A50" }}>
            {factorData?.name}
          </Typography>
          <Typography variant="h6" style={{ color: "#494A50" }}>
            {detail}
          </Typography>
          <Typography variant="body1">{factorData?.factor_wiki}</Typography>
          <IconButton
            onClick={() => {
              const tsvData = [
                "image\tlabel\tname\tdescription",
                `${imageUrl || ""}\t${factorData?.name}\t${
                  factorData?.description || ""
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
      <Box mb={2}>
        <Link href="/">Homepage</Link> &gt;{" "}
        <Link href={`/TranscriptionFactor/${species}`}>
          Transcription Factor
        </Link>{" "}
        &gt; <Typography component="span">{factor}</Typography>
      </Box>
      <Box display="flex">
        <Box
          style={{
            backgroundColor: "var(--grey-500, #494A50)",
            padding: "16px",
            borderRadius: "8px",
            marginRight: "20px",
          }}
        >
          <ReferenceSection title="References" sources={references} />
        </Box>
        <Box style={{ flex: 1 }}>
          <Tabs
            value={detail}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label="Function"
              value="Function"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Function`}
            />
            <Tab
              label="Expression (RNA-seq)"
              value="Expression"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Expression`}
            />
            <Tab
              label="Motif Enrichment (MEME, ChIP-seq)"
              value="MotifEnrichmentMEME"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME`}
            />
            <Tab
              label="Motif Enrichment (SELEX)"
              value="MotifEnrichmentSELEX"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentSELEX`}
            />
            <Tab
              label="Epigenetic Profile"
              value="EpigeneticProfile"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
            />
            <Tab
              label={`Search ${factor} peaks by region`}
              value="Search"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Search`}
            />
          </Tabs>
          <Box mt={2}>{renderTabContent()}</Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FactorDetailsPage;
