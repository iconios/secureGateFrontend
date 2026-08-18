import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { EditHouseholdSuccessData, OpenHandleProps } from "./types";
import {
  ArrowBack,
  Check,
  Close,
  HouseOutlined,
  PeopleOutlineOutlined,
  Person2Outlined,
} from "@mui/icons-material";
import { ReactNode } from "react";

const SummaryItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        backgroundColor: "#E8E8E8",
        minHeight: { md: "100px" },
      }}
    >
      <Stack direction="row" spacing={1}>
        {icon}
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 13, md: 16 },
            fontWeight: 500,
            textTransform: "uppercase",
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        sx={{
          color: "text.primary",
          fontSize: { xs: 12, md: 14 },
          fontWeight: 500,
          textAlign: { xs: "left", md: "center" },
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
};

export const EditHouseholdSuccess = ({
  open,
  setOpen,
  subTitle,
  backButtonName,
  backFunction,
  unitDetails,
  principalFullName,
  totalResidents,
}: OpenHandleProps & EditHouseholdSuccessData) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          paddingBlock: 2,
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
          onClick={() => setOpen(false)}
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
          Household Updated Successfully
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 13, md: 16 },
            textAlign: "center",
          }}
        >
          {subTitle}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 2,
        }}
      >
        <Typography
          sx={{
            color: "text.primary",
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: 13, md: 16 },
          }}
        >
          Change Summary
        </Typography>
        <Grid
          container
          sx={{
            gap: 1,
          }}
        >
          <Grid size={{ xs: 12, md: 3.5 }}>
            <SummaryItem
              icon={
                <HouseOutlined
                  sx={{
                    color: "#3B3B3B",
                    fontSize: { xs: 22, md: 24 },
                  }}
                />
              }
              label="Unit"
              value={unitDetails}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryItem
              icon={
                <Person2Outlined
                  sx={{
                    color: "#3B3B3B",
                    fontSize: { xs: 22, md: 24 },
                  }}
                />
              }
              label="Principal Resident"
              value={principalFullName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryItem
              icon={
                <PeopleOutlineOutlined
                  sx={{
                    color: "#3B3B3B",
                    fontSize: { xs: 22, md: 24 },
                  }}
                />
              }
              label="Total Residents"
              value={totalResidents}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#E8E8E8",
          padding: 2,
        }}
      >
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
