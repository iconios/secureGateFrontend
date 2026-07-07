"use client";

import { InfoOutlined, Refresh, WifiOff } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

export const ErrorHouseholdsPage = ({
  message,
  code,
  requestId,
  refetch,
}: {
  message: string;
  code: string;
  requestId: string;
  refetch: () => void;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        mb: { xs: 2, md: 3 },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: 104,
          height: 104,
          mb: { xs: 2, md: 3 },
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          mx: "auto",
          borderRadius: 2,
          boxShadow: "0 14px 35px rgba(15 23 42 0.14)",
        }}
      >
        <WifiOff
          sx={{
            fontSize: 48,
            color: "primary.main",
          }}
        />
      </Paper>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 24, md: 30 },
          lineHeight: 1.2,
          color: "text.primary",
          mx: "auto",
          mb: 1.5,
        }}
      >
        Unable to load household data
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontSize: { xs: 14, md: 16 },
          lineHeight: 1.5,
          maxWidth: 440,
          mb: { xs: 3, md: 3.5 },
        }}
      >
        {message ||
          "The household management service is currently unreachable. Our security protocol prevents data access until a stable connection is re-established."}
      </Typography>
      <Button
        size="large"
        startIcon={<Refresh />}
        variant="contained"
        sx={{
          minWidth: 190,
          height: 48,
          color: "#ffffff",
          fontWeight: 700,
          mx: "auto",
          borderRadius: 1,
          mb: { xs: 2, md: 3 },
          textTransform: "none",
          boxShadow: "0 8px 18px rgba(25, 118, 210, 0.25)",
        }}
        onClick={() => refetch()}
      >
        Retry Connection
      </Button>
      <Paper
        elevation={1}
        sx={{
          px: { xs: 1, md: 2 },
          py: { xs: 2, md: 3 },
          borderRadius: 1,
          width: "100%",
          border: "1px solid",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            px: { xs: 2, md: 2.5 },
            py: 1.75,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <InfoOutlined
              sx={{
                color: "text.primary",
                fontSize: 20,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: { xs: 12, md: 15 },
              }}
            >
              Diagnostics
            </Typography>
          </Stack>

          <Chip
            label="CRITICAL"
            size="small"
            sx={{
              height: 24,
              fontSize: 11,
              fontWeight: 800,
              color: "#b91c1c",
              backgroundColor: "#fee2e2",
              borderRadius: 1,
            }}
          />
        </Stack>

        <DiagnosticRow
          label="Error Reference:"
          value={code || "ERR_CONNECTION_REFUSED"}
          danger
        />

        <DiagnosticRow
          label="Request ID:"
          value={requestId || "NOT AVAILABLE"}
        />

        <DiagnosticRow label="Timestamp:" value={new Date().toISOString()} />
      </Paper>
    </Box>
  );
};

const DiagnosticRow = ({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        px: { xs: 2, md: 2.5 },
        py: 1.5,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 14,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: danger ? "#b91c1c" : "text.primary",
          fontSize: 14,
          fontWeight: 700,
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};
