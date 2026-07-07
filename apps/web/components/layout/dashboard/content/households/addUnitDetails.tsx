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
import { useForm, Controller, useWatch } from "react-hook-form";
import { UnitDetailsData, UnitDetailsSchema } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { householdActions } from "../../../../../lib/features/household/householdSlice";
import { RootState } from "../../../../../lib/store";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useFetchBlockOrStreet } from "../../../../../hooks/useFetchBlockOrStreet";

export const HouseholdUnitDetailsProvision = ({
  estateId,
}: {
  estateId: string;
}) => {
  const dispatch = useDispatch();
  const { isError, error, data, isPending } = useFetchBlockOrStreet(estateId);
  const { insertOneUnitDetails } = householdActions;

  const [blockOrStreetText, setBlockOrStreetText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Read initial or persisitent values from redux
  const unitDetailsData = useSelector(
    (state: RootState) => state.household?.households?.[0]?.house,
  );

  const defaultValues = useMemo<UnitDetailsData>(
    () => ({
      unitNumber: unitDetailsData?.unitNumber ?? "",
      blockOrStreet: unitDetailsData?.blockOrStreet ?? "",
    }),
    [unitDetailsData],
  );

  const { control, reset } = useForm({
    mode: "onChange",
    resolver: zodResolver(UnitDetailsSchema),
    defaultValues,
  });

  const watchedValues = useWatch({
    control,
  });

  const unitNumber = watchedValues.unitNumber ?? "";
  const blockOrStreet = watchedValues.blockOrStreet ?? "";

  // Reactively monitor changes to dispatch them immediately to redux
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    dispatch(
      insertOneUnitDetails({
        unitNumber,
        blockOrStreet,
      }),
    );
  }, [unitNumber, blockOrStreet, dispatch, insertOneUnitDetails]);

  const fullUnitAddress = [unitNumber, blockOrStreet].filter(Boolean).join(" ");

  const options: string[] = data ?? [];
  const addToOptions = (v: string): void => {
    options.push(v);
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
          name="unitNumber"
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
          name="blockOrStreet"
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
                {options?.map((item) => (
                  <MenuItem key={item}>{item}</MenuItem>
                ))}
                <MenuItem>
                  <Button
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                    variant="contained"
                  >
                    Add New
                  </Button>
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
        maxWidth="sm"
        fullScreen={false}
        aria-labelledby="estate-block-or-street-options-adder"
      >
        <DialogTitle>
          <Typography>Add New Estate Block Or Street</Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              handleDialogClose();
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>
            Please enter the new estate block or street you wish to create
            households for
          </DialogContentText>
          <TextField
            label="Enter Block or Street Name"
            variant="outlined"
            value={blockOrStreetText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBlockOrStreetText(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (blockOrStreetText !== "") {
                addToOptions(blockOrStreetText);
                setBlockOrStreetText("");
                handleDialogClose();
              }
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
