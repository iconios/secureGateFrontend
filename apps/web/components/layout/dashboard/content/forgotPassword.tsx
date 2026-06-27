"use client";

// Forgot Password Component
/*
#Plan:
1. 
*/

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ForgotPasswordEmailSchema } from "./estate.types";
import {
  ArrowBackOutlined,
  ArrowForwardOutlined,
  EmailOutlined,
  GppGoodOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "../../../../utils/toast";

export const ForgotPassword = () => {
  const router = useRouter();
  const [mainPage, setMainPage] = useState<boolean>(true);
  const [submittedEmail, setSubmittedEmail] = useState<{ email: string }>({
    email: "",
  });

  // React Hook Form setup with Zod validation and React Redux integration
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(ForgotPasswordEmailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to process request");
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Request failed";
      showToast.error(message);
    },
    onSuccess: () => {
      reset({
        email: "",
      });
      setMainPage(false);
    },
  });

  const onSubmit = (data: { email: string }) => {
    console.log(data);
    setSubmittedEmail(data);
    mutate(data);
  };

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        px: { xs: 2, md: 0 },
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 6 },
          backgroundColor: "background.paper",
          mb: { xs: 2, md: 4 },
          width: { xs: "100%", md: "85%" },
          mx: "auto",
        }}
      >
        {mainPage ? (
          <>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 20, md: 28 },
                fontWeight: 700,
                color: "primary.main",
                textAlign: "center",
                mb: 1,
              }}
            >
              Forgot your password?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: 12, md: 16 },
                color: "text.secondary",
                mb: { xs: 4, md: 7 },
              }}
            >
              Enter the email linked to your SecureGate account and we will send
              you a secure reset link.
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder="name@example.com"
                    variant="outlined"
                    label="Email"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <EmailOutlined />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: { xs: 2, md: 3 },
                      borderRadius: 1,
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Box
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: { xs: "100%", md: "80%" },
                  alignItems: "center",
                  mx: "auto",
                }}
              >
                <Button
                  variant="contained"
                  disabled={isPending}
                  type="submit"
                  endIcon={<ArrowForwardOutlined />}
                  size="large"
                  sx={{
                    backgroundColor: "black",
                    color: "primary.contrastText",
                    mb: { xs: 4, md: 8 },
                    borderRadius: 1,
                    width: { xs: "100%", md: "90%" },
                    mx: "auto",
                  }}
                >
                  SEND RESET LINK
                </Button>

                <Button
                  variant="text"
                  startIcon={<ArrowBackOutlined />}
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Back to login
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                borderRadius: "50%",
                backgroundColor: "black",
                width: { xs: 40, md: 55 },
                height: { xs: 40, md: 55 },
                mb: { xs: 2, md: 4 },
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                mx: "auto",
              }}
            >
              <GppGoodOutlined
                fontSize="large"
                sx={{
                  color: "primary.contrastText",
                }}
              />
            </Box>
            <Box
              sx={{
                mb: { xs: 5, md: 8 },
                width: { xs: "100%", md: "80%" },
                mx: "auto",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "primary.main",
                  fontSize: { xs: 20, md: 28 },
                  fontWeight: 700,
                  textAlign: "center",
                  mb: 1,
                }}
              >
                Check your e-mailbox
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 12, md: 16 },
                  textAlign: "center",
                }}
              >
                If an account exists for this email, we have sent password reset
                instructions. Please check your inbox and spam folder.
              </Typography>
            </Box>
            <Box
              sx={{
                mb: { xs: 3, md: 6 },
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", md: "80%" },
                alignItems: "center",
                mx: "auto",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  router.replace("/login");
                }}
                sx={{
                  color: "primary.contrastText",
                  backgroundColor: "black",
                  mb: { xs: 2, md: 3 },
                  borderRadius: 1,
                  width: { xs: "100%", md: "90%" },
                }}
              >
                BACK TO LOGIN
              </Button>
              <Button
                variant="text"
                size="large"
                disabled={isPending || !submittedEmail.email}
                onClick={() => {
                  mutate(submittedEmail);
                }}
                sx={{
                  color: "primary.main",
                }}
              >
                RESEND LINK
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 16 },
                textAlign: "center",
              }}
            >
              For your security, the reset link will expire after a short time.
            </Typography>
          </>
        )}
      </Paper>
      <Box
        sx={{
          py: { xs: 1, md: 1.5 },
          width: "100%",
          mb: { xs: 4, md: 6 },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mx: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GppGoodOutlined
            sx={{
              color: "primary.main",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
            }}
          >
            <i>We will never ask for your password by email.</i>
          </Typography>
        </Stack>
      </Box>
      <Typography
        variant="body1"
        sx={{ fontSize: { xs: 12, md: 16 }, color: "text.secondary" }}
      >
        &copy; {new Date().getFullYear()} SecureGate. All rights reserved.
      </Typography>
    </Box>
  );
};
