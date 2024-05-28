// src/components/Topbar.tsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import styles from "./Topbar.module.css";

const navItems = [
  { title: "Home", href: "#" },
  { title: "About", href: "#" },
  { title: "Resources", href: "#" },
  { title: "Download", href: "#" },
];

const Topbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        factor book
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItem button component="a" href={item.href}>
              <ListItemText primary={item.title} />
            </ListItem>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      className={styles.topbar}
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar disableGutters className={styles.toolbar}>
        <Box
          component="a"
          href="#"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textDecoration: "none",
            color: "var(--grey-700, #1F2021)",
            fontFamily: "Helvetica Neue",
            fontSize: "32px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "0.745" /* 74.5% */,
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
              // fontFamily: "Helvetica Neue",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "0.745" /* 74.5% */,
              letterSpacing: "-1.28px",
              color: "var(--grey-700, #1F2021)",
            }}
          >
            factor
            <span className={styles.book}>book</span>
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.title}
              href={item.href}
              className={styles.navItem}
              sx={{
                // fontFamily: "Helvetica Neue",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "26px" /* 173.333% */,
                letterSpacing: "0.46px",
                color: "var(--primary-mainText, #6750A4)",
                fontFeatureSettings: "'clig' off, 'liga' off",
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}></Box>
      </Toolbar>
      <nav>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </AppBar>
  );
};

export default Topbar;
