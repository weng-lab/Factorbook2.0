import React from "react";
import { Box, Typography, Link as MuiLink, Divider } from "@mui/material";
import Link from "next/link"; // Import Next.js Link component for navigation

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
        <MuiLink
          href={link.href}
          color="white"
          underline="none"
          display="block"
          mt={1}
          key={link.text}
        >
          {link.text}
        </MuiLink>
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
        {/* Wrap the logo image with Next.js Link for homepage navigation */}
        <Link href="/" passHref>
          <img
            src="/logo/on-black/Logo_01_on-black-bg.png" // Path to on-black logo
            alt="Factorbook Logo"
            width={180} // Adjust width for a larger appearance
            style={{ height: "auto", maxHeight: "100px", cursor: "pointer" }} // Optional height adjustment and cursor style
          />
        </Link>
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
            mt: 2, // Spacing below the logo
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
            { text: "TFs in Humans", href: "/transcriptionfactor/human" },
            { text: "TFs in Mouse", href: "/transcriptionfactor/mouse" },
            { text: "Motif Catalog", href: "/motifscatalog" },
            { text: "Annotations", href: "/annotationsvariants" },
          ]}
        />
        <LinkSection
          title="Resources"
          links={[{ text: "Downloads", href: "/downloads" }]}
        />
      </Box>
    </Box>
    <Divider sx={{ bgcolor: "white", my: 4, mx: 3, width: "auto" }} />
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{ color: "white", fontSize: 12, width: "100%", px: 3 }}
    >
      <Typography sx={{ pointerEvents: "none" }}>
        {/* Additional footer information here */}
      </Typography>
      <Box component="nav" display="flex" gap={2}>
        <MuiLink href="#" color="white" underline="none">
          Privacy & Policy
        </MuiLink>
        <MuiLink href="#" color="white" underline="none">
          Terms & Conditions
        </MuiLink>
      </Box>
    </Box>
  </Box>
);

export default Footer;
