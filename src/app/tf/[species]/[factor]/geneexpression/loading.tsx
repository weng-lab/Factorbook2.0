import { Skeleton, Stack, Grid, Box, Typography } from "@mui/material";

export default function LoadingExpression() {
  return (
    <Box sx={{ marginTop: "1em" }} height={"50vh"}>
      <Grid container height={"100%"}>
        <Grid item xs={12} sm={3}>
          <Skeleton variant="rounded" width={"100%"} height="50%" />
        </Grid>
        <Grid item sm={0.5}></Grid>
        <Grid item xs={12} sm={8.5}>
          <Stack height={"100%"}>
            <Skeleton variant="rounded" width={"100%"} >
              <Typography variant="h5">.</Typography>
            </Skeleton>
            <br />
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 5
                }}
              >
                <Skeleton variant="rounded" width={"25%"} height={"41px"} />
                <Skeleton variant="rounded" width={"25%"} height={"41px"} />
              </Box>
            </>
            <br />
            <Skeleton variant="rounded" width={"100%"} height={"60%"} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
