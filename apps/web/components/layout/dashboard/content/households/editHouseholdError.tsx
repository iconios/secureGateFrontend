"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { OpenHandleProps } from "./types";
import { ArrowBack, Error, Refresh, Warning } from "@mui/icons-material";

export const EditHouseholdError = ({
  open,
  setOpen,
  errorTitle,
  errorBody,
  backButtonName,
  refetch,
  backFunction,
}: OpenHandleProps & {
  errorTitle: string;
  errorBody: string;
  backButtonName: string;
  refetch: () => void;
  backFunction: () => void;
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
      <DialogTitle
        sx={{
          padding: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            padding: 1.5,
            borderRadius: 1,
            backgroundColor: "#FFA590",
          }}
        >
          <Error color="error" fontSize="large" />
        </Box>
        <Typography
          sx={{
            color: "background.paper",
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
          }}
        >
          Household Update Failed
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 2,
        }}
      >
        <Box
          sx={{
            padding: 1,
            backgroundColor: "#FFA590",
          }}
        >
          <Typography
            sx={{
              color: "secondary.dark",
              fontSize: { xs: 16, md: 20 },
              fontWeight: 600,
            }}
          >
            <Warning fontSize="large" color="error" /> {errorTitle}
          </Typography>
          <Typography
            sx={{
              color: "secondary.dark",
              fontSize: { xs: 12, md: 18 },
            }}
          >
            {errorBody}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#E8E8E8",
          padding: 2,
        }}
      >
        <Button
          startIcon={<Refresh color="primary" />}
          variant="contained"
          sx={{
            flexShrink: 0,
          }}
          onClick={refetch}
        >
          Retry
        </Button>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            flexGrow: 1,
          }}
          onClick={backFunction}
        >
          {backButtonName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
