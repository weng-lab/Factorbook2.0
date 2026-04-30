"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Divider,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  Search,
} from "@mui/icons-material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"
import TFSearchbar from "./tfsearchbar";
import AssemblySwitch, { Assembly } from "./AssemblySwitch";

type NavItem = {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  dropdownLinks?: Array<{
    title: string;
    href?: string;
    subItems?: Array<{ title: string; href: string }>;
  }>;
};

const navItems: NavItem[] = [
  { title: "Home", href: "/", icon: <HomeIcon /> },
  { title: "Downloads", href: "/downloads" },
  { title: "About", href: "/about" },
  {
    title: "Portals",
    dropdownLinks: [
      {
        title: "Transcription Factors",
        subItems: [
          { title: "Human", href: "/tf/human" },
          { title: "Mouse", href: "/tf/mouse" },
        ],
      },
      { title: "Motif Catalog", href: "/motif/human/meme-search" },
      { title: "Annotations", href: "/snpannotation" },
    ],
  },
];

const LOGO_SRC = "/logo/on-white/Logo_01_on-white-bg.png";

const Logo: React.FC = () => (
  <Box height={70} width={150} position={"relative"}>
    <Image src={LOGO_SRC} alt="Factorbook" fill objectFit="contain" />
  </Box>
);

const MaintenanceBanner: React.FC = () => (
  <Stack
    direction="row"
    justifyContent="center"
    alignItems="center"
    spacing={2}
    sx={{
      width: "100%",
      height: 40,
      backgroundColor: "#ff9800",
      color: "#fff",
      flexShrink: 0,
    }}
  >
    <WarningAmberIcon />
    <Typography sx={{ fontWeight: "bold" }}>
      Factorbook API is temporarily unavailable. We are working to resolve the issue and will be back shortly.
    </Typography>
    <WarningAmberIcon />
  </Stack>
);

const navButtonSx: SxProps<Theme> = {
  fontSize: 15,
  fontWeight: 700,
  lineHeight: "26px",
  color: (theme) => theme.palette.primary.main,
};

const DesktopNav: React.FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);

  return (
    <Stack direction="row" spacing={2} sx={sx}>
      {navItems.slice(1).map((item) =>
        item.dropdownLinks ? (
          <React.Fragment key={item.title}>
            <Button
              aria-controls={anchorEl ? "portals-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<ExpandMoreIcon />}
              sx={navButtonSx}
            >
              {item.title}
            </Button>
            <Menu
              id="portals-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {item.dropdownLinks.map((link, i) =>
                link.subItems ? (
                  <Box key={i}>
                    <Typography px={2} py={1}>
                      {link.title}
                    </Typography>
                    {link.subItems.map((sub) => (
                      <MenuItem
                        key={sub.title}
                        component={Link}
                        href={sub.href}
                        sx={{ pl: 4 }}
                        onClick={handleClose}
                      >
                        {sub.title}
                      </MenuItem>
                    ))}
                  </Box>
                ) : (
                  <MenuItem
                    key={link.title}
                    component={Link}
                    href={link.href!}
                    onClick={handleClose}
                  >
                    {link.title}
                  </MenuItem>
                )
              )}
            </Menu>
          </React.Fragment>
        ) : (
          <Button
            key={item.title}
            LinkComponent={Link}
            href={item.href!}
            sx={navButtonSx}
          >
            {item.title}
          </Button>
        )
      )}
    </Stack>
  );
};

interface SearchAreaProps {
  isHomePage: boolean;
  assembly: Assembly;
  onAssemblyChange: (a: Assembly) => void;
  onFocusSearch: () => void;
  sx?: SxProps<Theme>;
}

