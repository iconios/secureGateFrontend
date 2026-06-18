"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Shield,
} from "@mui/icons-material";
import { LoginManagerData, LoginManagerSchema } from "./types";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import ArrowForward from "@mui/icons-material/ArrowForward";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authActions } from "../../../lib/features/auth/authSlice";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);

  // For the stepper component
  const steps = ["Account", "Verify", "Log in"];
  const activeStep = 2;

  // Initialize the necessary state variables for the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginManagerData>({
    resolver: zodResolver(LoginManagerSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: rememberMe,
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  // React query mutation for verifying credentials
  const mutation = useMutation({
    mutationFn: async (data: LoginManagerData) => {
      dispatch(authActions.loginStart());

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          rememberMe,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to verify credentials");
      }

      return result.data;
    },

    onError: (error) => {
      console.error("Error verifying credentials:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid credentials. Please try again.";

      dispatch(authActions.loginFailure({ error: { message: errorMessage } }));
      showToast.error(errorMessage);
    },

    onSuccess: (userData) => {
      dispatch(authActions.loginSuccess(userData));

      showToast.success(
        "Credentials verified successfully! Redirecting to dashboard...",
      );

      setTimeout(() => {
        router.replace("/dashboard");
      }, 3000);
    },
  });

  // Form submit handler with custom async backend error flashing
  const onSubmit = async (data: LoginManagerData) => {
    clearErrors();
    mutation.mutate(data);
  };

  return (
    <Box>
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
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Access your residential management dashboard
              </Typography>
            </Box>

            {/* Error Message view */}
            <Box>
              {Object.keys(errors).length > 0 && (
                <Box
                  sx={{
                    bgcolor: "error.light",
                    border: "1px solid",
                    borderColor: "error.main",
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "error.main" }}>
                    {Object.values(errors)[0]?.message}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Form Fields */}
            <Box
              sx={{ mb: 3, display: "flex", flexDirection: "column" }}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    id="email"
                    placeholder="manager@securegate.com"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.default",
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    component="label"
                    htmlFor="password"
                  >
                    Password
                  </Typography>
                  <MuiLink
                    href="/forgot-password"
                    component={NextLink}
                    passHref
                    style={{ color: "primary.light", textDecoration: "none" }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>

                <Controller
                  control={control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      id="password"
                      placeholder="••••••••"
                      {...field}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((show) => !show)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? (
                                  <VisibilityOff
                                    sx={{ color: "text.secondary" }}
                                  />
                                ) : (
                                  <Visibility
                                    sx={{ color: "text.secondary" }}
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "background.default",
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          setRememberMe(e.target.checked);
                        }}
                        sx={{
                          color: "divider",
                          "&.Mui-checked": { color: "primary.main" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Remember this device for 30 days
                      </Typography>
                    }
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={mutation.isPending}
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
                {mutation.isPending ? "Logging in..." : "Log in"}
              </Button>

              {/* Additional Links */}
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  New to the platform?
                </Typography>

                <MuiLink
                  component={NextLink}
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                  }}
                >
                  Create manager account
                  <ArrowForward sx={{ fontSize: "1rem" }} />
                </MuiLink>
              </Box>
            </Box>
          </Paper>

          {/* Security Footer Message */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <VerifiedUser sx={{ fontSize: "0.875rem" }} />
              Institutional-grade 256-bit encryption active
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: "100%",
          py: 4,
          px: { xs: 3, md: 6 },
          bgcolor: "grey.50",
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              size={{ xs: 12, md: "auto" }}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: "primary.main",
                  borderRadius: 1.5,
                  display: "inline-flex",
                }}
              >
                <Shield sx={{ color: "common.white" }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  SecureGate Infrastructure
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Protected by global security standards
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: "auto" }} sx={{ mt: { xs: 2, md: 0 } }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                <MuiLink
                  href="#"
                  component={NextLink}
                  passHref
                  color="text.secondary"
                  style={{ textDecoration: "none" }}
                >
                  Security Policy
                </MuiLink>
                <MuiLink
                  href="#"
                  component={NextLink}
                  passHref
                  color="text.secondary"
                  style={{ textDecoration: "none" }}
                >
                  Terms of Service
                </MuiLink>
                <MuiLink
                  href="#"
                  component={NextLink}
                  passHref
                  color="text.secondary"
                  style={{ textDecoration: "none" }}
                >
                  Contact Support
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
