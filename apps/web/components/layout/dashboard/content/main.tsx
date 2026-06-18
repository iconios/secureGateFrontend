"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Fab, Typography } from "@mui/material";
import { Add, Error as ErrorIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useDashboardData } from "../../../../hooks/useDashboardData";
import CreateEstateWizardForm from "./createEstateWizard";
import useAuthCheck from "../../../../hooks/useAuthCheck";
import { showToast } from "../../../../utils/toast";
import { DisplaySelectedEstateDetails } from "./displayEstateDetails";

const OverviewPage = ({ authToken }: { authToken?: string | null }) => {
  // Step 1: Check authentication and prepare router.
  const [showCreateEstateForm, setShowCreateEstateForm] = useState(false);
  useAuthCheck();
  const router = useRouter();

  // Step 2: Always call the dashboard hook.
  const { isError, error, data, isLoading, isFetching, refetch } =
    useDashboardData(authToken);

  // Step 3: Detect token-related backend errors from data.error.
  const backendErrorCode = data?.error?.code;

  const isTokenError = [
    "TOKEN_EXPIRED",
    "INVALID_TOKEN",
    "TOKEN_DECODE_ERROR",
  ].includes(backendErrorCode ?? "");

  // Step 4: Handle token redirect as a side effect.
  useEffect(() => {
    if (!isTokenError) return;

    showToast.error("Session expired. Please log in again.");

    router.replace("/login");
  }, [isTokenError, router]);

  // Step 5: Handle missing auth token after hooks have been called.
  if (!authToken) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Please log in again.</Typography>
      </Box>
    );
  }

  // Step 6: Show redirecting screen while token redirect happens.
  if (isTokenError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography>Session expired. Redirecting to login...</Typography>
      </Box>
    );
  }

  // Step 7: Handle unexpected React Query/service thrown errors.
  if (isError) {
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
        <ErrorIcon
          color="primary"
          fontSize="large"
          sx={{ mb: { xs: 2, md: 3 } }}
        />

        <Typography
          sx={{
            fontSize: { xs: 12, md: 16 },
            textAlign: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          {error instanceof Error
            ? error.message
            : "Unable to load dashboard data."}
        </Typography>

        <Button onClick={() => refetch()} variant="contained">
          Click to refresh
        </Button>
      </Box>
    );
  }

  // Step 8: Handle expected backend/API errors returned inside data.error.
  if (data?.error) {
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
        <ErrorIcon
          color="primary"
          fontSize="large"
          sx={{ mb: { xs: 2, md: 3 } }}
        />

        <Typography
          sx={{
            fontSize: { xs: 12, md: 16 },
            textAlign: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          {data.message || "Unable to load dashboard data."}
        </Typography>

        <Button onClick={() => refetch()} variant="contained">
          Click to refresh
        </Button>
      </Box>
    );
  }

  // Step 9: Show loading only during the first data load.
  if (isLoading && !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography sx={{ fontSize: { xs: 12, md: 16 } }}>
          Page loading...
        </Typography>
      </Box>
    );
  }

  // Step 10: Safely prepare estate data.
  const estates = Array.isArray(data?.data) ? data.data : [];

  // Step 11: Show create estate flow if user has no estates.
  if (estates.length === 0) {
    return <CreateEstateWizardForm />;
  }

  if (showCreateEstateForm) {
    return <CreateEstateWizardForm />;
  }

  // Step 12: Show dashboard overview.
  return (
    <Box>
      {isFetching && (
        <Typography
          sx={{
            fontSize: { xs: 10, md: 12 },
            textAlign: "right",
            pr: 2,
          }}
        >
          Refreshing...
        </Typography>
      )}
      <DisplaySelectedEstateDetails estates={estates} />
      <Fab
        color="primary"
        aria-label="add estate"
        onClick={() => {
          setShowCreateEstateForm(true);
        }}
        variant="extended"
        sx={{
          display: "block",
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: (theme) => theme.zIndex.speedDial,
          alignItems: "center",
        }}
      >
        <Add sx={{ mr: 1 }} />
        {estates.length > 0 ? "ADD" : "CREATE"} ESTATE
      </Fab>
    </Box>
  );
};

export default OverviewPage;
