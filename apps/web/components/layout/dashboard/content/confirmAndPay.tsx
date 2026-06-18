"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowBackOutlined,
  ArrowForwardOutlined,
  BusinessOutlined,
  CheckCircleOutlined,
  Error,
  HomeWorkOutlined,
  LockOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../../lib/store";
import { showToast } from "../../../../utils/toast";
import { ConfirmAndPayResult } from "./estate.types";

type ConfirmAndPayProps = {
  prevStepHandler: () => void;
};

function CardShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        p: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {children}
    </Paper>
  );
}

function IconFrame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Box
      sx={(theme) => ({
        width: 44,
        height: 44,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: "text.primary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      })}
    >
      {children}
    </Box>
  );
}

function CardTitle({
  icon,
  title,
  subtitle,
}: Readonly<{
  icon: ReactNode;
  title: string;
  subtitle: string;
}>) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        mb: { xs: 2, md: 2.5 },
        alignItems: "flex-start",
      }}
    >
      <IconFrame>{icon}</IconFrame>
      <Box>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 18, md: 22 },
            lineHeight: 1.15,
            fontWeight: 800,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            fontSize: { xs: 13, md: 14 },
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

function DetailItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | number | ReactNode;
}>) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 12,
          letterSpacing: 0.8,
          fontWeight: 800,
          color: "text.secondary",
          textTransform: "uppercase",
          mb: 0.6,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 15, md: 16 },
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.4,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StatusPill({ label }: Readonly<{ label: string }>) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        px: 1.25,
        py: 0.7,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.18),
      })}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "primary.main",
        }}
      />
      <Typography sx={{ color: "primary.main", fontSize: 13, fontWeight: 800 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function HighlightPanel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.primary.main, 0.06),
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.14),
        p: { xs: 1.75, md: 2 },
      })}
    >
      {children}
    </Box>
  );
}

function AccessRow({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: "flex-start",
      }}
    >
      <CheckCircleOutlined
        sx={{ color: "primary.main", fontSize: 22, mt: 0.15 }}
      />
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 15, md: 16 },
            fontWeight: 800,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 13, md: 14 },
            color: "text.secondary",
            mt: 0.25,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

