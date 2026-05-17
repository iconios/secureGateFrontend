"use client";

import { Box, Typography, Avatar, Chip, useTheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SpeedIcon from "@mui/icons-material/Speed";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import Stack from "@mui/material/Stack";

export default function BrandColumn() {
  const theme = useTheme();

  return (
    <Box
      component="aside"
      sx={{
        gridColumn: { xs: "span 12", lg: "span 5" },
        bgcolor: "primary.dark",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: { xs: 3, md: 4, lg: 6 },
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* Background Decoration - Grid Pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              height="40"
              width="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%" />
        </svg>
      </Box>

      {/* Main Content */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Stack spacing={4}>
          {/* Location Badge */}
          <Chip
            icon={<LocationOnIcon sx={{ fontSize: "1rem" }} />}
            label="Lagos Operations"
            sx={{
              width: "fit-content",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "9999px",
              color: "white",
              "& .MuiChip-label": {
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.75rem",
                fontWeight: 500,
              },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />

          {/* Heading Section */}
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "white",
                mb: 2,
              }}
            >
              Create your Estate Manager account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "rgba(255, 255, 255, 0.9)",
                maxWidth: "28rem",
              }}
            >
              Digitise estate access control, resident management, and security
              logs with Nigeria's most trusted gatehouse infrastructure.
            </Typography>
          </Box>

          {/* Features List */}
          <Stack spacing={3}>
            {/* Feature 1 */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  p: 1,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VerifiedUserIcon sx={{ color: "white" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.125rem", md: "1.25rem" },
                    fontWeight: 600,
                    color: "white",
                    mb: 0.5,
                  }}
                >
                  ISO 27001 Certified
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Banking-grade encryption for all resident data and visitor
                  logs.
                </Typography>
              </Box>
            </Stack>

            {/* Feature 2 */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  p: 1,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SpeedIcon sx={{ color: "white" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.125rem", md: "1.25rem" },
                    fontWeight: 600,
                    color: "white",
                    mb: 0.5,
                  }}
                >
                  Zero-Latency Access
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Process visitor entries in under 5 seconds with our edge-sync
                  technology.
                </Typography>
              </Box>
            </Stack>

            {/* Feature 3 */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  p: 1,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CorporateFareIcon sx={{ color: "white" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.125rem", md: "1.25rem" },
                    fontWeight: 600,
                    color: "white",
                    mb: 0.5,
                  }}
                >
                  Institutional Trust
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Trusted by over 500 premium estates across Lekki, Ikoyi, and
                  Ikeja.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Trust Section with Avatars */}
      <Box sx={{ position: "relative", zIndex: 10, pt: 6 }}>
        <Stack direction="row" spacing={-1.5} sx={{ overflow: "hidden" }}>
          <Avatar
            alt="Estate Manager"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNvogjcoWsQ_ZDrSZ1O2XShuhbKyNdJEscmYdwti7J8mCnHh7orKVpvTEQl0-i03iU35-qn2QVb6jHL2EE26_fxb65mTyudQr26jT8pjEvfDeMqwCQ1hPzLAUR66HCxEmikUKTNVSd9yFFjCBcdYn5FEPIMCqEY7hgVe3OlL1yPL_xpw8-6wb-EuLvddjfT9KHDrmSH_ay2kyXqAB2FHwJivTsjaoa55Qb3uvemJn1O-gL0aXMfNMp8mErcbFCDzuVY6zcgUY7NyQ"
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.primary.dark}`,
              "&:not(:first-of-type)": {
                ml: -1.5,
              },
            }}
          />
          <Avatar
            alt="Property Manager"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-t4QIKlpZeDiYxJyo2C7Ctg4MH6HZ2dI08P78Rkw60GZJgum8wVpfvSLRWbFiGT-5zVfnqOSX1AURFgs61BlkksfwvQPjlSEhkxTTairQJvimuBO6eYBpHjdNMRu0XK0Lm8fQjquwwgd2Mh1VXmyLL83FXQm5QtOhb9CAb52HCNNzppXuQcFb-pGt2FBcriluwfJ3GNpusn6oqngWOePSVozDz1GMDOp6Ak8T-cmmCIdNK2GVr1V-8b9N7qpaVB5p7XbgfXS9Urk"
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.primary.dark}`,
              "&:not(:first-of-type)": {
                ml: -1.5,
              },
            }}
          />
          <Avatar
            alt="Security Consultant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEUXtW1sHL6EcjrJSGbHMomlTjzjoIEbo12AOK3c_q6Y2qcW5Pkt6tIjgRAeOyR0UqbWCzQoVWM-gR0KZMAfeX0nyuIrp5Cqyp6gu--s3youxGT-7ZlVXHX_6PZbRYjbzxGbsdEmZNyLnTwYfhFpra9YAWIjqrr3FUcih9l-P6OO2kxZKJ1MTMJBKn5zKXQE3AWPUdSuv1yBRbTkwj9_x8l0QVmwJ-nq5UAgvy24-cGDdIpxO437JnrTYpXGa6sSe4cgnbe82JAgQ"
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.primary.dark}`,
              "&:not(:first-of-type)": {
                ml: -1.5,
              },
            }}
          />
        </Stack>
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Join 2,000+ certified managers
        </Typography>
      </Box>
    </Box>
  );
}
