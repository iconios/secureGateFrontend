"use client";

import {
  ArrowForwardOutlined,
  ChevronRightOutlined,
  ContentCopyOutlined,
  DashboardOutlined,
  DownloadOutlined,
  PersonAddAlt1Outlined,
  SecurityOutlined,
  ShieldOutlined,
  ViewListOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { showToast } from "../../../utils/toast";
import useAuthCheck from "../../../hooks/useAuthCheck";
import { useRouter } from "next/navigation";

type PaymentStatusProps = {
  estateName?: string;
  subscription?: string;
  amountPaid?: string;
  transactionId?: string;
  onDownloadReceipt?: () => void;
  onViewSubscription?: () => void;
};

const nextSteps = [
  {
    title: "Open Estate Dashboard",
    subtitle: "Access your command center for all estate operations.",
    icon: <DashboardOutlined />,
    onClick: () => {
      window.location.href = "/dashboard";
    },
  },
  {
    title: "Register Principal Residents",
    subtitle: "Start onboarding household heads and verified occupants.",
    icon: <PersonAddAlt1Outlined />,
    onClick: () => {
      window.location.href = "/residents";
    },
  },
  {
    title: "Set Up Security Guards",
    subtitle: "Configure gate access points and assign guard credentials.",
    icon: <ShieldOutlined />,
    onClick: () => {
      window.location.href = "/guards";
    },
  },
];

const DetailLabel = ({
  label,
  value,
  valueColor,
  large,
  rightSlot,
}: {
  label: string;
  value: string;
  valueColor?: string;
  large?: boolean;
  rightSlot?: React.ReactNode;
}) => {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            sx={{
              mb: 0.8,
              color: "#6B7280",
              fontSize: { xs: 10, sm: 11 },
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>

          <Typography
            sx={{
              color: valueColor || "#111827",
              fontSize: large ? { xs: 18, sm: 20 } : { xs: 14, sm: 15 },
              fontWeight: large ? 700 : 600,
              lineHeight: 1.35,
            }}
          >
            {value}
          </Typography>
        </Box>

        {rightSlot}
      </Stack>
    </Box>
  );
};

const PaymentInfoCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.8, sm: 2 },
        border: "1px solid #D1D5DB",
        borderRadius: 1.5,
        bgcolor: "#F9FAFB",
        minHeight: { xs: "auto", sm: 142 },
      }}
    >
      {children}
    </Paper>
  );
};

const NextStepCard = ({
  title,
  subtitle,
  icon,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Paper
      elevation={0}
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        mb: 1.4,
        border: "1px solid #D1D5DB",
        borderRadius: 1.5,
        bgcolor: "#F9FAFB",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#F3F4F6",
          borderColor: "#9CA3AF",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.8}
        sx={{
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 38, sm: 46 },
            height: { xs: 38, sm: 46 },
            borderRadius: 1,
            bgcolor: "#1F2544",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            "& svg": {
              fontSize: { xs: 22, sm: 25 },
            },
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: "#111827",
              fontSize: { xs: 14, sm: 15 },
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              color: "#6B7280",
              fontSize: { xs: 12, sm: 13 },
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <ChevronRightOutlined
          sx={{
            color: "#6B7280",
            flexShrink: 0,
          }}
        />
      </Stack>
    </Paper>
  );
};

