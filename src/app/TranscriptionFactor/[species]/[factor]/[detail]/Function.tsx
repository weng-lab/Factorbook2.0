"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  CardContent,
  Card,
  CardMedia,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // Importing Grid2 from Material-UI
import { FACTOR_DESCRIPTION_QUERY } from "@/components/tf/Query";
import { FactorQueryResponse } from "@/components/CellType/types";
// import { getRCSBImageUrl } from "@/components/tf/Functions";
import Link from "next/link";
import ContentCard from "@/components/ContentCard";

const looksBiological = (value: string): boolean => {
  const v = value.toLowerCase();
  return v.includes("gene") || v.includes("protein");
};

// const TFDetails = (assembly: string, factor: string) => [
//   {
//     title: "ENCODE",
//     url: `https://www.encodeproject.org/search/?searchTerm=${factor}&type=Experiment&assembly=${assembly}&assay_title=TF+ChIP-seq&files.output_type=optimal+IDR+thresholded+peaks&files.output_type=pseudoreplicated+IDR+thresholded+peaks&status=released`,
//   },
//   {
//     title: "Ensembl",
//     url: "http://www.ensembl.org/Human/Search/Results?q=" + factor + ";site=ensembl;facet_species=Human",
//   },
//   {
//     title: "GO",
//     url: "http://amigo.geneontology.org/amigo/search/bioentity?q=" + factor,
//   },
//   {
//     title: "GeneCards",
//     url: "http://www.genecards.org/cgi-bin/carddisp.pl?gene=" + factor,
//   },
//   {
//     title: "HGNC",
//     url: "http://www.genenames.org/cgi-bin/gene_search?search=" + factor + "&submit=Submit",
//   },
//   {
//     title: "RefSeq",
//     url: `http://www.ncbi.nlm.nih.gov/nuccore/?term=${factor}+AND+${
//       assembly.toLowerCase() !== "mm10" ? '"Homo sapiens"[porgn:__txid9606]' : '"Mus musculus"[porgn]'
//     }`,
//   },
//   {
//     title: "UCSC Genome Browser",
//     url: `https://genome.ucsc.edu/cgi-bin/hgTracks?clade=mammal&org=Human&db=hg19&position=${factor}&hgt.suggestTrack=knownGene&Submit=submit`,
//   },
//   {
//     title: "UniProt",
//     url: `http://www.uniprot.org/uniprot/?query=${factor}&sort=score`,
//   },
//   {
//     title: "Wikipedia",
//     url: `https://en.wikipedia.org/wiki/${factor}`,
//   },
// ];

const FunctionTab = () => {
  const { species, factor } = useParams();

  const { data, loading, error } = useQuery<FactorQueryResponse>(
    FACTOR_DESCRIPTION_QUERY,
    {
      variables: {
        assembly: species === "Human" ? "GRCh38" : "mm10",
        name: [factor],
      },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const factorData = data?.factor[0];
  // const tfRows = TFDetails(species === "Human" ? "GRCh38" : "mm10", factor);

  // const renderTFDetails = () => (
  //   <Table>
  //     <TableBody>
  //       {tfRows.map((row, i) => (
  //         <TableRow key={i}>
  //           <TableCell>
  //             <a target="_blank" rel="noopener noreferrer" href={row.url}>
  //               {row.title}
  //             </a>
  //           </TableCell>
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //   </Table>
  // );

  const renderCards = () => (
    <>
      {factorData?.ncbi_data && (
        <ContentCard title="NCBI" description={factorData.ncbi_data} />
      )}
      {factorData?.uniprot_data && (
        <ContentCard title="UniProt" description={factorData.uniprot_data} />
      )}
      {factorData?.factor_wiki && looksBiological(factorData.factor_wiki) && (
        <ContentCard title="Wikipedia" description={factorData.factor_wiki} />
      )}
      {factorData?.hgnc_data && (
        <Card raised>
          <CardContent>
            <Typography variant="h6">HGNC</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>HGNC ID</TableCell>
                  <TableCell>{factorData.hgnc_data.hgnc_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Locus Type</TableCell>
                  <TableCell>{factorData.hgnc_data.locus_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Chromosomal Location</TableCell>
                  <TableCell>{factorData.hgnc_data.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gene Groups</TableCell>
                  <TableCell>
                    {Array.isArray(factorData.hgnc_data.gene_group)
                      ? factorData.hgnc_data.gene_group.join(", ")
                      : ""}
                  </TableCell>
                </TableRow>
                {factorData.hgnc_data.prev_name && (
                  <TableRow>
                    <TableCell>Previous Names</TableCell>
                    <TableCell>
                      {Array.isArray(factorData.hgnc_data.prev_name)
                        ? factorData.hgnc_data.prev_name.join(", ")
                        : ""}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {factorData?.ensemble_data && (
        <Card raised>
          <CardContent>
            <Typography variant="h6">Ensembl</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Gene Type</TableCell>
                  <TableCell>{factorData.ensemble_data.biotype}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{factorData.ensemble_data.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ensembl Version</TableCell>
                  <TableCell>{factorData.ensemble_data.id}</TableCell>
                </TableRow>
                {factorData.ensemble_data.ccds_id && (
                  <TableRow>
                    <TableCell>CCDS</TableCell>
                    <TableCell>
                      {factorData.ensemble_data.ccds_id.join(", ")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <Box>
      <Grid2 container spacing={2}>
        {/* <Grid2 xs={12} md={4}>
                        {factorData && (
                          <Card>
                            <CardContent>
                              {factorData?.pdbids && (
                                <CardMedia
                                  component="img"
                                  image={getRCSBImageUrl(factorData?.pdbids)}
                                  alt={factorData?.name}
                                />
                              )}
                              <Typography variant="h5">{factorData?.name}</Typography>
                              <Typography variant="body2">
                                {factorData?.coordinates?.chromosome}:
                                {factorData?.coordinates?.start?.toLocaleString()}-
                                {factorData?.coordinates?.end?.toLocaleString()}
                              </Typography>
                              {/* {renderTFDetails()} */}

        <Grid2 xs={12} md={8}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxHeight="calc(100vh - 135px)"
            overflow="auto"
          >
            {renderCards()}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FunctionTab;
