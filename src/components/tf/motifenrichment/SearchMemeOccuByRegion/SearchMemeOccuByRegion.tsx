import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { SEARCH_MEME_OCCU_BY_REGION_QUERY } from "./Queries";
import MemeOccuDataTable from "./MemeOccuDataTable";
import { SearchMemeOccuByRegionQueryResponse } from "./Types";

const SearchMemeOccuByRegion: React.FC = () => {
  const [region, setRegion] = useState<string>("");
  const { data, loading, error } =
    useQuery<SearchMemeOccuByRegionQueryResponse>(
      SEARCH_MEME_OCCU_BY_REGION_QUERY,
      {
        skip: !region, // Skip the query if region is empty
      }
    );

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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <MemeOccuDataTable rows={data.meme_occurrences} />}
    </Box>
  );
};

export default SearchMemeOccuByRegion;
