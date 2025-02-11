import { Box, Skeleton } from "@mui/material";

export default function LoadingTFPortal() {
    return (
      <Box 
        sx={{ 
          width: "100vw", 
          height: "100vh",
        }}
      >
        <Skeleton variant="rounded" width="80%" height="90%" />
      </Box>
    );
  }
