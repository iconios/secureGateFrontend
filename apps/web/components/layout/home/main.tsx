"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Paper,
  Grid,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoIcon from "@mui/icons-material/Info";
import { Controller, useForm } from "react-hook-form";
import {
  CreateManagerData,
  CreateManagerPayload,
  CreateManagerSchema,
} from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CreateManagerService } from "@shared/services/manager";
import { showToast } from "../../../utils/toast";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function RegistrationForm() {
  const router = useRouter();

  // Initialize react-hook-form
  const { handleSubmit, control, getValues } = useForm<CreateManagerData>({
    resolver: zodResolver(CreateManagerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      terms: false,
    },
    mode: "onBlur",
  });

  // React query mutation for form submission
  const mutation = useMutation({
    mutationFn: async (data: CreateManagerPayload) => {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
      }

      return CreateManagerService(data, {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      });
    },
    onError: (error) => {
      console.error("Error creating manager account:", error);
      showToast.error(
        error.message ?? "Failed to create manager account. Please try again.",
      );
    },
    onSuccess: () => {
      console.log("Manager account created successfully");
      showToast.success(
        "Manager account created successfully! Please check your email for verification.",
      );
      router.push(
        `/verification?email=${encodeURIComponent(getValues("email"))}`,
      );
    },
  });

  // Form submit handler with custom async backend error flashing
  const onSubmit = async (data: CreateManagerData) => {
    try {
      // Call the backend API to create the manager account
      const payload: CreateManagerPayload = {
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        password: data.password,
      };
      mutation.mutate(payload);
    } catch (error: any) {
      // Handle any unexpected errors
      console.error("Unexpected error:", error);
      showToast.error(
        error.message ?? "An unexpected error occurred. Please try again.",
      );
    }
  };

  // For the stepper component
  const steps = ["Account", "Verify", "Log in"];
  const activeStep = 0; // Set to 0 for first step, 1 for second, etc.

  return (
    <Box
      component="section"
      sx={{
        gridColumn: { xs: "span 12", lg: "span 7" },
        p: { xs: 3, md: 6, lg: 10 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "600px" }}>
        {/* Stepper / Progress Indicator */}
        <Box sx={{ mb: 6 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepConnector-root": {
                top: 20,
              },
              "& .MuiStepIcon-root": {
                width: 40,
                height: 40,
                fontSize: "1.5rem",
              },
              "& .MuiStepIcon-root.Mui-active": {
                color: "primary.main",
              },
              "& .MuiStepIcon-root.Mui-completed": {
                color: "primary.main",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Card */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow:
              "0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                fontSize: { xs: "1.875rem", md: "2.25rem" },
              }}
            >
              Get started
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              First step: Set up your administrative credentials.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Full Name Field */}
            <Controller
              name="full_name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full name"
                  placeholder="e.g. Adebayo Tinubu"
                  variant="outlined"
                  size="medium"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? ""}
                />
              )}
            />

            {/* Email and Phone Grid */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email address"
                      placeholder="manager@estate.ng"
                      type="email"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message ?? ""}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone number"
                      placeholder="803 123 4567"
                      type="tel"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message ?? ""}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  px: 1,
                                  bgcolor: "action.hover",
                                  borderRight: "1px solid",
                                  borderColor: "divider",
                                  mr: 1,
                                }}
                              >
                                +234
                              </Box>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error?.message ?? (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <InfoIcon sx={{ fontSize: 14 }} />
                        <span>
                          Use at least 8 characters with a mix of symbols.
                        </span>
                      </Typography>
                    )
                  }
                />
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirm_password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm password"
                  placeholder="••••••••"
                  type="password"
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? ""}
                />
              )}
            />

            {/* Terms Checkbox */}
            <Controller
              name="terms"
              control={control}
              render={({ field, fieldState }) => (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        slotProps={{
                          root: {
                            ref: field.ref,
                          },
                        }}
                        sx={{
                          "&.Mui-checked": {
                            color: "primary.main",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I agree to the{" "}
                        <Link
                          href="#"
                          sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                          underline="hover"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                          underline="hover"
                        >
                          Privacy Policy
                        </Link>{" "}
                        regarding Nigerian data protection laws.
                      </Typography>
                    }
                  />

                  {fieldState.error && (
                    <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={mutation.isPending}
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                bgcolor: "#f57c00", // brand-orange color
                fontWeight: "bold",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "#ef6c00",
                  opacity: 0.9,
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {mutation.isPending
                ? "Creating Account..."
                : "Create manager account"}
            </Button>
          </Box>

          {/* Login Link */}
          <Box sx={{ mt: 4, pt: 3, textAlign: "center" }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={NextLink}
                href="/login"
                sx={{
                  color: "primary.main",
                  fontWeight: "extrabold",
                  textDecoration: "underline",
                  ml: 0.5,
                }}
                underline="hover"
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Footer Text */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 4,
            opacity: 0.4,
            filter: "grayscale(100%)",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "-0.025em",
            }}
          >
            Powered by Nerdy Web Consults
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
