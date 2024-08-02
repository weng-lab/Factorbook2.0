import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { BROWSER_QUERY } from "./Queries";
import { BrowserQueryResponse } from "./Types";

const useBrowserData = (region: string) => {
  const { data, loading, error } = useQuery<BrowserQueryResponse>(BROWSER_QUERY, {
    variables: { region },
  });

  const [browserData, setBrowserData] = useState<string>("");

  useEffect(() => {
    if (data && data.browser) {
      setBrowserData(data.browser.data);
    }
  }, [data]);

  return { browserData, loading, error };
};

export default useBrowserData;
