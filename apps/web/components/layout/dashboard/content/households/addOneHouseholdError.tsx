import {
  Close,
  Check,
  ArrowBack,
  SummarizeOutlined,
  Warning,
  Refresh,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  DialogContent,
  Stack,
  Button,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { AddOneHouseholdErrorData } from "./types";

const SummaryItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: { xs: 10, md: 12 },
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "text.primary",
          fontSize: { xs: 12, md: 14 },
          fontWeight: 500,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export const AddOneHouseholdError = ({
  open,
  onClose,
  message,
  error,
  onBack,
  onRetry,
}: AddOneHouseholdErrorData) => {
  // Initialize local variables
  const { unitNumber, blockOrStreet, fullName, phone } = useSelector(
    (state: RootState) => state.household,
  );

  const unitDetails = [unitNumber, blockOrStreet].filter(Boolean).join(", ");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        mb: 4,
        px: 1,
      }}
    >
      <DialogTitle
        sx={{
          paddingBlock: 2,
          width: "100%",
          backgroundColor: "#FFA590",
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
          onClick={onClose}
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
            borderColor: "red",
            backgroundColor: "red",
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
          Unable to Create Household Record
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 13, md: 16 },
            textAlign: "center",
          }}
        >
          {message}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 2,
        }}
      >
        <Box
          sx={{
            borderLeft: "3px solid red",
            borderRadius: 2,
            padding: 1,
            backgroundColor: "#f0f0f0",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: "secondary.dark",
              fontSize: { xs: 16, md: 20 },
              fontWeight: 600,
              mb: 1,
            }}
          >
            <Warning fontSize="medium" color="error" /> {error.code}
          </Typography>
          <Typography
            sx={{
              color: "secondary.dark",
              fontSize: { xs: 14, md: 18 },
            }}
          >
            {error.details}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "text.primary",
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: 13, md: 16 },
          }}
        >
          <SummarizeOutlined /> Entered Data Summary
        </Typography>

        <Box
          sx={{
            p: 1,
            backgroundColor: "#f0f0f0",
            mb: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
            }}
          >
            <SummaryItem label="Primary Resident" value={fullName} />

            <SummaryItem label="Contact Number" value={phone} />
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
            }}
          >
            <SummaryItem label="Unit Assignment" value={unitDetails} />

            <SummaryItem label="" value="" />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#e8e8e8",
          padding: 2,
        }}
      >
        <Button
          startIcon={<Refresh fontSize="medium" />}
          variant="contained"
          sx={{
            flexGrow: 1,
            color: "background.paper",
          }}
          onClick={onRetry}
        >
          Retry Submission
        </Button>
        <Button
          startIcon={<ArrowBack fontSize="medium" />}
          variant="outlined"
          sx={{
            flexGrow: 1,
          }}
          onClick={onBack}
        >
          Back to Wizard
        </Button>
      </DialogActions>
    </Dialog>
  );
};
