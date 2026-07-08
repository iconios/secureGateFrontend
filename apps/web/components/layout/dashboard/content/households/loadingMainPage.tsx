"use client";

import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const LoadingHouseholdPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Page heading */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={44} />
        <Skeleton variant="text" width={520} height={24} />
        <Skeleton variant="text" width={360} height={24} />
      </Stack>

      {/* Warning banner */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          px: 2,
          py: 1.5,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "#fde68a",
          backgroundColor: "#fffbeb",
        }}
      >
        <Skeleton variant="text" width="70%" height={24} />
      </Paper>

      {/* Stats cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              height: 150,
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "#ffffff",
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton variant="rounded" width={36} height={36} />
                <Skeleton variant="rounded" width={44} height={24} />
              </Stack>

              <Skeleton variant="text" width={130} height={18} />
              <Skeleton variant="text" width={70} height={42} />
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Table container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Search area */}
        <Box sx={{ px: 2, py: 2 }}>
          <Skeleton variant="rounded" width={380} height={42} />
        </Box>

        <Divider />

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
              {[
                "Code",
                "Unit",
                "Principal Resident",
                "Members",
                "Assistant",
                "Vehicles",
              ].map((item) => (
                <TableCell key={item}>
                  <Skeleton variant="text" width={90} height={22} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Skeleton variant="text" width={70} height={22} />
                    <Skeleton variant="text" width={80} height={22} />
                  </Stack>
                </TableCell>

                <TableCell>
                  <Skeleton variant="text" width={45} height={24} />
                </TableCell>

                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                  >
                    <Skeleton variant="circular" width={34} height={34} />
                    <Stack>
                      <Skeleton variant="text" width={80} height={22} />
                      <Skeleton variant="text" width={70} height={22} />
                    </Stack>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Skeleton variant="text" width={80} height={24} />
                </TableCell>

                <TableCell>
                  <Skeleton variant="text" width={90} height={24} />
                </TableCell>

                <TableCell>
                  <Skeleton variant="text" width={40} height={24} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider />

        {/* Pagination */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            px: 2,
            py: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Skeleton variant="text" width={220} height={24} />

          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={72} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={56} height={36} />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
