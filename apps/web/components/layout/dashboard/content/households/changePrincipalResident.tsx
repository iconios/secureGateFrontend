"use client";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  FormControl,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ChangePrincipalResidentSkeleton } from "./skeletonChangePrincipalResidentContent";
import { showToast } from "../../../../../utils/toast";

type Resident = {
  id: string;
  personId: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string;
};

type ChangePrincipalResidentProps = {
  residents: Resident[];
  selectedId: string;
  searchTerm: string;
  isPending: boolean;
  setSearchTerm: (value: string) => void;
  setSelectedId: (value: string) => void;
};

export const ChangePrincipalResident = ({
  residents,
  selectedId,
  setSelectedId,
  searchTerm,
  setSearchTerm,
  isPending,
  isError,
  error,
}: ChangePrincipalResidentProps & {
  isError: boolean;
  error: Error | null;
}) => {
  const hasResidents = residents.length > 0;

  let content;

  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Change principal resident error";
    showToast.error(errorMessage);
  }

  if (isPending) {
    content = <ChangePrincipalResidentSkeleton />;
  } else if (hasResidents) {
    content = (
      <Box>
        <Typography
          component="p"
          sx={{
            mb: { xs: 1, md: 2 },
            fontSize: { xs: 12, md: 16 },
            fontWeight: 600,
          }}
        >
          {residents.length} {residents.length === 1 ? "RESULT" : "RESULTS"}{" "}
          FOUND
        </Typography>

        <FormControl fullWidth>
          <RadioGroup
            aria-label="Choose a resident"
            name="resident"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <Stack spacing={{ xs: 1, md: 2 }}>
              {residents.map((resident) => {
                const selected = resident.id === selectedId;
                const inputId = `resident-${resident.id}`;

                return (
                  <Box
                    component="label"
                    htmlFor={inputId}
                    key={resident.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: { xs: 1, sm: 1.25 },
                      py: { xs: 1, sm: 1.25 },
                      border: "2px solid",
                      borderColor: selected ? "#2383E2" : "#C9CBCD",
                      borderRadius: "11px",
                      backgroundColor: selected ? "#F4F8FC" : "#FFFFFF",
                      cursor: "pointer",
                      transition:
                        "border-color 160ms ease, background-color 160ms ease",
                      "&:hover": {
                        borderColor: selected ? "#2383E2" : "#96999D",
                      },
                      "&:focus-within": {
                        outline: "3px solid rgba(35, 131, 226, 0.18)",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Image
                        src={resident.photoUrl}
                        alt=""
                        width={45}
                        height={45}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />

                      <Typography noWrap>{resident.fullName}</Typography>
                    </Box>

                    <Radio
                      id={inputId}
                      value={resident.id}
                      disableRipple
                      slotProps={{
                        input: {
                          "aria-label": `Select ${resident.fullName}`,
                        },
                      }}
                      sx={{
                        p: 0.5,
                        ml: 1.5,
                        color: "#C9CDD3",
                        "&.Mui-checked": {
                          color: "#2383E2",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 29,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box>
    );
  } else {
    content = (
      <Typography color="text.secondary">
        No non-principal residents found.
      </Typography>
    );
  }

  return (
    <>
      <TextField
        placeholder="Search for a resident to replace..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
        sx={{ mb: 2 }}
      />
      {content}
    </>
  );
};
