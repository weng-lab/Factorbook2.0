import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Stack direction="column" m={2}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent={"space-between"} m={1} spacing={{ xs: 2, md: 0 }}>
          <Skeleton variant="text" width="20%" height={40} />
          <Skeleton variant="rounded" width="20%" height={80} />
        </Stack>
        <Skeleton variant="text" width="80%" height={40} />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ width: "100%", height: "70vh", p: 4 }}>
        <Skeleton variant="rounded" width={300} height="100%" />
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="rounded" width="100%" height="50%" />
          <Skeleton variant="rounded" width="100%" height="50%" />
        </Stack>
      </Stack>
    </>
  );
}