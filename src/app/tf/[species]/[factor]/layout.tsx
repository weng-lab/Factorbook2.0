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
  Link as MuiLink,
  Breadcrumbs
} from "@mui/material";
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/query";
import { FactorQueryResponse } from "@/components/celltype/types";
import Link from "next/link";
import { ApiContext } from "@/apicontext";
import { inflate } from "pako";
import { associateBy } from "queryz";
import { useRouter } from "next/navigation";
import FactorTabs from "./factortabs";
import { DeepLearnedSELEXMotifsMetadataQueryResponse } from "./types";
import { DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY } from "./queries";
import { ChevronRight, NavigateNext } from "@mui/icons-material";

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

  const router = useRouter()

  // Normalize factor name for URL
  /**
   * @todo this is in both this layout file and in page.tsx. 
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
  // This feels like something that should be done server side
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
      <Stack direction={{xs: "column", md: "row"}} justifyContent={"space-between"} m={1} spacing={{xs: 2, md: 0}}>
        {/* Breadcrumb */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} id="breadcrumbs">
          <MuiLink underline="hover" color={'inherit'} component={Link} href="/">Home</MuiLink>
          <MuiLink underline="hover" color={'inherit'} component={Link} href={`/tf/${species}`}>Transcription Factor</MuiLink>
          <Typography color={"text.primary"}>{factorForUrl}</Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Stack
          id="tfinfo"
          direction={{xs: "column", md: "row"}}
          spacing={{xs: 0, md: 2}}
        >
          <Typography variant="h4">
            {factorForUrl}
          </Typography>
          <Box>
            <Typography variant="body2">
              {label}
            </Typography>
            <Typography variant="body2">
              {TFregion}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <FactorTabs
        species={species}
        factor={factorForUrl}
        hasSelexData={hasSelexData} // Dynamically hide tab based on data
      />
      {/* Tab Content */}
      <Box mt={2}>{<section>{children}</section>}</Box>
    </Stack>
  )
}