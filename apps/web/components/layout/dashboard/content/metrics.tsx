"use client";

import {
  Block,
  FlagOutlined,
  HailOutlined,
  House,
  Person,
  ReportProblem,
  VerifiedOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MetricCard from "./metricCard";

const Metrics = () => {
  const data = {
    subscription_plan: "Premium",
    max_principal_residents: 1000,
    principal_residents_number: 850,
    next_bill: "01 Feb 2024",
    households: 320,
    active_guests: 45,
    flagged_guests: 3,
    blacklisted_vehicles: 2,
    open_incidents: 5,
  };

  const percentageSubscriptionUsage =
    (data.principal_residents_number / data.max_principal_residents) * 100;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1.35fr 2.65fr",
        },
        m: { xs: 2, md: 3 },
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* Current Plan */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          minHeight: { md: 360 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                }}
              >
                CURRENT PLAN
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "primary.main",
                  fontSize: { xs: 28, md: 34 },
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                {data.subscription_plan} Plan
              </Typography>
            </Box>

            <VerifiedOutlined
              sx={{
                fontSize: 42,
                color: "primary.main",
              }}
            />
          </Stack>

          <Box sx={{ mt: 4 }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 18,
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  {data.principal_residents_number} /{" "}
                  {data.max_principal_residents}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  Residents registered
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {Math.round(percentageSubscriptionUsage)}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={percentageSubscriptionUsage}
              sx={{
                mt: 2.5,
                height: 9,
                borderRadius: 10,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 10,
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Divider sx={{ mb: 3 }} />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 15,
                lineHeight: 1.3,
              }}
            >
              Next billing:{" "}
              <Box
                component="span"
                sx={{ color: "text.primary", fontWeight: 500 }}
              >
                {data.next_bill}
              </Box>
            </Typography>

            <Button
              variant="text"
              sx={{
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
              onClick={() => {}}
            >
              Upgrade Plan
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <MetricCard
          icon={<Person sx={{ color: "primary.main" }} />}
          value={data.principal_residents_number}
          label="Principal Residents"
          trend="+12"
        />

        <MetricCard
          icon={<House sx={{ color: "primary.main" }} />}
          value={data.households}
          label="Households"
          trend="+3"
        />

        <MetricCard
          icon={<HailOutlined sx={{ color: "primary.main" }} />}
          value={data.active_guests}
          label="Active Guests"
          trend="-5%"
          trendDirection="down"
        />

        <MetricCard
          icon={<FlagOutlined sx={{ color: "error.main" }} />}
          value={data.flagged_guests}
          label="Flagged Guests"
          accentColor="error.main"
        />

        <MetricCard
          icon={<Block sx={{ color: "text.primary" }} />}
          value={data.blacklisted_vehicles}
          label="Blacklisted Vehicles"
          accentColor="text.primary"
        />

        <MetricCard
          icon={<ReportProblem sx={{ color: "error.main" }} />}
          value={data.open_incidents}
          label="Open Incidents"
          accentColor="error.light"
        />
      </Box>
    </Box>
  );
};

export default Metrics;
