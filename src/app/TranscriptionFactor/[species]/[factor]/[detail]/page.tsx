"use client";

import React, { useState } from "react";
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
import { getRCSBImageUrl } from "@/components/tf/Functions";
import ReferenceSection from "@/components/Container";
import FunctionTab from "./Function";
import Expression from "./Expression";
import MotifEnrichmentMEME from "./MotifEnrichmentMEME";
import MotifEnrichmentSELEX from "./MotifEnrichmentSELEX";
import EpigeneticProfile from "./EpigeneticProfile";
import Search from "./Search";
import Link from "next/link";

const FactorDetailsPage = () => {
  const router = useRouter();
  const { species, factor, detail = "Function" } = useParams();
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
    <Container
      style={{ display: "flex", padding: "40px 25.5px", minHeight: "100vh" }}
    >
      <Box
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "var(--grey-500, #494A50)",
          padding: "16px",
          borderRadius: "8px",
          marginRight: "20px",
          height: "100%",
          width: "300px",
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
              style={{ width: "200px", marginBottom: "20px" }}
            />
            <IconButton
              onClick={() => setImageVisible(!imageVisible)}
              style={{ position: "absolute", top: "0", right: "-30px" }}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        )}
        {!imageVisible && (
          <IconButton onClick={() => setImageVisible(!imageVisible)}>
            <ArrowDropDownIcon />
          </IconButton>
        )}
        <ReferenceSection title="References" sources={references} />
      </Box>

      <Box style={{ flex: 1 }}>
        <Box mb={2}>
          <Link href="/">Homepage</Link> &gt;{" "}
          <Link href={`/TranscriptionFactor/${species}`}>
            Transcription Factor
          </Link>{" "}
          &gt; <Typography component="span">{factor}</Typography>
        </Box>

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
    </Container>
  );
};

export default FactorDetailsPage;
