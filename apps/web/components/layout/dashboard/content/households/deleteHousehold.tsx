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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteFormSchema, OpenHandleProps } from "./types";
import { Close, DeleteForever, Warning } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { zodResolver } from "@hookform/resolvers/zod";

type ReasonType = {
  id: string;
  label: string;
  value: string;
};

const reasons: ReasonType[] = [
  {
    id: "001",
    label: "Household moved",
    value: "household moved",
  },
  {
    id: "002",
    label: "Duplicate record",
    value: "duplicate record",
  },
  {
    id: "003",
    label: "Created in error",
    value: "created in error",
  },
  {
    id: "004",
    label: "Administrative closure",
    value: "administrative closure",
  },
];

export const DeleteHouseholdRecord = ({ open, setOpen }: OpenHandleProps) => {
  // Initialize local variables
  const { houseCode } = useSelector((state: RootState) => state.household);
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    mode: "onTouched",
    resolver: zodResolver(DeleteFormSchema(houseCode)),
    defaultValues: {
      reason: "",
      confirm: "",
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    setOpen(false);
  };

  const onSubmit = (data: { reason: string; confirm: string }) => {
    // handle submission data
    // placeholder: replace with actual submit logic
    // e.g., call API to deactivate household
    console.log(data);
    handleClose();
    return;
  };

  return (
    <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="xs"
        fullWidth
        aria-labelledby="deactivate-household-title"
        aria-describedby="deactivate-household-description"
    >
      <DialogTitle
        id="deactivate-household-title"
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
            gap: 1
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
            <Warning sx={{ fontSize: {xs: "small", md: "large"}}} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: "text.primary",
              fontSize: { xs: 16, md: 22 },
              fontWeight: 600,
            }}
          >
            Delete Household Record
          </Typography>
        </Box>
        <IconButton onClick={handleClose}
            disabled={isSubmitting}
          aria-label="Close deactivation dialog"
        >
          <Close
            sx={{
              fontSize: { xs: "small", md: "large" },
            }}
          />
        </IconButton>
      </DialogTitle>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>        
        <DialogContentText
            id="deactivate-household-description"
            component="div"
          sx={{
            borderLeft: "4px solid",
            borderLeftColor: "secondary.dark",
            backgroundColor: "#FFF2F2",
            padding: 1.5,
            marginBottom: 2
          }}
        >
          This action will deactivate the household code{" "}
          <Box component="strong" sx={{color: "secondary.dark"}}>
            {houseCode}
          </Box>{" "}
          and revoke access for all linked household residents. Historical
          records will be preserved in the audit log.
        </DialogContentText>

        {/* Reason for deletion UI */}
        <Controller
          name="reason"
          control={control}
          render={({ field, fieldState }) => (
            <Box
              sx={{
                marginBottom: 2,
              }}
            >
              <Typography
                component="label"
                htmlFor="deactivation-reason"
                sx={{
                    color: "text.primary",
                    fontSize: {xs: 13, md: 16},
                    fontWeight: 600,
                    marginBottom: 1
                }}
              >
                Reason for Deletion
            </Typography>
              <TextField
                {...field}
                id="deactivation-reason"
                name="reason"
                select
                variant="outlined"
                fullWidth
                size="medium"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="" disabled>
                    Select a reason...
                </MenuItem>

                {reasons.map((reason) => (
                  <MenuItem key={reason.id} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        />

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
                    fontSize: {xs: 13, md: 16},
                    fontWeight: 600,
                    marginBottom: 1
                }}
              >
                Confirm Household Code
                </Typography>
              <Typography
                variant="body2"
                sx={{
                    color: "text.secondary",
                    fontSize: {xs: 12, md: 14},
                }}
              >
                Type{" "}
                <span>
                  <strong>{houseCode}</strong>
                </span>{" "}
                to confirm deletion.
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
                  disabled={isSubmitting}
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
          disabled={isSubmitting}
          sx={{
            flexShrink: 0,
          }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<DeleteForever sx={{color: "background.paper"}} />}
          type="submit"
          disabled={isSubmitting}
          sx={{
            flexGrow: 1,
            color: "background.paper",
            fontWeight: 600,
            backgroundColor: "secondary.dark"
          }}
        >
          {isSubmitting ? "Deactivating..." : "Deactivate & Delete"}
        </Button>
      </DialogActions>
      </Box>      
    </Dialog>
  );
};
