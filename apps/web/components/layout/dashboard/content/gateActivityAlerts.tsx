"use client";

import { PersonOffOutlined } from "@mui/icons-material";
import {
  Button,
  Chip,
  Icon,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const RecentGateActivityAlerts = () => {
  const data = [
    {
      time: "10:45 AM",
      type: "resident",
      person: "john doe",
      unit: "unit 12",
      vehicle: "abc-123",
      gate: "vehicle gate",
      status: "approved",
      reason: "",
    },
    {
      time: "10:48 AM",
      type: "guest",
      person: "jane smith",
      unit: "unit 45",
      vehicle: "xyz-789",
      gate: "service gate",
      status: "denied",
      reason: "blacklisted",
    },
  ];

  const criticalAlerts = [
    {
      time: "9:30 AM",
      type: "Overstayed Guest",
      unit: "Unit 23",
      id: "1938403",
    },
    {
      time: "8:15 AM",
      type: "Unauthorized Vehicle",
      unit: "Unit 4B",
      id: "1992837",
    },
  ];

  return (
    <Stack direction="row" spacing={2}>
      {/* Table of recent gate activity alerts */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="recent gate activity alerts">
          <TableHead>
            <TableRow>
              {["Time / Type", "Person / Unit", "Vehicle", "Gate / Status"].map(
                (heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {heading}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((log) => (
              <TableRow key={`${log.time}-${log.vehicle}`} hover>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                    {log.time}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {log.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                    {log.person}
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>{log.unit}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {log.vehicle}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, mb: 0.5 }}>
                    {log.gate}
                  </Typography>
                  <Chip
                    size="small"
                    label={log.status}
                    sx={{
                      height: 22,
                      borderRadius: 1,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: log.status === "approved" ? "white" : "red",
                      bgcolor:
                        log.status === "approved"
                          ? "rgba(0,125,85,0.08)"
                          : "rgba(255,218,214,0.35)",
                      border: `1px solid ${log.status === "approved" ? "rgba(0,125,85,0.25)" : "rgba(186,26,26,0.2)"}`,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Critical alerts section */}
      <Paper
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          bgcolor: "rgba(0,0,0,0.02)",
        }}
      >
        <Stack direction="column" spacing={1} sx={{ pr: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            <Icon>⚠️</Icon> Critical Alerts
          </Typography>
          <Stack direction="row" spacing={1}>
            <Icon>
              <PersonOffOutlined sx={{ color: "error.main" }} />
            </Icon>
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                flex: 1,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                {criticalAlerts[0]?.type}
              </Typography>
              <Typography sx={{ fontSize: 11 }}>
                {criticalAlerts[0]?.unit} - {criticalAlerts[0]?.time}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ fontSize: 10, textTransform: "none", px: 1 }}
                >
                  Contact Resident
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ fontSize: 10, textTransform: "none", px: 1 }}
                >
                  Dismiss
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default RecentGateActivityAlerts;
