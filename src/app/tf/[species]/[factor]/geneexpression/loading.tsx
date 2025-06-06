import { Skeleton, Stack, Grid, Box, Typography } from "@mui/material";

export default function LoadingExpression() {
  return (
    <Stack sx={{ marginTop: "1em", marginX: "1em" }} spacing={2}>
        <Skeleton variant="rounded" width={400} height={62}/>
        <Stack direction={"row"} justifyContent={"space-between"}>
            <Skeleton variant="rounded" width={225} height={62}/>
            <Skeleton variant="rounded" width={108} height={62}/>
            <Skeleton variant="rounded" width={166} height={62}/>
        </Stack>
        <Skeleton variant="rounded" width={"100%"} height={600}/>
    </Stack>
  );
}