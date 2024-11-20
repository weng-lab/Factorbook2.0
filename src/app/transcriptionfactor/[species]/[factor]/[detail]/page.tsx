"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/query";
import { FactorQueryResponse } from "@/components/celltype/types";
import FunctionTab from "./function";
import MotifEnrichmentMEME from "@/components/motifmeme/motifenrichmentmeme";
import PeakSearch from "./peaksearch";
import Link from "next/link";
import DeepLearnedSelexMotifs from "./motifenrichmentselex";
import { ApiContext } from "@/apicontext";
import GeneExpressionPage from "./geneexpression";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./queries";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./types";
import EpigeneticProfile from "./epigeneticprofile";
import FactorTabs from "./factortabs";
import { inflate } from "pako";
import { associateBy } from "queryz";
import { formatFactorName } from "@/utilities/misc";

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

interface TFData {
  "HGNC symbol": string;
  "TF assessment": string;
  [key: string]: any;
}

const FactorDetailsPage = () => {
  const apiContext = useContext(ApiContext);
  const router = useRouter();
  const {
    species,
    factor,
    detail = "function",
  } = useParams<{
    species: string;
    factor: string;
    detail: string;
  }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Normalize factor name for URL
  const factorForUrl =
    species.toLowerCase() === "human"
      ? factor.toUpperCase()
      : species.toLowerCase() === "mouse"
      ? factor.charAt(0).toUpperCase() + factor.slice(1).toLowerCase()
      : factor;

  const [tfA, setTFA] = useState<Map<string, TFData> | null>(null);
  const [genomicRange, setGenomicRange] = useState<string>("No data available");
  const [hasSelexData, setHasSelexData] = useState(false);

  // Redirect for consistent URL structure
  useEffect(() => {
    if (species.toLowerCase() === "human" && factor !== factorForUrl) {
      router.replace(
        `/transcriptionfactor/${species}/${factorForUrl}/${detail}`
      );
    }
  }, [species, factor, factorForUrl, detail, router]);

  // Fetch factor description
  const { data, loading, error } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species.toLowerCase() === "human" ? "GRCh38" : "mm10",
        name: [factorForUrl],
      },
    }
  );

  // Fetch Selex Data
  const { data: selexData, loading: selexLoading } =
    useQuery<DeepLearnedSELEXMotifsMetadataQueryResponse>(
      DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY,
      {
        variables: {
          tf: factorForUrl,
          species: species.toLowerCase(),
          selex_round: [1, 2, 3, 4, 5, 6, 7],
        },
        context: apiContext,
      }
    );

  // Load TF Assignments
  useEffect(() => {
    fetch("/tf-assignments.json.gz")
      .then((response) => response.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => inflate(buffer, { to: "string" }))
      .then((jsonString) => {
        const parsedData: TFData[] = JSON.parse(jsonString);
        console.log("TF Assignments Loaded:", parsedData);
        setTFA(
          associateBy(
            parsedData,
            (item) => item["HGNC symbol"].toLowerCase(), // Normalize key
            (item) => item
          )
        );
      })
      .catch((err) => console.error("Failed to load TF assignments:", err));
  }, []);

  // Update `hasSelexData` based on selexData
  useEffect(() => {
    if (selexData && selexData.deep_learned_motifs?.length > 0) {
      setHasSelexData(true);
    } else {
      setHasSelexData(false);
    }
  }, [selexData]);

  // Compute Genomic Range
  useEffect(() => {
    if (data && data.factor && data.factor.length > 0) {
      const factorData = data.factor[0];
      if (factorData.coordinates) {
        const range = `${
          factorData.coordinates.chromosome
        }:${factorData.coordinates.start.toLocaleString()}-${factorData.coordinates.end.toLocaleString()}`;
        setGenomicRange(range);
      }
    }
  }, [data]);

  if (loading || selexLoading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  // Compute Label
  const tfAssignment = tfA?.get(factorForUrl.toLowerCase()); // Use normalized key
  const label =
    tfAssignment === undefined
      ? ""
      : (tfAssignment["TF assessment"] as string).includes("Likely")
      ? "Likely sequence-specific TF"
      : SEQUENCE_SPECIFIC.has(tfAssignment["TF assessment"])
      ? "Sequence-specific TF"
      : "Non-sequence-specific TF";

  const renderTabContent = () => {
    switch (detail) {
      case "function":
        return (
          <FunctionTab
            factor={factorForUrl}
            assembly={species === "human" ? "GRCh38" : "mm10"}
            datasets={{
              peakDataset: {
                datasets: [],
                partitionByTarget: [],
                counts: {
                  total: 0,
                },
                partitionByBiosample: [],
              },
            }}
            datasetsLoading={false}
          />
        );
      case "expression":
        return (
          <GeneExpressionPage
            gene_name={factorForUrl}
            assembly={species === "human" ? "GRCh38" : "mm10"}
          />
        );
      case "motifenrichmentmeme":
        return <MotifEnrichmentMEME factor={factorForUrl} species={species} />;
      case "motifenrichmentselex":
        return hasSelexData ? (
          <DeepLearnedSelexMotifs factor={factorForUrl} species={species} />
        ) : null;
      case "epigeneticprofile":
        return <EpigeneticProfile factor={factorForUrl} species={species} />;
      case "peaksearch":
        return <PeakSearch />;
      default:
        return (
          <FunctionTab
            factor={factorForUrl}
            assembly={species.toLowerCase() === "human" ? "GRCh38" : "mm10"}
            datasets={{
              peakDataset: {
                datasets: [],
                partitionByTarget: [],
                counts: {
                  total: 0,
                },
                partitionByBiosample: [],
              },
            }}
            datasetsLoading={false}
          />
        );
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "20px 10px" : "40px 25.5px",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <Box mb={2}>
          <Link href="/">Homepage</Link> &gt;{" "}
          <Link href={`/transcriptionfactor/${species}`}>
            Transcription Factor
          </Link>{" "}
          &gt; <Typography component="span">{factorForUrl}</Typography>
        </Box>

        {/* Header Section */}
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h4"
            style={{ fontWeight: "600" }}
            ml={"auto"}
            mr={2}
          >
            {factorForUrl}
          </Typography>
          <Box textAlign="right">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2">{genomicRange}</Typography>
          </Box>
        </Box>

        {/* Factor Tabs */}
        <FactorTabs
          species={species}
          factor={factorForUrl}
          detail={detail}
          hasSelexData={hasSelexData} // Dynamically hide tab based on data
        />

        {/* Tab Content */}
        <Box mt={2}>{renderTabContent()}</Box>
      </Box>
    </Box>
  );
};

export default FactorDetailsPage;
