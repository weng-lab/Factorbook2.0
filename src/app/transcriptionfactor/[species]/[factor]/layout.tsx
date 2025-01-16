'use client'

import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/query";
import { FactorQueryResponse } from "@/components/celltype/types";
import Link from "next/link";
import { ApiContext } from "@/apicontext";
import { inflate } from "pako";
import { associateBy } from "queryz";
import { useParams } from "next/navigation";
import FactorTabs from "./[detail]/factortabs";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./[detail]/types";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./[detail]/queries";

const SEQUENCE_SPECIFIC = new Set(["Known motif", "Inferred motif"]);

interface TFData {
  "HGNC symbol": string;
  "TF assessment": string;
  [key: string]: any;
}

export default function FactorDetailsLayout({
  children,
  params: {
    species,
    factor,
  }
}: {
  children: React.ReactNode,
  params: {
    species: string,
    factor: string,
  }
}) {
  const apiContext = useContext(ApiContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  /**
   * extracting detail here since this layout is not within the [detail] route and thus can't be technically gauranteed. Extracting it here to have the tabs state live here
   */
  const {
    detail = 'function'
  } = useParams<{
    detail: string
  }>()

  // Normalize factor name for URL
  /**
   * @todo this is in both this layout file and in page.tsx. I feel like this duplication should be fixed
   */
  const factorForUrl =
    species.toLowerCase() === "human"
      ? factor.toUpperCase()
      : species.toLowerCase() === "mouse"
        ? factor.charAt(0).toUpperCase() + factor.slice(1).toLowerCase()
        : factor;

  const [tfA, setTFA] = useState<Map<string, TFData> | null>(null);
  const [hasSelexData, setHasSelexData] = useState(false);

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

  // Update `hasSelexData` based on selexData
  useEffect(() => {
    if (selexData && selexData.deep_learned_motifs?.length > 0) {
      setHasSelexData(true);
    } else {
      setHasSelexData(false);
    }
  }, [selexData]);

  // Load TF Assignments
  /**
   *  I feel like this should be done server-side?
   * */
  useEffect(() => {
    fetch("/tf-assignments.json.gz")
      .then((response) => response.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => inflate(buffer, { to: "string" }))
      .then((jsonString) => {
        const parsedData: TFData[] = JSON.parse(jsonString);
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

  const TFregion = data?.factor[0].coordinates ? `${data.factor[0].coordinates.chromosome}:${data.factor[0].coordinates.start.toLocaleString()}-${data.factor[0].coordinates.end.toLocaleString()}` : ''

  if (loading) return <CircularProgress />;
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

  return (
    <Stack direction="column" m={2}>
      <Stack direction="row" justifyContent={"space-between"} flexWrap={"wrap"}>
        {/* Breadcrumb */}
        <Typography>
          <Link href="/">Homepage</Link>
          {" > "}
          <Link  href={`/transcriptionfactor/${species}`}>Transcription Factor</Link>
          {" > "}
          {factorForUrl}
        </Typography>

        {/* Header Section */}
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
          alignSelf={"flex-end"}
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
            <Typography variant="body2">
              {label}
            </Typography>
            <Typography variant="body2">
              {TFregion}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <FactorTabs
        species={species}
        factor={factorForUrl}
        detail={detail}
        hasSelexData={hasSelexData} // Dynamically hide tab based on data
      />
      {/* Tab Content */}
      <Box mt={2}>{<section>{children}</section>}</Box>
    </Stack>
  )
}