import { Box, Button, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";

export default function LoadingRegions() {
    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width={"100%"} height={"41px"} />
                </Grid>
                <Grid item>
                    <Skeleton variant="rounded" width={"220px"} height={"41px"} sx={{ padding: "8px 24px" }} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mt: 4, mx: "auto", maxWidth: "800px", height: "40%" }}>
                <br />
                <Skeleton variant="rounded" width={"50%"} >
                    <Typography variant="h6" gutterBottom>.</Typography>
                </Skeleton>
                <Skeleton variant="rounded" width={"100%"} height={"41px"}/>
                <Skeleton variant="rounded" width={"50%"} >
                    <Typography variant="body2" sx={{ marginLeft: "8px", marginTop: 1 }} gutterBottom>.</Typography>
                </Skeleton>
                <Skeleton variant="rounded" width={"50%"} >
                    <Typography variant="h6" gutterBottom>.</Typography>
                </Skeleton>
                <Skeleton variant="rounded" width={"100%"} height={"200px"} />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Skeleton variant="rounded">
                        <Button
                            sx={{
                                margin: "auto",
                                borderRadius: "24px",
                            }}
                        />
                    </Skeleton>
                </Box>
            </Box>
        </>
    );
}
