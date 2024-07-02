import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

type LinkSectionProps = {
  title: string;
  links: { text: string; href: string }[];
};

const LinkSection: React.FC<LinkSectionProps> = ({ title, links }) => (
  <Box sx={{ flex: 1, minWidth: 200, mb: { xs: 3, md: 0 } }}>
    <Typography
      variant="h6"
      color="white"
      gutterBottom
      sx={{
        pointerEvents: "none",
      }}
    >
      {title}
    </Typography>
    <Box component="nav">
      {links.map((link) => (
        <Link
          href={link.href}
          color="white"
          underline="none"
          display="block"
          mt={1}
          key={link.text}
        >
          {link.text}
        </Link>
      ))}
    </Box>
  </Box>
);

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{ bgcolor: "var(--grey-600, #2A2A2E)", py: 5, width: "100%" }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems="flex-start"
      mb={5}
      width="100%"
      px={3}
    >
      <Box sx={{ flex: 1, minWidth: 200, mb: { xs: 3, md: 0 } }}>
        <Typography
          variant="h4"
          color="white"
          gutterBottom
          sx={{
            color: "#FFF",
            fontSize: "45px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "74.5%",
            letterSpacing: "-1.8px",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "none",
          }}
        >
          factor
          <Box component="span" sx={{ ml: 7.5 }}>
            book
          </Box>
        </Typography>
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "var(--primary-contrast, #FFF)",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "150%", // 24px
            letterSpacing: "0.15px",
            fontFeatureSettings: "'clig' off, 'liga' off",
            pointerEvents: "none",
          }}
        >
          A comprehensive online resource dedicated to the study of
          transcription factors (TFs) in human and mouse genomes.
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        flex={1}
      >
        <LinkSection
          title="About Us"
          links={[
            { text: "Factorbook Overview", href: "#" },
            { text: "Weng Lab", href: "https://www.umassmed.edu/wenglab/" },
            { text: "ENCODE Consortium", href: "#" },
            {
              text: "UMass Chan Medical School",
              href: "https://www.umassmed.edu/",
            },
          ]}
        />
        <LinkSection
          title="Portals"
          links={[
            { text: "TFs in Humans", href: "/TranscriptionFactor/Human" },
            { text: "TFs in Mouse", href: "/TranscriptionFactor/Mouse" },
            { text: "Motif Catalog", href: "/MotifsCatalog" },
            { text: "Annotations", href: "/AnnotationsVariants" },
          ]}
        />
        <LinkSection
          title="Resources"
          links={[{ text: "Downloads", href: "/Downloads" }]}
        />
      </Box>
    </Box>
    <Divider sx={{ bgcolor: "neutral.500", my: 4, width: "100%" }} />
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{ color: "white", fontSize: 12, width: "100%", px: 3 }}
    >
      <Typography
        sx={{
          pointerEvents: "none",
        }}
      ></Typography>
      <Box component="nav" display="flex" gap={2}>
        <Link href="#" color="white" underline="none">
          Privacy & Policy
        </Link>
        <Link href="#" color="white" underline="none">
          Terms & Conditions
        </Link>
      </Box>
    </Box>
  </Box>
);

export default Footer;
