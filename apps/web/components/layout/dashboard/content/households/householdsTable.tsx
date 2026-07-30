"use client";

import {
  Stack,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { HouseholdsTableData } from "./types";
import { EmptyHouseholdTable } from "./emptyTable";
import { SearchOutlined } from "@mui/icons-material";
import { HouseholdTableSkeleton } from "./skeletonHouseholdsTable";

export const HouseholdsTable = ({
  householdsTableData,
  searchTerm,
  setSearchTerm,
  isFetching,
}: {
  householdsTableData: HouseholdsTableData;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  isFetching: boolean;
}) => {
  const data = householdsTableData?.households;

  if (data === null) {
    return <EmptyHouseholdTable />;
  }
  return (
    <Paper elevation={1}>
      {/** Search bar */}
      <Box
        sx={{
          p: { xs: 1, md: 2 },
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search household code, unit, principal resident name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Table of households */}
      <Stack direction="row" spacing={2}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="recent gate activity alerts"
          >
            <TableHead>
              <TableRow>
                {[
                  "Code",
                  "Unit",
                  "Principal Resident",
                  "Members",
                  "Assistants",
                ].map((heading) => (
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
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching ? (
                <HouseholdTableSkeleton />
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: { xs: 12, md: 16 }, fontWeight: 700 }}
                      >
                        {row.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: { xs: 12, md: 16 }, fontWeight: 700 }}
                      >
                        {row.unitNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Avatar
                          src={row.principalResident?.photoUrl ?? undefined}
                          alt={row.principalResident?.fullName ?? undefined}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontSize: { xs: 12, md: 16 },
                            fontWeight: 700,
                          }}
                        >
                          {row.principalResident?.fullName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: { xs: 12, md: 16 } }}>
                        {row.memberCount > 1
                          ? `${row.memberCount} members`
                          : `${row.memberCount} member`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: { xs: 12, md: 16 } }}>
                        {row.assistantCount > 1
                          ? `${row.assistantCount} assistants`
                          : `${row.assistantCount} assistant`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};
