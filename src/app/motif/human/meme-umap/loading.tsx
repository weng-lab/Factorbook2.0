import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingMemeUmap() {
    return (
        <Stack spacing={2} p={4}>
            <br />
            <Skeleton variant="rounded" width="100%" height={60} />
            <Stack direction="row" justifyContent={"space-between"}>
                <Box sx={{ flex: 2, height: 550, display: "flex"}}>
                    <Skeleton variant="rounded" width="90%" height={"100%"} />
                </Box>
                <Box sx={{ flex: 2, height: 550, paddingLeft: 4 }}>
                    <Skeleton variant="rounded" width="100%" height={250} />
                </Box>
            </Stack>
        </Stack>
    );
}
