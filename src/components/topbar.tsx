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
  Grid,
  useMediaQuery,
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  Search,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import styles from "./topbar.module.css";
import Link from "next/link";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { usePathname } from "next/navigation";
import TFSearchbar from "./tfsearchbar";
import AssemblySwitch from "./AssemblySwitch";

let navItems = [
  { title: "Home", href: "/", icon: <HomeIcon sx={{ color: "#8169BF" }} /> },
  { title: "Downloads", href: "/downloads" },
  { title: "About", href: "/about" },
  {
    title: "Portals",
    dropdownLinks: [
      {
        title: "Transcription Factors",
        subItems: [
          {
            title: "Human",
            href: "/tf/human",
          },
          {
            title: "Mouse",
            href: "/tf/mouse",
          },
        ]
      },
      {
        title: "Motif Catalog",
        href: "/motif/human/meme-search"
      },
      {
        title: "Annotations",
        href: "/snpannotation"
      },
    ]
  },
];

interface TopbarProps {
  maintenance: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ maintenance }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [assembly, setAssembly] = React.useState<"GRCh38" | "mm10">("GRCh38");
  const [portalsAnchorEl, setPortalsAnchorEl] =
  React.useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handlePortalsClick = (event: React.MouseEvent<HTMLElement>) => {
    setPortalsAnchorEl(event.currentTarget);
  };

  const handlePortalsClose = () => {
    setPortalsAnchorEl(null);
  };

  React.useEffect(() => {
    // Close drawer on route change
    setMobileOpen(false);
  }, [pathname]);

  //Auto scroll and focus the main search bar
  const handleFocusSearch = () => {
    const searchEl = document.getElementById("tf-search");
    const headerEl = document.getElementById("header-book");
    if (!searchEl) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          (searchEl.querySelector('input') as HTMLInputElement)?.focus();
          obs.disconnect();
        }
      },
      {
        threshold: 0.99,
      }
    );

    if (headerEl) {
      observer.observe(headerEl);
    }

    // Scroll smoothly to the search bar
    searchEl.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const drawer = (
    <Box sx={{ textAlign: "center", color: "#8169BF", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        {/* Larger logo for Drawer */}
        <img
          src="/logo/on-white/Logo_01_on-white-bg.png"
          alt="Logo"
          width={180} // Increased width
          style={{ height: "auto", maxHeight: "100px" }} // Optional height
        />

        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerToggle}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, paddingX: 2, mt: 2 }}>
        <TFSearchbar assembly={assembly} color="black" example={false} />
      </Box>
      <RadioGroup
        value={assembly}
        onChange={(e) => setAssembly(e.target.value as "GRCh38" | "mm10")}
        row
        sx={{
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 4, md: 6 },
          flexWrap: "wrap",
          my: 1,
        }}
      >
        {["GRCh38", "mm10"].map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={<Typography>{value === "GRCh38" ? "Human" : "Mouse"}</Typography>}
            sx={{ marginRight: 0 }}
          />
        ))}
      </RadioGroup>
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.title}>
            {item.dropdownLinks ? (
              <Accordion elevation={0} sx={{ color: theme => theme.palette.primary.main }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} >
                  {item.title}
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {item.dropdownLinks.map((dropdownLink, i) => (
                      dropdownLink.subItems ?
                        <div key={i}>
                          <ListItemText sx={{ textAlign: 'left', py: 1, px: 2 }}>{dropdownLink.title}</ListItemText>
                          {dropdownLink.subItems.map(subItem => (
                            <ListItemButton
                              key={subItem.title}
                              component={Link}
                              href={subItem.href}
                              sx={{ pl: 4 }}
                              onClick={handleDrawerToggle}
                            >
                              <ListItemText primary={subItem.title} color="primary" />
                            </ListItemButton>
                          ))}
                        </div>
                        :
                        <ListItemButton
                          key={dropdownLink.title}
                          component={Link}
                          href={dropdownLink.href}
                          onClick={handleDrawerToggle}
                        >
                          <ListItemText primary={dropdownLink.title} />
                        </ListItemButton>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ) : (
              <ListItemButton component={Link} href={item.href} onClick={handleDrawerToggle}>
                <ListItemText primary={item.title} />
                {item.icon && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
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
  );

  return (
    <>
      <Stack
        direction={"row"}
        style={{
          position: 'fixed',
          width: '100%',
          height: "40px",
          backgroundColor: '#ff9800',
          zIndex: 1301,
          color: '#fff',
          textAlign: 'center',
          display: maintenance ? "flex" : "none"
        }}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
      >
        <WarningAmberIcon />
        <Typography sx={{ fontWeight: 'bold' }}>Factorbook API is temporarily unavailable. We are working to resolve the issue and will be back shortly.</Typography>
        <WarningAmberIcon />
      </Stack>
      <AppBar
        position="fixed"
        className={styles.topbar}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          top: maintenance ? '40px' : '0px'
        }}
      >
        <Toolbar disableGutters className={styles.toolbar}>
          <Grid container alignItems="center">
            {isMobile ? (
              <>
                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Link href="/">
                    <img
                      src="/logo/on-white/Logo_01_on-white-bg.png"
                      alt="Logo"
                      width={180} // Increased width
                      style={{ height: "auto", maxHeight: "100px" }} // Optional height
                    />
                  </Link>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon sx={{ color: "grey" }} />
                  </IconButton>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs="auto">
                  <Link href="/">
                    <img
                      src="/logo/on-white/Logo_01_on-white-bg.png"
                      alt="Logo"
                      width={180} // Increased width
                      style={{ height: "auto", maxHeight: "100px" }} // Optional height
                    />
                  </Link>
                </Grid>
                <Grid item xs>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    {navItems.slice(1).map((item) =>
                      item.dropdownLinks ? (
                        <React.Fragment key={item.title}>
                          <Button
                            aria-controls={
                              portalsAnchorEl ? "portals-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={portalsAnchorEl ? "true" : undefined}
                            onClick={handlePortalsClick}
                            endIcon={<ExpandMoreIcon />}
                            sx={{
                              fontSize: "15px",
                              fontWeight: 700,
                              lineHeight: "26px",
                              color: "var(--primary-mainText, #6750A4)",
                              marginLeft: "16px",
                            }}
                          >
                            {item.title}
                          </Button>
                          <Menu
                            id="portals-menu"
                            anchorEl={portalsAnchorEl}
                            open={Boolean(portalsAnchorEl)}
                            onClose={handlePortalsClose}
                            MenuListProps={{
                              "aria-labelledby": "portals-button",
                            }}
                          >
                            {item.dropdownLinks.map((dropdownLink, i) => (
                              dropdownLink.subItems ?
                                <div key={i}>
                                  <Typography px={2} py={1}>{dropdownLink.title}</Typography>
                                  {dropdownLink.subItems.map(subItem => (
                                    <MenuItem
                                      key={subItem.title}
                                      component={Link}
                                      href={subItem.href}
                                      sx={{ pl: 4 }}
                                    >
                                      {subItem.title}
                                    </MenuItem>
                                  ))}
                                </div>
                                :
                                <MenuItem
                                  key={dropdownLink.title}
                                  component={Link}
                                  href={dropdownLink.href}
                                >
                                  {dropdownLink.title}
                                </MenuItem>
                            ))}
                          </Menu>
                        </React.Fragment>
                      ) : (
                        <Button
                          key={item.title}
                          LinkComponent={Link}
                          href={item.href}
                          sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            lineHeight: "26px",
                            color: "var(--primary-mainText, #6750A4)",
                            marginLeft: "16px",
                          }}
                        >
                          {item.title}
                        </Button>
                      )
                    )}
                  </Box>
                </Grid>
                  <Box
                    sx={{
                      width: "375px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isHomePage ? (
                      <IconButton
                        sx={{
                          color: "var(--primary-mainText, #6750A4)",
                          display: { xs: "none", md: "flex" },
                          ml: "auto",
                        }}
                        onClick={handleFocusSearch}
                      >
                        <Search />
                      </IconButton>
                    ) : (
                      <Stack display={"flex"} direction={"row"} width={"100%"} justifyContent={"flex-end"} alignItems={"center"} spacing={1}>
                        <AssemblySwitch assembly={assembly} onChange={setAssembly} iconColor="black" />
                        <Box sx={{ flex: 1 }}>
                          <TFSearchbar assembly={assembly} color="black" example={false} />
                        </Box>
                      </Stack>
                    )}
                  </Box>
              </>
            )}
          </Grid>
        </Toolbar>
        <nav>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </AppBar>
      {/* Bumps content down since header is position="fixed" */}
      {/* Bumps content down even more if banner is open */}
      {maintenance && <Box sx={{ height: '40px', flexShrink: 0 }} />}
      <Box sx={{ height: '100px', flexShrink: 0 }} />
    </>
  );
};

export default Topbar;