function SummaryRow({
  label,
  value,
  subLabel,
}: Readonly<{
  label: string;
  value: string;
  subLabel?: string;
}>) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mb: 2, justifyContent: "space-between" }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: { xs: 14, md: 16 },
          lineHeight: 1.45,
        }}
      >
        {label}
        {subLabel ? (
          <Box component="span" sx={{ display: "block" }}>
            {subLabel}
          </Box>
        ) : null}
      </Typography>
      <Typography
        sx={{
          color: "text.primary",
          fontSize: { xs: 14, md: 16 },
          fontWeight: 800,
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

const EstateConfirmAndPay = ({ prevStepHandler }: ConfirmAndPayProps) => {
  const [loading, setLoading] = useState(false);
  const currency = "\u20A6";
  const estate = useSelector((state: RootState) => state.estate);
  const {
    name,
    location,
    stateRegion,
    households,
    period,
    plan,
    amount,
    logoUrl,
    planId,
  } = estate;

  const billingSuffix = period === "monthly" ? "/mo" : "/yr";
  const formattedAmount = `${currency}${amount.toLocaleString()}`;
  const formattedLocation = [location, stateRegion].filter(Boolean).join(", ");

  const handleCheckout = async () => {
    try {
      // Set Loading
      setLoading(true);

      // Call the api and pass data to it
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          period,
          name,
          logo_url: logoUrl,
          location,
          state: stateRegion,
        }),
      });

      console.log("Response from backend", response);
      const result: ConfirmAndPayResult = await response.json();
      console.log("Result from backend response", response);

      if (!result.success) {
        return (
          <Alert severity="error" variant="filled">
            <AlertTitle>Error</AlertTitle>
            result.message
          </Alert>
        );
      }

      // Backend returns Paystack's authorization_url
      const authorizationUrl = result.data?.authorization_url;
      console.log("Authorization url", authorizationUrl);
      window.location.href = result.data?.authorization_url ?? "";
    } catch (error: any) {
      return (
        <Alert severity="error" variant="filled">
          <AlertTitle>Error</AlertTitle>
          {error.message ?? "Something went wrong"}
        </Alert>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "background.default",
        pb: { xs: 14, md: 12 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1160,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 3 },
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "68%" } }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, md: 34 },
                lineHeight: 1.1,
                fontWeight: 900,
                color: "text.primary",
                mb: 1.5,
              }}
            >
              Confirm & Pay
            </Typography>
            <Typography
              sx={{
                maxWidth: 720,
                fontSize: { xs: 15, md: 18 },
                lineHeight: 1.55,
                color: "text.secondary",
                mb: { xs: 3, md: 3.5 },
              }}
            >
              Review your estate setup and billing details before continuing to
              secure checkout.
            </Typography>

            <Stack spacing={{ xs: 2, md: 2.5 }}>
              <CardShell>
                <CardTitle
                  icon={<BusinessOutlined fontSize="small" />}
                  title="Estate Profile"
                  subtitle="Confirm the estate identity before payment"
                />

                <Stack spacing={{ xs: 2, md: 2.25 }}>
                  <HighlightPanel>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1.5, sm: 2 }}
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            letterSpacing: 0.8,
                            fontWeight: 800,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            mb: 0.7,
                          }}
                        >
                          Estate Name
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: 18, md: 20 },
                            fontWeight: 900,
                            color: "text.primary",
                            lineHeight: 1.25,
                          }}
                        >
                          {name || "Estate name not provided"}
                        </Typography>
                      </Box>
                      <StatusPill label="Ready for activation" />
                    </Stack>
                  </HighlightPanel>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1.3fr 0.7fr" },
                      gap: { xs: 2, sm: 4 },
                    }}
                  >
                    <DetailItem
                      label="Location"
                      value={formattedLocation || "Location not provided"}
                    />
                    <DetailItem
                      label="Activation Status"
                      value="Starts after successful payment"
                    />
                  </Box>
                </Stack>
              </CardShell>

              <CardShell>
                <CardTitle
                  icon={<HomeWorkOutlined fontSize="small" />}
                  title="Plan Details"
                  subtitle="Confirm the selected subscription package"
                />

                <Stack spacing={{ xs: 2, md: 2.25 }}>
                  <HighlightPanel>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1.5, sm: 2 }}
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            letterSpacing: 0.8,
                            fontWeight: 800,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            mb: 0.7,
                          }}
                        >
                          Selected Plan
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: 18, md: 20 },
                            fontWeight: 900,
                            color: "text.primary",
                            lineHeight: 1.25,
                          }}
                        >
                          {plan || "Plan not selected"}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: { xs: 22, md: 24 },
                          fontWeight: 900,
                          color: "text.primary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedAmount}
                        <Box
                          component="span"
                          sx={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: "text.primary",
                          }}
                        >
                          {billingSuffix}
                        </Box>
                      </Typography>
                    </Stack>
                  </HighlightPanel>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: { xs: 2, sm: 4 },
                    }}
                  >
                    <DetailItem
                      label="Household Limit"
                      value={`${households} households`}
                    />
                    <DetailItem label="Billing Cycle" value={period} />
                    <DetailItem
                      label="Upgrade Flexibility"
                      value="Additional households can be added later when desired"
                    />
                    <DetailItem
                      label="Payment Due"
                      value="Today, before activation"
                    />
                  </Box>
                </Stack>
              </CardShell>

              <CardShell>
                <CardTitle
                  icon={<VpnKeyOutlined fontSize="small" />}
                  title="Access Setup"
                  subtitle="Security options enabled for this estate"
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: { xs: 2, sm: 2.5 },
                  }}
                >
                  <AccessRow
                    title="Visitor gate pass"
                    description="Visitor passes are enabled for secure entry management."
                  />
                  <AccessRow
                    title="Resident verification"
                    description="Resident verification is enabled before full activation."
                  />
                  <AccessRow
                    title="Vehicle access tracking"
                    description="Vehicle access tracking is included in this setup."
                  />
                </Box>
              </CardShell>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "32%" } }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 22, md: 24 },
                  fontWeight: 900,
                  color: "text.primary",
                  mb: 2.5,
                }}
              >
                Order Summary
              </Typography>

              <SummaryRow label="Selected Plan" value={formattedAmount} />
              <SummaryRow
                label="Household Limit"
                subLabel={`(${households} households)`}
                value="Included"
              />
              <SummaryRow label="Billing Cycle" value={period} />

              <Divider sx={{ my: 2.5 }} />

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mb: { xs: 2.5, md: 3 },
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "text.secondary",
                  }}
                >
                  Total Due Today
                </Typography>
                <Typography
                  sx={{ fontSize: 24, fontWeight: 900, color: "text.primary" }}
                >
                  {formattedAmount}
                  <Box component="span" sx={{ fontSize: 17, fontWeight: 800 }}>
                    {billingSuffix}
                  </Box>
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
                onClick={handleCheckout}
                disabled={loading}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  minHeight: 72,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: 18,
                  lineHeight: 1.35,
                  fontWeight: 900,
                  boxShadow: 2,
                  mb: 2,
                }}
              >
                Proceed to Secure Checkout
              </Button>

              <Box
                sx={(theme) => ({
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.18),
                  p: 1.5,
                })}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <LockOutlined
                    sx={{ color: "primary.main", fontSize: 20, mt: 0.1 }}
                  />
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.45,
                      color: "text.secondary",
                    }}
                  >
                    Secure checkout. Encrypted payment processing. You can
                    upgrade or cancel anytime.
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          position: "fixed",
          left: { xs: 0, md: "var(--setup-sidebar-width, 300px)" },
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1.5, md: 3 }}
          sx={{
            maxWidth: 1160,
            mx: "auto",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={prevStepHandler}
            startIcon={<ArrowBackOutlined />}
            sx={{
              minWidth: { xs: 52, sm: 160 },
              height: { xs: 48, md: 50 },
              borderColor: "text.secondary",
              color: "text.primary",
              textTransform: "none",
              fontWeight: 800,
              lineHeight: 1.1,
              px: { xs: 1.5, sm: 3 },
              "& .MuiButton-startIcon": {
                mr: { xs: 0, sm: 1 },
              },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Back
            </Box>
          </Button>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              textAlign: "center",
              minWidth: 170,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                letterSpacing: 1,
                fontWeight: 900,
                color: "text.secondary",
                textTransform: "uppercase",
              }}
            >
              {period === "monthly" ? "Monthly" : "Yearly"} Total
            </Typography>
            <Typography
              sx={{ fontSize: 22, fontWeight: 900, color: "text.primary" }}
            >
              {formattedAmount}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForwardOutlined />}
            onClick={handleCheckout}
            disabled={loading}
            sx={{
              flex: { xs: 1, sm: "0 1 420px" },
              height: { xs: 54, md: 62 },
              borderRadius: 1.5,
              textTransform: "none",
              fontSize: { xs: 16, md: 20 },
              fontWeight: 900,
              color: "primary.contrastText",
              boxShadow: 2,
            }}
          >
            Proceed to Secure Checkout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default EstateConfirmAndPay;
