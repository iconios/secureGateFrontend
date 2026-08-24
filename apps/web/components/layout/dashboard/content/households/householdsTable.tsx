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
import { HouseholdsTableData, MainEditHouseholdProps } from "./types";
import { EmptyHouseholdTable } from "./emptyTable";
import { SearchOutlined } from "@mui/icons-material";
import { HouseholdTableSkeleton } from "./skeletonHouseholdsTable";
import { EditHousehold } from "./editHousehold";
import { useDispatch, useSelector } from "react-redux";
import { householdActions } from "../../../../../lib/features/household/householdSlice";
import { RootState } from "../../../../../lib/store";

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
  const data = householdsTableData?.households ?? [];
  console.log("household data", data);
  const dispatch = useDispatch();
  const {
    insertEditHouseholdData,
    clearHouseholdData,
    closeEditView,
    openEditView,
  } = householdActions;
  const { openEdit } = useSelector((state: RootState) => state.household);

  const handleEditHousehold = (data: MainEditHouseholdProps) => {
    dispatch(insertEditHouseholdData(data));
    dispatch(openEditView());
  };

  const handleEditClose = () => {
    dispatch(clearHouseholdData());
    dispatch(closeEditView());
  };

  if (!isFetching && (!data || data.length === 0)) {
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
          <Table sx={{ minWidth: 650 }} aria-label="Households">
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
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => {
                      if (!row.principalResident) return;

                      handleEditHousehold({
                        householdId: row.id,
                        principalResidentId:
                          row.principalResident.residentId ?? "",
                        unitNumber: row.unitNumber,
                        blockOrStreet: row.blockOrStreet ?? "",
                        photoUrl: row.principalResident.photoUrl,
                        fullName: row.principalResident.fullName ?? "",
                        gender: row.principalResident.gender,
                        dateOfBirth: row.principalResident.dateOfBirth,
                        phone: row.principalResident.phone,
                        email: row.principalResident.email ?? "",
                        houseCode: row.code,
                        mobileAccess: row.mobileAccess ?? false,
                        guestPreAuthorize: row.guestPreAuthorize ?? false,
                        guestArrivalNotify: row.guestArrivalNotify ?? false,
                        emergencyAlerts: row.emergencyAlerts ?? false,
                        totalResidents: row.residentsTotal ?? 0,
                      });
                    }}
                  >
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

      {/* Edit household UI */}
      <EditHousehold open={openEdit} setOpen={handleEditClose} />
    </Paper>
  );
};
