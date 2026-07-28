"use client";

import { Close, InfoOutlined } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { CreateHouseholdFormInput, CreateHouseholdPayload } from "./types";
import { ChangeEvent, useMemo, useState } from "react";
import { useFetchBlockOrStreet } from "../../../../../hooks/useFetchBlockOrStreet";

export const HouseholdUnitDetailsProvision = ({
  estateId,
  customOptions,
  handleSetCustomOptions,
}: {
  estateId: string;
  customOptions: string[];
  handleSetCustomOptions: (v: string) => void;
}) => {
  const { isError, error, data, isPending } = useFetchBlockOrStreet(estateId);

  const [blockOrStreetText, setBlockOrStreetText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Local state for custom options
  const { control, setValue } = useFormContext<
    CreateHouseholdFormInput,
    unknown,
    CreateHouseholdPayload
  >();

  const watchedValues = useWatch({
    control,
  });

  const unitNumber = watchedValues?.households?.[0]?.house?.unitNumber ?? "";
  const blockOrStreet =
    watchedValues?.households?.[0]?.house?.blockOrStreet ?? "";

  const fullUnitAddress = [unitNumber, blockOrStreet].filter(Boolean).join(" ");

  const options = useMemo(() => {
    const fetchedOptions = data ?? [];

    return Array.from(
      new Set(
        [...fetchedOptions, ...customOptions]
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }, [data, customOptions]);

  const addToOptions = (value: string): void => {
    const cleanedValue = value.trim();

    if (!cleanedValue) return;

    handleSetCustomOptions(cleanedValue);

    // setValue expects the full path for nested households structure
    setValue(`households.0.house.blockOrStreet`, cleanedValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 1, md: 2 },
        }}
      >
        {/* Form fields for unit details */}
        <Controller
          name="households.0.house.unitNumber"
          control={control}
          render={({ field, fieldState }) => (
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                UNIT NUMBER
              </Typography>
              <TextField
                variant="outlined"
                size="medium"
                placeholder="e.g. A-101"
                fullWidth
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            </Grid>
          )}
        />
        <Controller
          name="households.0.house.blockOrStreet"
          control={control}
          render={({ field, fieldState }) => (
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                BLOCK / STREET
              </Typography>
              <TextField
                variant="outlined"
                size="medium"
                placeholder="Skyview Towers, West Wing"
                fullWidth
                select
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {isError && <Typography>{error.message}</Typography>}
                {isPending && <CircularProgress size="large" color="primary" />}
                {options.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
                <MenuItem
                  value=""
                  onClick={(event) => {
                    event.preventDefault();
                    setDialogOpen(true);
                  }}
                >
                  + Add New
                </MenuItem>
              </TextField>
            </Grid>
          )}
        />

        <Grid size={12}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            HOUSE LABEL / FORMAL ADDRESS
          </Typography>
          <TextField
            variant="outlined"
            size="medium"
            value={fullUnitAddress}
            placeholder="A-101 Skyview Towers, West Wing"
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mt: 0.5,
            }}
          >
            This will be used on all official digital badges and correspondence.
          </Typography>
        </Grid>

        <Grid size={12}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              borderRadius: 1,
              alignItems: "flex-start",
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <InfoOutlined color="primary" fontSize="small" />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              Ensure the unit number matches the physical signage for emergency
              response accuracy. Incorrect data may delay security protocols.
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* Dialog box to add new block or street options */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        aria-labelledby="estate-block-or-street-options-adder"
      >
        <DialogTitle>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: { xs: 14, md: 20 },
              }}
            >
              Add New Estate Block Or Street
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleDialogClose();
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the new estate block or street you wish to add
          </DialogContentText>
          <TextField
            label="Block or Street Name"
            variant="outlined"
            value={blockOrStreetText}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBlockOrStreetText(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ p: 3, display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={handleDialogClose}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addToOptions(blockOrStreetText);
              setBlockOrStreetText("");
              handleDialogClose();
            }}
            disabled={blockOrStreetText === ""}
            variant="contained"
          >
            Add New
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
