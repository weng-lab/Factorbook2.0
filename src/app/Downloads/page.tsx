"use client";

import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import StyledButton from "@/components/StyledButton";

const DownloadPage: React.FC = () => {
  const downloadCards = [
    {
      title: "TF Motif Catalog",
      description:
        "Motifs discovered using MEME on ChIP-seq experiments and the ZMotif neural network on HT-SELEX experiments. The catalog contains more than 6,000 motifs for each (with some redundancy).",
      link: "/downloads/tf-motif-catalog",
    },
    {
      title: "Genomic Motif Sites",
      description:
        "Motif sites identified by scanning ChIP-seq peaks and candidate cis-regulatory elements with FIMO. There are approximately 6 million motif sites in ChIP-seq peaks and 7 million motif sites in candidate regulatory elements after merging overlapping motif sites.",
      link: "/downloads/tf-motif-catalog-2",
    },
    {
      title: "Heritability Models",
      description:
        "Motifs discovered using MEME on ChIP-seq experiments and the ZMotif neural network on HT-SELEX experiments. The catalog contains more than 6,000 motifs for each (with some redundancy).",
      link: "/downloads/tf-motif-catalog-3",
    },
  ];

  return (
    <Container sx={{ mb: 4 }}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Factorbook Downloads <SaveAltIcon fontSize="large" />
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Select a Factorbook Data set to download:
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {downloadCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="white" paragraph>
                  {card.description}
                </Typography>
              </CardContent>
              <Box textAlign="center" p={2}>
                <StyledButton text="Go to Downloads" href={card.link} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DownloadPage;
