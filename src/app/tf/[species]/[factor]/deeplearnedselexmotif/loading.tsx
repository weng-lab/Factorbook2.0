import { Skeleton, Stack, Box, Divider } from "@mui/material";

export default function LoadingSelex() {
    return (
        <>
            {/* HEADER */}
            <Skeleton variant="rounded" width={"30%"} height="57px" />
            <br />
            <Stack divider={<Divider sx={{ marginY: 2 }} />} spacing={3}>

                {/* LINE & BAR PLOTS */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
                    <Box>
                        <Skeleton variant="rounded" width={300} height={300} />
                    </Box>
                    <Box>
                        <Skeleton variant="rounded" width={300} height={300} />
                    </Box>
                </Box>

                {/* CYCLES */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "space-between" }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Box key={i} sx={{ flex: "1 1 auto", textAlign: "flex-start" }}>
                            <Skeleton variant="text" width={100} height={30} />
                            <Skeleton variant="rounded" width={300} height={200} />
                        </Box>
                    ))}
                </Box>
            </Stack>
        </>
    );
}
