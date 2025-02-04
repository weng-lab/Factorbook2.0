"use client"

import { Skeleton, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import LoadingFunction from "./function/loading";
import LoadingExpression from "./geneexpression/loading";
import LoadingMotif from "./motif/loading";
import LoadingHistone from "./histone/loading";
import LoadingRegions from "./regions/loading";
import LoadingSelex from "./deeplearnedselexmotif/loading";

export default function Loading() {
  const tab = usePathname().split('/')[4];

  const renderLoadingState = () => {
    switch (tab) {
      case "function":
        return LoadingFunction();
      case "geneexpression":
        return LoadingExpression();
      case "motif":
        return (
          <Stack direction="row" spacing={2} sx={{ width: "100%", height: "70vh", p: 4 }}>
            <Skeleton variant="rounded" width={400} height="100%" />
            {LoadingMotif()}
          </Stack>
        );
        case "histone":
          return (
            <Stack direction="row" spacing={2} sx={{ width: "100%", height: "70vh", p: 4 }}>
            <Skeleton variant="rounded" width={400} height="100%" />
            {LoadingHistone()}
          </Stack>
          );
        case "regions":
          return LoadingRegions();
        case "deeplearnedselexmotif":
          return LoadingSelex();
      default:
        return <Skeleton variant="rectangular" width="100%" height={200} />;
    }
  };

  return (
    <>
      <Stack direction="column" m={2}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent={"space-between"} m={1} spacing={{ xs: 2, md: 0 }}>
          <Skeleton variant="text" width="20%" height={40} />
          <Skeleton variant="rounded" width="20%" height={80} />
        </Stack>
        <Skeleton variant="text" width="80%" height={40} />
      </Stack>
      {renderLoadingState()}
    </>
  );
}