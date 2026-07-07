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
  Payment,
  Person2Outlined,
  ReportProblem,
  Settings,
  ShieldOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useNavigation } from "../../../providers/NavigationContext";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../lib/features/auth/authSlice";
import useAuthCheck from "../../../hooks/useAuthCheck";
import { useState } from "react";
import { showToast } from "../../../utils/toast";
import { RootState } from "../../../lib/store";

const SidebarDrawer = () => {
  // Check whether user is authenticated. If no, return login page
  useAuthCheck();
  // Local state for auth redux store
  const { logout } = authActions;
  const dispatch = useDispatch();
  const selectedEstateId = useSelector(
    (state: RootState) => state.estate.estateId,
  );
  // Local state for MUI theme
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  //Local state for navigation
  const { mobileOpen, setMobileOpen } = useNavigation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const drawerWidth = isMobile ? "min(82vw, 320px)" : 280;

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error?.name || "Logout failed on server");
      }

      dispatch(logout());
      router.replace("/login");
    } catch (error) {
      console.log("SidebarDrawer Component error:", error);

      showToast.error("Error logging out. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {
      text: "Overview",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      text: "Households",
      icon: <ApartmentOutlined />,
      path: `/dashboard/households?estateId=${selectedEstateId}`,
    },
    {
      text: "Residents",
      icon: <Person2Outlined />,
      path: "/dashboard/residents",
    },
    { text: "Guests", icon: <HailOutlined />, path: "/dashboard/guests" },
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

  const handleNavigation = () => isMobile && setMobileOpen(false);

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            Estate Management
          </Typography>

          <IconButton
            aria-label="close menu"
            onClick={() => setMobileOpen(false)}
          >
            <Close sx={{ color: "primary.main" }} />
          </IconButton>
        </Box>
      )}

      {!isMobile && (
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "primary.main",
            }}
          >
            Estate Management
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          py: 1,
        }}
      >
        <List>
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
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                      "&:hover": {
                        bgcolor: "#E5E4E2",
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

        <List>
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

      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: { xs: 4, md: 3 },
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            handleLogout();
          }}
          sx={{
            py: 1.1,
            borderRadius: 2,
            fontWeight: 600,
          }}
          disabled={loading}
        >
          {loading ? "Logging out" : "Log out"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            zIndex: theme.zIndex.drawer + 2,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              zIndex: theme.zIndex.drawer + 2,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: "relative",
              flexShrink: 0,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default SidebarDrawer;