const SearchArea: React.FC<SearchAreaProps> = ({
  isHomePage,
  assembly,
  onAssemblyChange,
  onFocusSearch,
  sx,
}) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="flex-end"
    sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    {isHomePage ? (
      <IconButton
        onClick={onFocusSearch}
        aria-label="search"
        sx={{ color: (theme) => theme.palette.primary.main }}
      >
        <Search />
      </IconButton>
    ) : (
      <>
        <AssemblySwitch
          assembly={assembly}
          onChange={onAssemblyChange}
          iconColor="black"
        />
        <Box sx={{ width: 320, minWidth: 0 }}>
          <TFSearchbar assembly={assembly} color="black" example={false} />
        </Box>
      </>
    )}
  </Stack>
);

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  assembly: Assembly;
  onAssemblyChange: (a: Assembly) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  assembly,
  onAssemblyChange,
}) => (
  <Drawer
    id="mobile-drawer"
    anchor="left"
    open={open}
    onClose={onClose}
    aria-label="navigation menu"
    ModalProps={{ keepMounted: true }}
    sx={{ "& .MuiDrawer-paper": { width: "100%" } }}
  >
    <Box sx={{ color: (theme) => theme.palette.primary.main, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Logo />
        <IconButton color="inherit" onClick={onClose} aria-label="close menu">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ px: 2, mt: 2 }}>
        <TFSearchbar assembly={assembly} color="black" example={false} />
      </Box>
      <RadioGroup
        value={assembly}
        onChange={(e) => onAssemblyChange(e.target.value as Assembly)}
        row
        sx={{
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 4, md: 6 },
          flexWrap: "wrap",
          my: 1,
        }}
      >
        {(["GRCh38", "mm10"] as const).map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={
              <Typography>{value === "GRCh38" ? "Human" : "Mouse"}</Typography>
            }
            sx={{ marginRight: 0 }}
          />
        ))}
      </RadioGroup>
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.title}>
            {item.dropdownLinks ? (
              <Accordion
                elevation={0}
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                  {item.title}
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {item.dropdownLinks.map((link, i) =>
                      link.subItems ? (
                        <Box key={i}>
                          <ListItemText sx={{ textAlign: "left", py: 1, px: 2 }}>
                            {link.title}
                          </ListItemText>
                          {link.subItems.map((sub) => (
                            <ListItemButton
                              key={sub.title}
                              component={Link}
                              href={sub.href}
                              sx={{ pl: 4 }}
                              onClick={onClose}
                            >
                              <ListItemText primary={sub.title} />
                            </ListItemButton>
                          ))}
                        </Box>
                      ) : (
                        <ListItemButton
                          key={link.title}
                          component={Link}
                          href={link.href!}
                          onClick={onClose}
                        >
                          <ListItemText primary={link.title} />
                        </ListItemButton>
                      )
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ) : (
              <ListItemButton component={Link} href={item.href!} onClick={onClose}>
                <ListItemText primary={item.title} />
                {item.icon && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 1,
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    {item.icon}
                  </Box>
                )}
              </ListItemButton>
            )}
            {index < navItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  </Drawer>
);

interface TopbarProps {
  maintenance: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ maintenance }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [assembly, setAssembly] = React.useState<Assembly>("GRCh38");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleFocusSearch = () => {
    const searchEl = document.getElementById("tf-search");
    const headerEl = document.getElementById("header-book");
    if (!searchEl || !headerEl) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          if (timeoutId) clearTimeout(timeoutId);
          (searchEl.querySelector("input") as HTMLInputElement | null)?.focus();
          obs.disconnect();
        }
      },
      { threshold: 0.99 }
    );
    timeoutId = setTimeout(() => observer.disconnect(), 3000);

    observer.observe(headerEl);
    searchEl.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <>
      {maintenance && <MaintenanceBanner />}
      <AppBar
        position="static"
        color="inherit"
        sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
      >
        <Toolbar sx={{ px: 2, gap: 2 }} disableGutters>
          <Link href="/" aria-label="home">
            <Logo />
          </Link>
          <DesktopNav sx={{ display: { xs: "none", md: "flex" } }} />
          <Box sx={{ flexGrow: 1 }} />
          <SearchArea
            isHomePage={isHomePage}
            assembly={assembly}
            onAssemblyChange={setAssembly}
            onFocusSearch={handleFocusSearch}
            sx={{ display: { xs: "none", md: "flex" } }}
          />
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="open navigation"
            aria-controls="mobile-drawer"
            aria-expanded={mobileOpen}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "grey",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        assembly={assembly}
        onAssemblyChange={setAssembly}
      />
    </>
  );
};

export default Topbar;
