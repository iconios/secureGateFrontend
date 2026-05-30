"use client";

import {
  MenuItem,
  Box,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Button,
  Icon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { getAllStates } from "ng-locations";
import { CheckOutlined, Forward, InfoOutlined } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

const estateCreationSteps = [
  "Fill estate details",
  "Review & submit",
  "Select household-limit plan",
  "Make payment",
  "Estate created",
];
const allNigerianStates = getAllStates();

const EstateForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      location: "",
      state: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleNextPage = () =>
    setActiveStep((prev) => {
      const next = prev + 1;
      if (next <= estateCreationSteps.length - 1) {
        return next;
      }
      return 0;
    });

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 5 },
        minHeight: "60vh",
      }}
    >
      {/* Estate Creation Steps UI */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 3,
          display: { xs: "none", md: "flex" },
        }}
      >
        {estateCreationSteps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Paper
          elevation={1}
          sx={{
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 2 },
            width: { xs: "100%", md: "66%" },
          }}
          component="form"
        >
          {/* Heading */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            Create Estate Profile
          </Typography>
          {/* Subheading */}
          <Typography
            component="p"
            sx={{
              fontSize: { xs: 10, md: 12 },
              pb: { xs: 2, md: 3 },
            }}
          >
            Please provide the fundamental details of your community to begin
            setup.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{
              height: 120,
              width: 120,
              mb: { xs: 2, md: 3 },
            }}
          >
            Upload Estate Logo <input hidden type="file" accept="image/*" />
          </Button>
          <TextField
            label="Estate Name"
            placeholder="e.g. Sapphire Gardens Residence"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              mb: { xs: 2, md: 3 },
            }}
          />
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1}
            sx={{
              mb: { xs: 2, md: 3 },
            }}
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location / Address"
                  placeholder="Street name or Area"
                  variant="outlined"
                  size="small"
                  sx={{
                    flexGrow: 1,
                  }}
                />
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="State / Region"
                  defaultValue="Lagos"
                  size="small"
                  helperText="Please select your community's state"
                >
                  {allNigerianStates.map((state) => (
                    <MenuItem key={state.id} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
              }}
              endIcon={<Forward />}
              onClick={handleNextPage}
            >
              Continue
            </Button>
          </Box>
        </Paper>

        {/* Setup Guide UI */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            p: 3,
            borderRadius: 1,
            border: "1px solid grey",
            mb: 2,
            width: "33%",
          }}
        >
          <InfoOutlined />
          <Typography
            sx={{
              fontSize: { xs: 20, md: 28 },
              fontWeight: 600,
              color: "grey",
              mb: 2,
            }}
          >
            Setup Guide
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              mb: 3,
            }}
          >
            You are creating a gated estate/community profile. This will help
            you manage households, residents, vehicles, and guests with
            enterprise-grade precision.
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.5,
            }}
          >
            <CheckOutlined
              sx={{
                color: "green",
              }}
            />
            <Typography
              component="p"
              sx={{
                fontSize: { xs: 10, md: 12 },
              }}
            >
              Define legal entity name for official documents.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Icon>
              <CheckOutlined
                sx={{
                  color: "green",
                }}
              />
            </Icon>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: 10, md: 12 },
              }}
            >
              Localized settings for state-specific compliance.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default EstateForm;
