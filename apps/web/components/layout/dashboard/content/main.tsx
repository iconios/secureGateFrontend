"use client";

import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import { useDashboardData } from "../../../../hooks/useDashboardData";
import MainTopBar from "./mainTopBar";
import CreateEstateWizardForm from "./createEstateWizard";
import EstateBanner from "./estateBanner";
import Metrics from "./metrics";
import RecentGateActivityAlerts from "./gateActivityAlerts";
import { Error } from "@mui/icons-material";
import useAuthCheck from "../../../../hooks/useAuthCheck";

const OverviewPage = ({ authToken }: { authToken: string }) => {
  // Check that user is authenticated, else go back to login page
  useAuthCheck();

  // Get dashboard data from custom react hook
  const { isError, error, data, isPending, refetch } =
    useDashboardData(authToken);
  console.log("Dashboard data:", data);
  const estates = data?.data || [];
  const estatesSummary = estates.map((estate) => {
    return {
      id: estate.estate_id,
      name: estate.estate_name,
    };
  });

  if (isError) {
    console.log("Dashboard error:", error);
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          px: { xs: 2, md: 3 },
        }}
      >
        <Error
          color="primary"
          fontSize="large"
          sx={{
            mb: { xs: 2, md: 3 },
          }}
        />
        <Typography
          sx={{
            fontSize: { xs: 12, md: 16 },
            textAlign: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          {error.message}
        </Typography>
        <Button onClick={() => refetch()} variant="contained">
          Click to refresh
        </Button>
      </Box>
    );
  }

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Icon>
          <CircularProgress size="large" color="primary" />
        </Icon>
        <Typography
          sx={{
            fontSize: { xs: 12, md: 16 },
          }}
        >
          Page loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {estates.length === 0 ? (
        <CreateEstateWizardForm />
      ) : (
        <Box>
          <MainTopBar estates={estatesSummary} />
          <EstateBanner />
          <Metrics />
          <RecentGateActivityAlerts />
        </Box>
      )}
    </>
  );
};

export default OverviewPage;
