"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Collapse,
  Divider,
  Grid,
  useMediaQuery,
  ListItemButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import styles from "./Topbar.module.css";

// Define the navigation items
const navItems = [
  { title: "Home", href: "/", icon: <HomeIcon sx={{ color: "#8169BF" }} /> },
  {
    title: "Portals",
    subItems: [
      {
        text: "Transcription Factors  in Humans",
        href: "/transcriptionfactor/human",
      },
      {
        text: "Transcription Factors in Mouse",
        href: "/TranscriptionFactor/Mouse",
      },
      { text: "Motif Catalog", href: "/motifscatalog" },
      { text: "Annotations", href: "/annotationsvariants" },
    ],
  },
  {
    title: "Resources",
    href: "#",
    icon: <MenuBookIcon sx={{ color: "#8169BF" }} />,
  },
  { title: "Download", href: "/downloads" },
];

const Topbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [portalsAnchorEl, setPortalsAnchorEl] =
    React.useState<null | HTMLElement>(null); // State for portals dropdown

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Function to handle the opening of the portals menu
  const handlePortalsClick = (event: React.MouseEvent<HTMLElement>) => {
    setPortalsAnchorEl(event.currentTarget);
  };

  // Function to handle the closing of the portals menu
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textDecoration: "none",
            color: "var(--grey-700, #1F2021)",
            fontSize: "32px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "0.745", // 74.5%
            letterSpacing: "-1.28px",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            className={styles.logo}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "0.745", // 74.5%
              letterSpacing: "-1.28px",
              color: "var(--grey-700, #1F2021)",
            }}
          >
            factor
            <span className={styles.book}>book</span>
          </Typography>
        </Box>
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
            {item.subItems ? (
              <>
                <ListItemButton onClick={handlePortalsClick}>
                  <ListItemText primary={item.title} />
                  <ExpandMoreIcon sx={{ color: "#8169BF" }} />
                </ListItemButton>
                <Collapse
                  in={Boolean(portalsAnchorEl)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component="a"
                        href={subItem.href}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{ paddingLeft: "16px" }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton component="a" href={item.href}>
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
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow
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
                <Box
                  component="a"
                  href="/"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textDecoration: "none",
                    color: "var(--grey-700, #1F2021)",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "0.745", // 74.5%
                    letterSpacing: "-1.28px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    className={styles.logo}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      fontSize: "32px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "0.745", // 74.5%
                      letterSpacing: "-1.28px",
                      color: "var(--grey-700, #1F2021)",
                    }}
                  >
                    factor
                    <span className={styles.book}>book</span>
                  </Typography>
                </Box>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs="auto">
                <Box
                  component="a"
                  href="/"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textDecoration: "none",
                    color: "var(--grey-700, #1F2021)",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    letterSpacing: "-1.28px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    className={styles.logo}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      fontSize: "32px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "0.745", // 74.5%
                      letterSpacing: "-1.28px",
                      color: "var(--grey-700, #1F2021)",
                    }}
                  >
                    factor
                    <span className={styles.book}>book</span>
                  </Typography>
                </Box>
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
                    item.subItems ? (
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
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "26px", // 173.333%
                            letterSpacing: "0.46px",
                            color: "var(--primary-mainText, #6750A4)",
                            fontFeatureSettings: "'clig' off, 'liga' off",
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
                          {item.subItems.map((subItem) => (
                            <MenuItem
                              key={subItem.text}
                              component="a"
                              href={subItem.href}
                            >
                              {subItem.text}
                            </MenuItem>
                          ))}
                        </Menu>
                      </React.Fragment>
                    ) : (
                      <Button
                        key={item.title}
                        href={item.href}
                        sx={{
                          fontSize: "15px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "26px", // 173.333%
                          letterSpacing: "0.46px",
                          color: "var(--primary-mainText, #6750A4)",
                          fontFeatureSettings: "'clig' off, 'liga' off",
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
            keepMounted: true, // Better open performance on mobile.
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
