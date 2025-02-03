import { Skeleton, Stack, Grid } from "@mui/material";

export default function LoadingExpression() {
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%", height: "70vh", p: 4 }}>
        <Skeleton variant="rounded" width={300} height="100%" />
    </Stack>
  );
}
