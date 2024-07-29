import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Paper,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useGeneExpressionData } from "@/components/tf/geneexpression/hooks";
import { GeneExpressionPageProps } from "@/components/tf/geneexpression/types";
import { downloadTSV, downloadSVG } from "@/components/tf/geneexpression/utils";
import { formatFactorName } from "@/utilities/misc";

const MotifEnrichmentMEME: React.FC<GeneExpressionPageProps> = (props) => {
  const [polyA, setPolyA] = useState(false);

  const formattedFactorName = useMemo(() => {
    if (!props.gene_name) {
      console.warn("Gene name is empty or undefined.");
      return "";
    }
    return formatFactorName(
      props.gene_name,
      props.assembly === "Human" ? "GRCh38" : "mm10"
    );
  }, [props.gene_name, props.assembly]);

  const { data, loading, error } = useGeneExpressionData(
    props.assembly || "GRCh38", // Providing a default value for assembly
    formattedFactorName || "default_gene", // Providing a default value for gene name
    polyA ? "polyA plus RNA-seq" : "total RNA-seq"
  );

  const biosampleTypes = useMemo(() => {
    if (!data) return [];
    const types = new Set(data.gene_dataset.map((item) => item.biosample_type));
    return Array.from(types).sort();
  }, [data]);

  const [biosampleType, setBiosampleType] = useState<string | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const download = useCallback(() => {
    if (!data) return;
    const tsvContent = data.gene_dataset
      .map((item) =>
        item.gene_quantification_files.map((file) =>
          file.quantifications.map((q) => ({
            biosample: item.biosample,
            tissue: item.tissue,
            biosample_type: item.biosample_type,
            accession: item.accession,
            file_accession: file.accession,
            tpm: q.tpm,
          }))
        )
      )
      .flat(2)
      .map(
        (item) =>
          `${item.biosample}\t${item.tissue}\t${item.biosample_type}\t${item.accession}\t${item.file_accession}\t${item.tpm}`
      )
      .join("\n");
    downloadTSV(
      `biosample\ttissue\tbiosample_type\taccession\tfile_accession\ttpm\n${tsvContent}`,
      `factorbook-${props.gene_name}-expression.tsv`
    );
  }, [data, props.gene_name]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setPolyA(newValue);
  };

  if (loading) return <CircularProgress style={{ marginTop: "7em" }} />;
  if (error)
    return (
      <Typography variant="body1" color="error">
        {error.message}
      </Typography>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" color="default">
        <Tabs
          value={polyA}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Poly-A enriched" value={true} />
          <Tab label="Total RNA-seq" value={false} />
        </Tabs>
      </AppBar>
      <Grid container>
        <Grid item xs={3}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Select a biosample type:
            </Typography>
            {biosampleTypes.map((type, index) => (
              <MenuItem
                key={type}
                onClick={() => setBiosampleType(type)}
                selected={type === biosampleType}
              >
                {type}
              </MenuItem>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Typography variant="h5" style={{ marginLeft: "5em" }}>
              {props.gene_name} expression in {biosampleType}: RNA-seq
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              style={{ marginLeft: "7.5em" }}
              onClick={download}
            >
              Download all {polyA ? "poly-A enriched" : "total RNA-seq"}{" "}
              expression data for {props.gene_name}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              style={{ marginLeft: "7.5em" }}
              onClick={() =>
                ref.current &&
                downloadSVG(ref, `${props.gene_name}-gene-expression.svg`)
              }
            >
              Export plot as SVG
            </Button>
            {data ? (
              <svg ref={ref} width="100%" height="400"></svg>
            ) : (
              <Typography variant="body1" color="error">
                No data available for the selected biosample type.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotifEnrichmentMEME;
