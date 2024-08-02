import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface Props {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <TextField value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter search query" />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBox;
