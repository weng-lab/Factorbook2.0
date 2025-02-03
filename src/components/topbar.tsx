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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import styles from "./topbar.module.css";
import Link from "next/link";

const navItems = [
  { title: "Home", href: "/", icon: <HomeIcon sx={{ color: "#8169BF" }} /> },
  {
    title: "Portals",
    dropdownLinks: [
      {
        text: "Transcription Factors",
        subItems: [
          {
            text: "Human",
            href: "/tf/human",
          },
          {
            text: "Mouse",
            href: "/tf/mouse",
          },
        ]
      },
      {
        text: "Motif Catalog",
        href: "/motif/human/meme-search"
      },
      {
        text: "Annotations",
        href: "/snpannotation"
      },
      {
        text: "FactorChat",
        href: "/factorchat"
      }
    ],
  },
  { title: "Downloads", href: "/downloads" },
  { title: "FactorChat", href: "/factorchat" }
];

const Topbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [portalsAnchorEl, setPortalsAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handlePortalsClick = (event: React.MouseEvent<HTMLElement>) => {
    setPortalsAnchorEl(event.currentTarget);
  };

  const handlePortalsClose = () => {
    setPortalsAnchorEl(null);
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
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.title}>
            {item.dropdownLinks ? (
                <Accordion elevation={0} sx={{color: theme => theme.palette.primary.main}}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon color="primary"/>} >
                    {item.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding>
                      {item.dropdownLinks.map((dropdownLink) => (
                        dropdownLink.subItems ?
                          <div>
                            <ListItemText sx={{ textAlign: 'left', py: 1, px: 2 }}>{dropdownLink.text}</ListItemText>
                            {dropdownLink.subItems.map(subItem => (
                              <ListItemButton
                                key={subItem.text}
                                component={Link}
                                href={subItem.href}
                                sx={{pl: 4}}
                              >
                                <ListItemText primary={subItem.text} color="primary" />
                              </ListItemButton>
                            ))}
                          </div>
                          :
                          <ListItemButton
                            key={dropdownLink.text}
                            component={Link}
                            href={dropdownLink.href}
                          >
                            <ListItemText primary={dropdownLink.text} />
                          </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
            ) : (
              <ListItemButton component={Link} href={item.href}>
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
    <AppBar
      position="static"
      className={styles.topbar}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    >
      <Toolbar disableGutters className={styles.toolbar}>
        <Grid container alignItems="center">
          {isMobile ? (
            <>
              <Grid item xs={6}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon sx={{ color: "grey" }} />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", justifyContent: "flex-end" }}
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
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  {navItems.map((item) =>
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
                          {item.dropdownLinks.map((dropdownLink) => (
                            dropdownLink.subItems ?
                              <div>
                                <Typography px={2} py={1}>{dropdownLink.text}</Typography>
                                {dropdownLink.subItems.map(subItem => (
                                  <MenuItem
                                    key={subItem.text}
                                    component={Link}
                                    href={subItem.href}
                                    sx={{pl: 4}}
                                  >
                                    {subItem.text}
                                  </MenuItem>
                                ))}
                              </div>
                              :
                              <MenuItem
                                key={dropdownLink.text}
                                component={Link}
                                href={dropdownLink.href}
                              >
                                {dropdownLink.text}
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
  );
};

export default Topbar;
