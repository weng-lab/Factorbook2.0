import { Skeleton, Stack } from "@mui/material";

export default function LoadingFunction() {
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%", height: "70vh", p: 4 }}>
        <Skeleton variant="rounded" width={300} height="100%" />
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Skeleton variant="rounded" width="100%" height="50%" />
        <Skeleton variant="rounded" width="100%" height="50%" />
      </Stack>
    </Stack>
  );
}
