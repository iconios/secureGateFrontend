"use client";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import Image from "next/image";
import { getLogoSrc } from "../../../../utils/logoSrcTransform";

type EstateBannerProps = {
  logoUrl: string;
  name: string;
  status: string;
  location: string;
  state: string;
  createdAt: string;
};

const EstateBanner = ({
  logoUrl,
  name,
  status,
  location,
  state,
  createdAt,
}: EstateBannerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = status === "active";
  const logoSrc = getLogoSrc(logoUrl);

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "flex-start" },
        gap: { xs: 3, md: 4 },
        p: { xs: 2, md: 3 },
        my: 2,
        mx: { xs: 1.5, md: 2.2 },
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        {/* Logo, Name, Address UI */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          {/* Logo UI Container */}
          <Box
            sx={{
              width: { xs: 64, md: 76 },
              height: { xs: 64, md: 76 },
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {logoUrl.trim() && (
              <Image
                src={logoSrc!}
                alt={name}
                width={80}
                height={80}
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </Box>

          {/* Name, Address UI Container */}
          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 20, md: 28 },
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.15,
                }}
              >
                {name}
              </Typography>

              <Chip
                label={status.toUpperCase()}
                size="small"
                icon={
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "success.dark",
                    }}
                  />
                }
                sx={{
                  height: 24,
                  borderRadius: "999px",
                  bgcolor: isActive ? "#7CF5B0" : "grey.200",
                  color: isActive ? "success.dark" : "text.secondary",
                  fontSize: 11,
                  fontWeight: 800,
                  "& .MuiChip-icon": {
                    ml: 1,
                    mr: -0.25,
                  },
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mt: 0.75,
                color: "text.secondary",
                fontSize: { xs: 14, md: 17 },
                fontWeight: 400,
              }}
            >
              {location} • {state}
            </Typography>
          </Box>
        </Stack>

        {/* Desktop button only */}
        {!isMobile && (
          <Button
            variant="contained"
            onClick={() => {
              alert("clicked");
            }}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              minWidth: { sm: 190 },
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 1.5,
              px: 3,
              py: 1.2,
            }}
          >
            Manage Estate
          </Button>
        )}
      </Stack>

      {/* Registered Since and Payment Status UI */}
      <Stack
        direction={{ xs: "row", md: "row" }}
        spacing={{ xs: 3, md: 7 }}
        sx={{
          justifyContent: { xs: "space-between", md: "flex-end" },
          alignItems: "flex-start",
          flexWrap: "wrap",
          pt: { xs: 0, md: 1 },
        }}
      >
        {/* Registered Since UI */}
        <Stack spacing={1}>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: 11, md: 14 },
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 0.4,
            }}
          >
            REGISTERED SINCE
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: 14, md: 16 },
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {createdAt}
          </Typography>
        </Stack>

        {/* Payment Status UI */}
        <Stack spacing={1}>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: 11, md: 14 },
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 0.4,
            }}
          >
            PAYMENT STATUS
          </Typography>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineOutlined
              sx={{
                fontSize: 19,
                color: "success.dark",
              }}
            />

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 14, md: 16 },
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              {isActive ? "Up-to-date" : "unknown"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {/* Mobile button only */}
      {isMobile && (
        <Button
          variant="contained"
          onClick={() => {
            alert("clicked");
          }}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            width: "100%",
            textTransform: "none",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 1.5,
            px: 3,
            py: 1.2,
          }}
        >
          Manage Estate
        </Button>
      )}
    </Paper>
  );
};

export default EstateBanner;
