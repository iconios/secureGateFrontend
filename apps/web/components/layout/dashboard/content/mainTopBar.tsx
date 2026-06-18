"use client";

import {
  ApartmentOutlined,
  NotificationsOutlined,
  Search,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { MainTopBarProps } from "./estate.types";

const MainTopBar = ({
  estates,
  changeSelectedEstate,
  selectedEstateId,
}: MainTopBarProps) => {
  return (
    <Box
      component="form"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 1.5, md: 2 },
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.5, md: 1 },
      }}
      autoComplete="off"
    >
      <TextField
        id="main-search"
        variant="outlined"
        placeholder="Search residents, vehicles or logs..."
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          width: { xs: "100%", md: "auto" },
          flexGrow: 1,
          minWidth: { md: 320 },
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: { xs: "100%", md: "auto" },
        }}
      >
        <IconButton
          aria-label="notifications"
          size="medium"
          sx={{
            flexShrink: 0,
            border: 1,
            borderColor: "divider",
          }}
        >
          <NotificationsOutlined color="primary" fontSize="medium" />
        </IconButton>

        <TextField
          id="estate-selector"
          select
          value={selectedEstateId}
          onChange={(event) => changeSelectedEstate(event.target.value)}
          size="small"
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return "Estate Selector";
                }

                const selectedEstate = estates.find(
                  (estate) => estate.id === selected,
                );
                return selectedEstate?.name ?? "Estate Selector";
              },
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ApartmentOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flexGrow: { xs: 1, md: 0 },
            width: { xs: "100%", md: 280 },
            minWidth: 0,
          }}
        >
          <MenuItem value="" disabled>
            Estate Selector
          </MenuItem>

          {estates.map((estate) => (
            <MenuItem key={estate.id} value={estate.id}>
              {estate.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default MainTopBar;
