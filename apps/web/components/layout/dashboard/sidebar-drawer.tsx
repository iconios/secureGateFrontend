"use client";

import {
  Analytics,
  ApartmentOutlined,
  AssistantDirectionOutlined,
  Block,
  Close,
  Dashboard,
  DriveEtaOutlined,
  HailOutlined,
  ManageAccounts,
  Menu,
  Payment,
  Person2Outlined,
  ReportProblem,
  Settings,
  ShieldOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useNavigation } from "../../../providers/NavigationContext";
import Header from "../home/header";

const SidebarDrawer = () => {
  const drawerWidth = 280;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useNavigation();

  const navItems = [
    {
      text: "Overview",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      text: "Households",
      icon: <ApartmentOutlined />,
      path: "/dashboard/settings",
    },
    {
      text: "Residents",
      icon: <Person2Outlined />,
      path: "/dashboard/residents",
    },
    { text: "Guests", icon: <HailOutlined />, path: "dashboard/guests" },
    {
      text: "Vehicles",
      icon: <DriveEtaOutlined />,
      path: "/dashboard/vehicles",
    },
    {
      text: "Permits",
      icon: <AssistantDirectionOutlined />,
      path: "/dashboard/permits",
    },
    {
      text: "Guards",
      icon: <ShieldOutlined />,
      path: "/dashboard/guards",
    },
    {
      text: "Incidents",
      icon: <ReportProblem />,
      path: "/dashboard/incidents",
    },
    {
      text: "Blacklists",
      icon: <Block />,
      path: "/dashboard/block",
    },
  ];

  const adminItems = [
    {
      text: "Subscription",
      icon: <Payment />,
      path: "/dashboard/subscriptions",
    },
    {
      text: "Audit Logs",
      icon: <ManageAccounts />,
      path: "/dashboard/audit-logs",
    },
    {
      text: "Reports & Exports",
      icon: <Analytics />,
      path: "/dashboard/reports",
    },
    {
      text: "Settings",
      icon: <Settings />,
      path: "/dashboard/settings",
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNavigation = () => isMobile && setMobileOpen(false);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          SecureGate
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "regular", color: "primary.main" }}
        >
          ESTATE MANAGEMENT
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleNavigation}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.primary.main + "15",
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          px: 2,
          pt: 2,
          pb: 1,
        }}
      >
        Administration
      </Typography>

      <List sx={{ flex: 1 }}>
        {adminItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleNavigation}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.primary.main + "15",
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, position: "relative" },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile app bar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
            <Typography>
              {navItems.find((item) => item.path === pathname)?.text ||
                adminItems.find((item) => item.path === pathname)?.text}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default SidebarDrawer;
