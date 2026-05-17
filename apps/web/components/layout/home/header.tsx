"use client";

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 50,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          px: { xs: 2, md: 4 },
          py: 2,
          maxWidth: "1280px",
          mx: "auto",
          minHeight: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SecurityIcon
            sx={{
              fontSize: "2.125rem",
              color: "primary.main",
            }}
          />
          <Typography
            variant="h2"
            component="span"
            sx={{
              fontWeight: 200,
              letterSpacing: "-0.025em",
              color: "primary.main",
              fontSize: "2.125rem",
            }}
          >
            SecureGate
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            aria-label="help"
            size="medium"
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
            size="medium"
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
