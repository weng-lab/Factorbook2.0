import React, { useState } from "react";
import { MotifSearchResultSet } from "./motifsearchresultset";
import { regexToPWM } from "./MotifUtil";
import { Pagination, PaginationItem } from "@mui/material";

const MOTIFS_PER_PAGE = 3;

const RegexSearchResults: React.FC<{ regex: string }> = ({ regex }) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <MotifSearchResultSet
        assembly={"GRCh38"}
        pwm={regexToPWM(regex)}
        offset={+(page || "1") - 1}
        onResultsLoaded={setTotal}
      />
      {total > 0 && (
        <Pagination
          sx={{ marginLeft: "450px" }}
          renderItem={(item) => (
            <PaginationItem
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#8169BF",
                },
              }}
              {...item}
            />
          )}
          onChange={handleChange}
          count={Math.ceil(total / MOTIFS_PER_PAGE)}
          page={+(page || "1")}
          color="secondary"
          showFirstButton
          showLastButton
        />
      )}
      <br />
    </>
  );
};
export default RegexSearchResults;
