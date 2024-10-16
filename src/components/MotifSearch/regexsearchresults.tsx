import React, { useState } from "react";
import { MotifSearchResultSet } from "./motifsearchresultset";
import { regexToPWM } from "./motifutil";
import {
  Pagination,
  PaginationItem,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";

const MOTIFS_PER_PAGE = 3;

const RegexSearchResults: React.FC<{ regex: string }> = ({ regex }) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
            marginTop: isMobile ? "16px" : "24px",
            marginLeft: isMobile ? "0px" : "450px",
          }}
        >
          <Pagination
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
        </Box>
      )}
      <br />
    </>
  );
};

export default RegexSearchResults;
