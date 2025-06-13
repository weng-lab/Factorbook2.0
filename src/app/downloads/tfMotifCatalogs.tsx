'use client'
import StackedDownloadButton from "@/components/stackedDownloadButton"
import { Info } from "@mui/icons-material"
import { Stack, Typography, Tooltip, Grid2, Divider, Box } from "@mui/material"

const TfMotifCatalogDownloads = () => {
  return (
    <div>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={"bold"}
          marginBottom={5}
        >
          TF Motif Catalog
        </Typography>
        <Typography variant="body1">
          Motifs discovered using MEME on ChIP-seq experiments and the ZMotif
          neural network on HT-SELEX experiments. The catalog contains more
          than 6,000 motifs for each (with some redundancy).
        </Typography>
      </Box>
      <Divider />
      <Grid2 container sx={{ mt: 5 }} spacing={2}>
        <Grid2 size={8}>
          <Stack spacing={2}>
            <Typography variant="h6">
              MEME ChIP-seq Catalog
              <Tooltip
                title={`
                    These motifs were identified by applying MEME to the top 500 IDR thresholded ChIP-seq peaks from more than 3,000 ENCODE
                    ChIP-seq experiments. Five motifs were identified per experiment; these were subsequently filtered for quality using peak
                    centrality and enrichment metrics
                  `}
              >
                <Info sx={{ ml: 1 }} />
              </Tooltip>
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <Typography variant="body2">
                6,069 Motifs
              </Typography>
              <Typography variant="body2">
                733 Transcription Factors
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <StackedDownloadButton
                topText="Download Motifs in MEME Format"
                bottomText="(1 MB)"
                href="/motifscatlog/factorbook_chipseq_meme_motifs.tsv"
              />
              <StackedDownloadButton
                topText="Download Metadata in TSV Format"
                bottomText="(2.9 MB)"
                href="/motifscatlog/complete-factorbook-catalog.meme.gz"
              />
            </Stack>
          </Stack>
        </Grid2>
        <Grid2 size={4}>
          <Stack spacing={2}>
            <Typography variant="h6">
              HT-SELEX Catalog
              <Tooltip
                title={`
                    These motifs were identified by applying the ZMotif neural network to reads from HT-SELEX experiments and negative reads generated
                    by dinucleotide shuffling of true positive reads. The motif identified by the network as most predictive of positive reads for each
                    experiment is contained in this set. HDF5 format motifs can be loaded into Python for application in new models.
                  `}
              >
                <Info sx={{ ml: 1 }} />
              </Tooltip>
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <Typography variant="body2">
                6,700 Motifs
              </Typography>
              <Typography variant="body2">
                631 Transcription Factors
              </Typography>
            </Stack>
            <StackedDownloadButton
              topText="Download Motifs in MEME Format"
              bottomText="(1 MB)"
              href="/motifscatlog/all-selex-motifs.meme.gz"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </div>
  )
}

export default TfMotifCatalogDownloads