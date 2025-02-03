import { Skeleton, Stack, Typography } from "@mui/material";

export default function LoadingMotif() {
    return (
        <Stack spacing={2} sx={{ flex: 1, height: "100%" }}>
            <Skeleton width={"60%"}>
                <Typography variant="h5">.</Typography>
            </Skeleton>
            <Skeleton variant="rounded" width="100%" height="50%" />
            <Skeleton variant="rounded" width="100%" height="50%" />
        </Stack>
    );
}
