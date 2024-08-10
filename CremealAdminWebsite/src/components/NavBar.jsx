import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  List,
  ListItemText,
  styled,
  IconButton,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logoImage from "../assets/logo.png";
import { Outlet, NavLink } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const drawerWidth = 250;
  const barHeight = 64;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <DrawerHeader sx={{ textAlign: "center" }}>
        <img
          src={logoImage}
          alt=""
          style={{ height: "80px", padding: "15px" }}
        />
      </DrawerHeader>
      <Divider />
      <List>
        {[
          { text: "General Analytics", path: "/Admin/statistics" },
          { text: "Users", path: "/Admin/users" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#0e82cd" : "transparent",
                color: isActive ? "white" : "black",
              })}
            >
              <ListItemIcon sx={{ color: "inherit" }}></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="warning" sx={{ fontWeight: 700 }}>
        Sign Out
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button variant="contained" color="warning" sx={{ fontWeight: 700 }}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        open={open}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {DrawerList}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {DrawerList}
      </Drawer>
      <Box
        component="main"
        sx={{
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { md: `${drawerWidth}px` },
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
