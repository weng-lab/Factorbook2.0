"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        species.toLowerCase() !== "mm10"
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
    <Box
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "20px 10px" : "40px 25.5px",
        minHeight: "100vh",
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
          marginRight: isMobile ? "0" : "20px",
          width: isMobile ? "100%" : "300px",
          minHeight: isMobile ? "auto" : "calc(100vh - 80px)", // Adjust height to fill the viewport without overlapping header/footer
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
                width: isMobile ? "100%" : "200px",
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

      <Box style={{ flex: 1 }}>
        <Box mb={2}>
          <Link href="/">Homepage</Link> &gt;{" "}
          <Link href={`/TranscriptionFactor/${species}`}>
            Transcription Factor
          </Link>{" "}
          &gt; <Typography component="span">{factor}</Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <ArrowBackIosIcon
            onClick={() => {
              const tabsScroller = document.querySelector(".MuiTabs-scroller");
              if (tabsScroller) {
                tabsScroller.scrollBy({ left: -200, behavior: "smooth" });
              }
            }}
          ></ArrowBackIosIcon>
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
              sx={{
                color: detail === "Function" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Expression (RNA-seq)"
              value="Expression"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Expression`}
              sx={{
                color: detail === "Expression" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Motif Enrichment (MEME, ChIP-seq)"
              value="MotifEnrichmentMEME"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentMEME`}
              sx={{
                color: detail === "MotifEnrichmentMEME" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Motif Enrichment (SELEX)"
              value="MotifEnrichmentSELEX"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/MotifEnrichmentSELEX`}
              sx={{
                color:
                  detail === "MotifEnrichmentSELEX" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label="Epigenetic Profile"
              value="EpigeneticProfile"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/EpigeneticProfile`}
              sx={{
                color: detail === "EpigeneticProfile" ? "#8169BF" : "inherit",
              }}
            />
            <Tab
              label={`Search ${factor} peaks by region`}
              value="Search"
              component={Link}
              href={`/TranscriptionFactor/${species}/${factor}/Search`}
              sx={{
                color: detail === "Search" ? "#8169BF" : "inherit",
              }}
            />
          </Tabs>
          <ArrowForwardIosIcon
            onClick={() => {
              const tabsScroller = document.querySelector(".MuiTabs-scroller");
              if (tabsScroller) {
                tabsScroller.scrollBy({ left: 200, behavior: "smooth" });
              }
            }}
          ></ArrowForwardIosIcon>
        </Box>

        <Box mt={2}>{renderTabContent()}</Box>
      </Box>
    </Box>
  );
};

export default FactorDetailsPage;
