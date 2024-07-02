"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import styles from "./Topbar.module.css";
import { ListItemButton } from "@mui/material";

const navItems = [
  { title: "Home", href: "/", icon: <HomeIcon sx={{ color: "#8169BF" }} /> },
  {
    title: "Portals",
    icon: <ExpandMore sx={{ color: "#8169BF" }} />,
    subItems: [
      {
        title: "Human Transcription Factors",
        href: "./Human",
      },
      {
        title: "Mouse Transcription Factors",
        href: "./Mouse",
      },
      { title: "Motif Site Catalog", href: "./MotifsCatalog" },
      {
        title: "Annotate Variants & Trait Heritability",
        href: "./AnnotationsVariants",
      },
    ],
  },
  {
    title: "Resources",
    href: "#",
    icon: <MenuBookIcon sx={{ color: "#8169BF" }} />,
  },
  { title: "Download", href: "./Downloads" },
];

const Topbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [portalsOpen, setPortalsOpen] = React.useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handlePortalsClick = () => {
    setPortalsOpen(!portalsOpen);
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
            fontWeight: 700 /* Set to 700 */,
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
              fontWeight: 700 /* Set to 700 */,
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
                  {portalsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={portalsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <React.Fragment key={subItem.title}>
                        <ListItemButton component="a" href={subItem.href}>
                          <ListItemText
                            primary={subItem.title}
                            sx={{ paddingLeft: "16px" }}
                          />
                        </ListItemButton>
                        <Divider sx={{ margin: "0 16px" }} />
                      </React.Fragment>
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
      sx={{ backgroundColor: "transparent", boxShadow: "none", width: "100%" }}
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
                    fontWeight: 700 /* Set to 700 */,
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
                      fontWeight: 700 /* Set to 700 */,
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
                    fontWeight: 700 /* Set to 700 */,
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
                      fontWeight: 700 /* Set to 700 */,
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
                  {navItems.map((item) => (
                    <Button
                      key={item.title}
                      href={item.href}
                      className={styles.navItem}
                      sx={{
                        fontSize: "15px",
                        fontStyle: "normal",
                        fontWeight: 700 /* Set to 700 */,
                        lineHeight: "26px", // 173.333%
                        letterSpacing: "0.46px",
                        color: "var(--primary-mainText, #6750A4)",
                        fontFeatureSettings: "'clig' off, 'liga' off",
                        marginLeft: "16px",
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
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
