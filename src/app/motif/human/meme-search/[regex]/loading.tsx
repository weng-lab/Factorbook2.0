import { Box, Skeleton } from "@mui/material";

export default function LoadingMotifSearch() {
    return (
      <Box 
        sx={{ 
          width: "100%", 
          height: "100%", 
          display: "flex", 
          alignItems: "center",
        }}
      >
        <Skeleton variant="rounded" width="90%" height="90%" />
      </Box>
    );
  }
