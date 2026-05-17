"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useRef, useState } from "react";
import { VerificationCodeFormData, VerificationCodeSchema } from "./types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VerificationForm({
  email = "manager@example.com",
}: {
  email: string;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // For the stepper component
  const steps = ["Account", "Verify", "Log in"];
  const activeStep = 1; // Set to 0 for first step, 1 for second, etc.

  // Initialize the necessary state variables for the form
  const INITIAL_TIME = 1800; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedExpiry = localStorage.getItem("verificationExpiry");
    if (savedExpiry) {
      const expiryTime = Number.parseInt(savedExpiry, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(expiryTime - currentTime, 0);
    }
    return INITIAL_TIME;
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<VerificationCodeFormData>({
    resolver: zodResolver(VerificationCodeSchema),
    defaultValues: {
      code: ["", "", "", "", "", ""],
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem("verificationExpiry");
      return;
    }

    if (!localStorage.getItem("verificationExpiry")) {
      localStorage.setItem(
        "verificationExpiry",
        (Date.now() + timeLeft * 1000).toString(),
      );
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("verificationExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Form submit handler with custom async backend error flashing
  const onSubmit = async (data: VerificationCodeFormData) => {
    clearErrors("code");
    const fullCode = data.code.join("");

    // try {
    //   const response = await VerifyCodeService(fullCode);
    //   if (!response.success) {
    //       const errorData = await response.json();
    //       setError("code", { message: errorData.message || "Invalid code" });
    //   } else {
    //       // Handle successful verification (e.g., redirect to dashboard)
    //   }
    // } catch {}
  };

  const handleCodeResend = () => {
    // Reset timer back to 30 minutes and clear any existing code errors
    localStorage.removeItem("verificationExpiry");
    setTimeLeft(INITIAL_TIME);
    clearErrors("code");
    setValue("code", ["", "", "", "", "", ""]);
  };

  // Format seconds into MM:SS format for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Keyboard navigation wrappers
  const handleInputChange = (
    index: number,
    value: string,
    onChange: (...event: any[]) => void,
  ) => {
    // Implementation for handling input changes with keyboard navigation
    if (value && !/^[a-zA-Z0-9]$/.test(value)) {
      return; // Ignore non-alphanumeric input
    }
    onChange(value);
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (event.key === "Backspace" && !value && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      prevInput?.focus();
    }

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
                Enter verification code
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                We have created your secureGate manager account. To finalize
                your access, we have sent a 6-digit alphanumeric code to:{" "}
                <strong>{email}</strong>
              </Typography>
            </Box>

            {/* Textfields for code */}
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Controller
                  key={index}
                  name={`code.${index}` as const}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      error={!!errors.code?.[index] || !!errors.code?.message}
                      slotProps={{
                        htmlInput: {
                          maxLength: 1,
                          style: {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            padding: "10px 0",
                          },
                        },
                      }}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value, field.onChange)
                      }
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(index, e, field.value)
                      }
                    />
                  )}
                />
              ))}
            </Box>

            {/* Countdown timer and resend link */}
            <Box sx={{ mb: 3 }}>
              {timeLeft > 0 ? (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Code expires in: {formatTime(timeLeft)}
                </Typography>
              ) : (
                <Button variant="text" onClick={handleCodeResend} size="small">
                  Resend Code
                </Button>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              endIcon={<ArrowForwardIcon />}
              onClick={handleSubmit(onSubmit)}
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
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  };
}
