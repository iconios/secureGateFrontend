"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { DeleteHouseholdSuccessData } from "./types";
import {
  Close,
  Check,
  ArrowBack,
  PersonOffOutlined,
  ArchiveOutlined,
} from "@mui/icons-material";
import { ReactNode } from "react";

const SummaryItem = ({ label }: { label: string }) => {
  return (
    <Typography
      sx={{
        color: "text.secondary",
        fontSize: { xs: 12, md: 16 },
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
  );
};

const CompoundItem = ({ label, icon }: { label: string; icon: ReactNode }) => {
  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      {icon}
      <SummaryItem label={label} />
    </Box>
  );
};

export const DeleteHouseholdSuccess = ({
  open,
  onDismiss,
  houseCode,
  unitNumber,
  blockOrStreet,
  totalResidents,
}: DeleteHouseholdSuccessData) => {
  // Initialize local variables
  const unitDetails = [unitNumber, blockOrStreet].filter(Boolean).join(", ");

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      maxWidth="sm"
      fullWidth
      sx={{
        borderRadius: 2,
        padding: 2,
      }}
    >
      <DialogTitle
        sx={{
          width: "100%",
          backgroundColor: "#CCE7C9",
          mb: 2,
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
          aria-label="Close success dialog"
          onClick={onDismiss}
        >
          <Close fontSize="medium" />
        </IconButton>
        <Box
          sx={{
            padding: 1.5,
            borderRadius: "50%",
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
            mb: 2,
            border: "3px solid",
            borderColor: "#E8E8E8",
            backgroundColor: "#E8E8E8",
          }}
        >
          <Check color="success" fontSize="large" />
        </Box>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Household Deleted Successfully
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#e8e8e8",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 13, md: 16 },
            textAlign: "center",
          }}
        >
          Household{" "}
          <strong>
            {houseCode} ({unitDetails})
          </strong>{" "}
          has been deleted permanently from the database.
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
            display: "flex",
          }}
        >
          <CompoundItem
            icon={<PersonOffOutlined fontSize="medium" />}
            label={`${totalResidents} residents revoked`}
          />

          <Box component="span" sx={{ mx: 0.5, alignSelf: "center" }}>
            &bull;
          </Box>

          <CompoundItem
            icon={<ArchiveOutlined fontSize="medium" />}
            label="Logs archived"
          />
        </Stack>

        <Typography
          sx={{
            color: "text.secondary",
            fontStyle: "italic",
            fontSize: { xs: 12, md: 14 },
            fontWeight: 300,
          }}
        >
          All historical logs have been archived for security review.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#E8E8E8",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            flexGrow: 1,
            backgroundColor: "#000000",
            color: "background.paper",
          }}
          onClick={onDismiss}
        >
          Return to Households
        </Button>
      </DialogActions>
    </Dialog>
  );
};
