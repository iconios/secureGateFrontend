"use client";

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: Readonly<HeaderProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", lg: "1280px" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1.25, md: 2 },
          minHeight: { xs: 64, md: 72 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 1.25 },
            minWidth: 0,
          }}
        >
          {isMobile && (
            <IconButton
              aria-label="open menu"
              onClick={onMenuClick}
              edge="start"
              sx={{
                color: "text.secondary",
                mr: 0.5,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <SecurityIcon
            sx={{
              fontSize: { xs: "1.75rem", md: "2.125rem" },
              color: "primary.main",
              flexShrink: 0,
            }}
          />

          <Typography
            variant="h2"
            component="span"
            noWrap
            sx={{
              fontWeight: 300,
              letterSpacing: "-0.025em",
              color: "primary.main",
              fontSize: { xs: "1.35rem", sm: "1.65rem", md: "2.125rem" },
              lineHeight: 1.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            SecureGate
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1 },
            flexShrink: 0,
          }}
        >
          <IconButton
            aria-label="help"
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <HelpOutlineIcon />
          </IconButton>

          <IconButton
            aria-label="account"
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
