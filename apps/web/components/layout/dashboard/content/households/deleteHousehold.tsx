"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteFormSchema, OpenHandleProps } from "./types";
import { Close, DeleteForever, Warning } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteHousehold } from "../../../../../hooks/useDeleteHousehold";
import { householdActions } from "../../../../../lib/features/household/householdSlice";
import { DeleteHouseholdSuccess } from "./deleteHouseholdSuccess";
import { useState } from "react";

export const DeleteHouseholdRecord = ({ open, setOpen }: OpenHandleProps) => {
  // Initialize local variables
  const dispatch = useDispatch();
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const { clearHouseholdData, closeEditView } = householdActions;
  const { houseCode, householdId } = useSelector(
    (state: RootState) => state.household,
  );
  const estateId = useSelector((state: RootState) => state.estate.estateId);
  const { mutateAsync, isPending: isDeleting } = useDeleteHousehold(
    estateId,
    householdId,
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(DeleteFormSchema(houseCode)),
    defaultValues: {
      confirm: "",
    },
  });

  const isBusy = isSubmitting || isDeleting;

  const handleClose = () => {
    if (isBusy) return;

    reset({
      confirm: "",
    });
    setOpen(false);
  };

  const onSubmit = async () => {
    await mutateAsync();

    reset({
      confirm: "",
    });

    dispatch(closeEditView());
    setOpenDeleteSuccess(true);

    setOpen(false);
  };

  const handleCloseDeleteNotification = () => {
    setOpenDeleteSuccess(false);
    dispatch(clearHouseholdData());
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={isBusy ? undefined : handleClose}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-household-title"
        aria-describedby="delete-household-description"
      >
        <DialogTitle
          id="delete-household-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: { xs: 1, md: 0.5 },
            }}
          >
            <Box
              sx={{
                fontSize: { xs: "small", md: "inherit" },
                borderRadius: "50%",
                height: { xs: 25, md: 30 },
                width: { xs: 25, md: 30 },
                backgroundColor: "#FFF2F2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Warning sx={{ fontSize: { xs: "small", md: "large" } }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: "text.primary",
                fontSize: { xs: 16, md: 22 },
                fontWeight: 600,
              }}
            >
              Permanently Delete Household
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isBusy}
            aria-label="Close household deletion dialog"
          >
            <Close
              sx={{
                fontSize: "medium",
              }}
            />
          </IconButton>
        </DialogTitle>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText
              id="delete-household-description"
              component="div"
              sx={{
                borderLeft: "4px solid",
                borderLeftColor: "secondary.dark",
                backgroundColor: "#FFF2F2",
                padding: 1.5,
                marginBottom: 4,
              }}
            >
              This action will permanently delete household{" "}
              <Box component="strong" sx={{ color: "secondary.dark" }}>
                {houseCode}
              </Box>{" "}
              including all residents and vehicles associated with it. This
              action cannot be undone.
            </DialogContentText>

            {/* Confirm household code UI */}
            <Controller
              name="confirm"
              control={control}
              render={({ field, fieldState }) => (
                <Box
                  sx={{
                    marginBottom: 1.5,
                  }}
                >
                  <Typography
                    component="label"
                    htmlFor="household-code-confirmation"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: 13, md: 16 },
                      fontWeight: 600,
                      marginBottom: 1,
                    }}
                  >
                    Confirm Household Code
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 12, md: 14 },
                    }}
                  >
                    Type{" "}
                    <span>
                      <strong>{houseCode}</strong>
                    </span>{" "}
                    to permanently delete this household.
                  </Typography>
                  <TextField
                    {...field}
                    id="household-code-confirmation"
                    placeholder={houseCode}
                    name="confirm"
                    size="medium"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    disabled={isBusy}
                  />
                </Box>
              )}
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingX: 3,
              marginBottom: 3,
            }}
          >
            <Button
              variant="outlined"
              type="button"
              color="primary"
              onClick={handleClose}
              disabled={isBusy}
              sx={{
                flexShrink: 0,
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<DeleteForever sx={{ color: "background.paper" }} />}
              type="submit"
              disabled={isBusy || !estateId || !householdId || !houseCode}
              sx={{
                flexGrow: 1,
                color: "background.paper",
                fontWeight: 600,
                backgroundColor: "secondary.dark",
              }}
            >
              {isBusy ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Successful deletion UI */}
      <DeleteHouseholdSuccess
        open={openDeleteSuccess}
        onDismiss={handleCloseDeleteNotification}
      />
    </>
  );
};