const PaymentSuccess = ({
  estateName,
  subscription,
  amountPaid,
  transactionId,
  onDownloadReceipt,
  onViewSubscription,
}: PaymentStatusProps) => {
  // Validate authentication and handle navigations
  useAuthCheck();
  const router = useRouter();
  const onGoToDashboard = () => {
    router.replace("/dashboard");
  };

  // Create a handler for copying transaction Id
  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(`${transactionId}`);
    } catch {
      showToast.error("Error copying transaction id");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 650,
          mx: "auto",
          px: { xs: 2.2, sm: 3.2 },
          py: { xs: 3, sm: 3.6 },
          borderRadius: 2,
          bgcolor: "#FFFFFF",
          border: "1px solid #D1D5DB",
          borderTop: "4px solid #137333",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 74, sm: 88 },
              height: { xs: 74, sm: 88 },
              mb: { xs: 2.2, sm: 2.7 },
              borderRadius: "50%",
              bgcolor: "#A7F3AC",
              border: "4px solid #7AD982",
              color: "#137333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldOutlined sx={{ fontSize: { xs: 36, sm: 42 } }} />
          </Box>

          <Typography
            component="h1"
            sx={{
              color: "#080B25",
              fontSize: { xs: 28, sm: 32 },
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Payment Successful
          </Typography>

          <Typography
            sx={{
              color: "#4B5563",
              fontSize: { xs: 14, sm: 15 },
              lineHeight: 1.5,
              maxWidth: 420,
              mb: { xs: 2.5, sm: 3 },
            }}
          >
            Your payment has been confirmed and your estate subscription is now
            active.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
            mb: 2.4,
          }}
        >
          <PaymentInfoCard>
            <Stack spacing={2}>
              <DetailLabel label="Estate" value={estateName ?? ""} large />
              <DetailLabel label="Subscription" value={subscription ?? ""} />
            </Stack>
          </PaymentInfoCard>

          <PaymentInfoCard>
            <Stack spacing={2}>
              <DetailLabel
                label="Amount Paid"
                value={amountPaid ?? ""}
                valueColor="#137333"
                large
                rightSlot={
                  <Chip
                    label="Successful"
                    size="small"
                    sx={{
                      bgcolor: "#A7F3AC",
                      color: "#137333",
                      fontWeight: 700,
                      borderRadius: 999,
                      height: 30,
                    }}
                  />
                }
              />

              <Box>
                <Typography
                  sx={{
                    mb: 0.6,
                    color: "#6B7280",
                    fontSize: { xs: 10, sm: 11 },
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Transaction ID
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#111827",
                      fontSize: { xs: 14, sm: 15 },
                      fontWeight: 600,
                    }}
                  >
                    {transactionId}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={copyTransactionId}
                    aria-label="Copy transaction ID"
                    sx={{ p: 0.4 }}
                  >
                    <ContentCopyOutlined sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </PaymentInfoCard>
        </Box>

        <Typography
          component="h2"
          sx={{
            color: "#111827",
            fontWeight: 700,
            fontSize: { xs: 18, sm: 20 },
            mb: 1.6,
          }}
        >
          Next Steps
        </Typography>

        {nextSteps.map((step) => (
          <NextStepCard
            key={step.title}
            title={step.title}
            subtitle={step.subtitle}
            icon={step.icon}
            onClick={step.onClick}
          />
        ))}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          sx={{
            mt: { xs: 2, sm: 1.8 },
          }}
        >
          <Button
            variant="contained"
            onClick={() => onGoToDashboard()}
            endIcon={<ArrowForwardOutlined />}
            sx={{
              minHeight: 48,
              px: 2.2,
              bgcolor: "#080B25",
              color: "#FFFFFF",
              borderRadius: 1,
              fontWeight: 800,
              textTransform: "none",
              flex: { xs: "unset", sm: "0 0 180px" },
              "&:hover": {
                bgcolor: "#111536",
              },
            }}
          >
            Go to Estate Dashboard
          </Button>

          <Button
            variant="outlined"
            onClick={onDownloadReceipt}
            startIcon={<DownloadOutlined />}
            sx={{
              minHeight: 48,
              px: 2.2,
              color: "#111827",
              borderColor: "#D1D5DB",
              borderRadius: 1,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#FFFFFF",
              "&:hover": {
                borderColor: "#9CA3AF",
                bgcolor: "#F9FAFB",
              },
            }}
          >
            Download Receipt
          </Button>

          <Button
            variant="text"
            onClick={onViewSubscription}
            startIcon={
              <ViewListOutlined
                sx={{ display: { xs: "inline-flex", sm: "none" } }}
              />
            }
            sx={{
              minHeight: 48,
              px: 1.5,
              color: "#111827",
              borderRadius: 1,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#F9FAFB",
              },
            }}
          >
            View Subscription Details
          </Button>
        </Stack>
      </Paper>

      <Box
        sx={{
          mt: { xs: 3, sm: 3.5 },
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          sx={{
            color: "#4B5563",
            fontSize: { xs: 13, sm: 14 },
            mb: { xs: 4, sm: 5 },
          }}
        >
          Need help?{" "}
          <Box
            component="span"
            sx={{
              color: "#111827",
              fontWeight: 800,
            }}
          >
            Contact Estate Support
          </Box>{" "}
          or visit our{" "}
          <Box
            component="span"
            sx={{
              color: "#111827",
              fontWeight: 800,
            }}
          >
            Help Center.
          </Box>
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SecurityOutlined sx={{ color: "#6B7280", fontSize: 20 }} />
          <Typography
            sx={{
              color: "#6B7280",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            SecureGate
          </Typography>
        </Stack>

        <Typography
          sx={{
            mt: 1,
            color: "#9CA3AF",
            fontSize: 12,
          }}
        >
          © {new Date().getFullYear()} SecureGate Management Systems. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
