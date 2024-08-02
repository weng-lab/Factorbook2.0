import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import useBrowserData from "./Hooks";

const BrowserPage: React.FC = () => {
  const [region, setRegion] = useState<string>("");
  const { browserData, loading, error } = useBrowserData(region);

  const handleSearch = () => {
    // Trigger the query
  };

  return (
    <Box>
      <TextField
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="Enter region"
      />
      <Button onClick={handleSearch}>Search</Button>
      {loading && <CircularProgress />}
      {error && <Typography>Error: {error.message}</Typography>}
      {browserData && (
        <Box>
          <Typography>Browser Data:</Typography>
          <pre>{JSON.stringify(browserData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default BrowserPage;
