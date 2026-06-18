"use client";

import {
  AutorenewOutlined,
  EmailOutlined,
  ErrorOutlineOutlined,
  LockOutlined,
  RefreshOutlined,
  ShieldOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import useAuthCheck from "../../../hooks/useAuthCheck";

type PaymentPendingProps = {
  estateName?: string;
  subscription?: string;
  transactionId?: string;
  amountPaid?: string;
  onCheckStatus?: () => void;
  onReturnToSubscription?: () => void;
  onContactSupport?: () => void;
};

const TopNav = () => {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        px: { xs: 2, md: 3 },
        borderBottom: "1px solid #D1D5DB",
        bgcolor: "#F5F7FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 2, md: 4 }}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#080B25",
            fontSize: { xs: 18, md: 21 },
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          SecureGate
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            display: { xs: "none", sm: "flex" },
          }}
        >
          <Typography
            sx={{
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Estate Overview
          </Typography>

          <Typography
            sx={{
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Reports
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            color: "#374151",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Help Center
        </Typography>

        <Avatar
          src="/avatar.png"
          alt="Estate manager"
          sx={{
            width: 34,
            height: 34,
            border: "1px solid #D1D5DB",
          }}
        />
      </Stack>
    </Box>
  );
};

const WarningBanner = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        px: { xs: 2, md: 2.5 },
        py: 2,
        borderRadius: 1.5,
        bgcolor: "#FFD9C8",
        border: "1px solid #FDBA74",
        display: "flex",
        alignItems: "center",
        gap: 1.8,
      }}
    >
      <ErrorOutlineOutlined
        sx={{
          color: "#8B2C13",
          fontSize: 22,
          flexShrink: 0,
        }}
      />

      <Typography
        sx={{
          color: "#7C2D12",
          fontSize: { xs: 13, md: 14 },
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        Please do not create another payment immediately unless this transaction
        fails.
      </Typography>
    </Paper>
  );
};

const StatusIcon = () => {
  return (
    <Box
      sx={{
        width: { xs: 92, md: 128 },
        height: { xs: 92, md: 128 },
        borderRadius: "50%",
        bgcolor: "#FFF1E8",
        color: "#EA580C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: { xs: 2.5, md: 3 },
      }}
    >
      <AccessTimeOutlined
        sx={{
          fontSize: { xs: 44, md: 58 },
          strokeWidth: 1.2,
        }}
      />
    </Box>
  );
};

const DetailRow = ({
  label,
  value,
  status,
}: {
  label: string;
  value?: string;
  status?: string;
}) => {
  return (
    <Box
      sx={{
        py: 2,
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#374151",
            fontSize: { xs: 13, md: 14 },
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>

        {status ? (
          <Box
            sx={{
              px: 1.2,
              py: 0.45,
              borderRadius: 999,
              bgcolor: "#FFE2D2",
              color: "#C2410C",
              fontSize: { xs: 11, md: 12 },
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#EA580C",
              }}
            />
            {status}
          </Box>
        ) : (
          <Typography
            sx={{
              color: "#080B25",
              fontSize: { xs: 13, md: 14 },
              fontWeight: 800,
              textAlign: "right",
            }}
          >
            {value}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

const PendingPaymentCard = ({
  estateName,
  subscription,
  transactionId,
  amountPaid,
  onCheckStatus,
  onReturnToSubscription,
  onContactSupport,
}: Required<PaymentPendingProps>) => {
  // Validate authentication
  useAuthCheck();
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #D1D5DB",
        borderRadius: 2,
        px: { xs: 2.5, md: 3.5 },
        py: { xs: 4, md: 5 },
        minHeight: { md: 650 },
      }}
    >
      <StatusIcon />

      <Box sx={{ textAlign: "center", maxWidth: 420, mx: "auto" }}>
        <Typography
          component="h1"
          sx={{
            color: "#080B25",
            fontSize: { xs: 30, md: 34 },
            fontWeight: 850,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            mb: 1.3,
          }}
        >
          Payment Pending
        </Typography>

        <Typography
          sx={{
            color: "#4B5563",
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.5,
            mb: { xs: 3.5, md: 4.5 },
          }}
        >
          We are still waiting for confirmation from the payment provider. Your
          security and transaction integrity are our priority.
        </Typography>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: { sm: 5 },
          mb: { xs: 3.5, md: 4.5 },
        }}
      >
        <Box>
          <DetailRow label="Estate" value={estateName} />
          <DetailRow label="Transaction ID" value={transactionId} />
          <DetailRow label="Status" status="Pending Verification" />
        </Box>

        <Box>
          <DetailRow label="Plan" value={subscription} />
          <DetailRow label="Amount" value={amountPaid} />
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              py: 2,
              borderBottom: "1px solid #E5E7EB",
            }}
          />
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.6}
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Button
          variant="contained"
          onClick={onCheckStatus}
          startIcon={<RefreshOutlined />}
          sx={{
            minHeight: 48,
            px: 3,
            bgcolor: "#080B25",
            color: "#FFFFFF",
            borderRadius: 1,
            fontWeight: 800,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#111536",
            },
          }}
        >
          Check Payment Status
        </Button>

        <Button
          variant="outlined"
          onClick={onReturnToSubscription}
          sx={{
            minHeight: 48,
            px: 3,
            color: "#080B25",
            borderColor: "#9CA3AF",
            borderRadius: 1,
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#FFFFFF",
            "&:hover": {
              borderColor: "#6B7280",
              bgcolor: "#F9FAFB",
            },
          }}
        >
          Return to Subscription Page
        </Button>

        <Button
          variant="text"
          onClick={onContactSupport}
          sx={{
            minHeight: 48,
            px: 3,
            color: "#080B25",
            borderRadius: 1,
            fontWeight: 800,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#F9FAFB",
            },
          }}
        >
          Contact Support
        </Button>
      </Stack>
    </Paper>
  );
};

const NextInfoItem = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          color: "#E5E7EB",
          display: "flex",
          pt: 0.2,
          "& svg": {
            fontSize: 22,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#A7AEC4",
          fontSize: { xs: 13, md: 14 },
          lineHeight: 1.45,
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

const WhatsNextCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        bgcolor: "#080B25",
        color: "#FFFFFF",
        boxShadow: "0 12px 28px rgba(8, 11, 37, 0.22)",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 22, md: 24 },
          fontWeight: 850,
          letterSpacing: "-0.03em",
          mb: 2.5,
        }}
      >
        What’s Next?
      </Typography>

      <Stack spacing={2.3}>
        <NextInfoItem
          icon={<ShieldOutlined />}
          title="Payment verification in progress by our financial gateway partners."
        />

        <NextInfoItem
          icon={<AutorenewOutlined />}
          title="We will update your subscription automatically once cleared."
        />

        <NextInfoItem
          icon={<EmailOutlined />}
          title="You will receive an automated receipt and confirmation email."
        />
      </Stack>
    </Paper>
  );
};

const SecureInfoCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.2, md: 2.5 },
        borderRadius: 2,
        bgcolor: "#F3F4F6",
        border: "1px solid #D1D5DB",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 1,
            bgcolor: "#FFFFFF",
            color: "#080B25",
            border: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LockOutlined />
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#111827",
              fontSize: 14,
              fontWeight: 850,
              mb: 0.3,
            }}
          >
            Encrypted & Secure
          </Typography>

          <Typography
            sx={{
              color: "#4B5563",
              fontSize: 12.5,
              lineHeight: 1.25,
            }}
          >
            All transactions are processed through banking-grade SSL encryption
            for your safety.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const SecurityImageCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: { xs: 180, md: 188 },
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        bgcolor: "#080B25",
        background:
          "linear-gradient(135deg, rgba(251,146,60,0.95) 0%, rgba(8,11,37,0.96) 48%, rgba(8,11,37,1) 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: { xs: -15, md: 10 },
          top: { xs: 30, md: 35 },
          width: { xs: 170, md: 200 },
          height: { xs: 95, md: 110 },
          borderRadius: 4,
          transform: "rotate(-18deg)",
          bgcolor: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockOutlined sx={{ color: "#CBD5E1", fontSize: 34 }} />
      </Box>

      <Typography
        sx={{
          position: "absolute",
          left: 24,
          bottom: 24,
          color: "#FFFFFF",
          fontSize: { xs: 14, md: 15 },
          fontWeight: 700,
          maxWidth: 280,
        }}
      >
        Protecting your financial peace of mind.
      </Typography>
    </Paper>
  );
};

const SidePanel = () => {
  return (
    <Stack spacing={2.5}>
      <WhatsNextCard />
      <SecureInfoCard />
      <SecurityImageCard />
    </Stack>
  );
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
        borderTop: "1px solid #D1D5DB",
        bgcolor: "#F5F7FA",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 3 }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "center", md: "center" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography
          sx={{
            color: "#080B25",
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          SecureGate
        </Typography>

        <Typography
          sx={{
            color: "#374151",
            fontSize: 13,
          }}
        >
          © {new Date().getFullYear()} SecureGate Management Systems. All rights
          reserved.
        </Typography>

        <Stack direction="row" spacing={3}>
          <Typography
            sx={{
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Contact Support
          </Typography>

          <Typography
            sx={{
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Terms of Service
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const PaymentPending = ({
  estateName,
  subscription,
  transactionId,
  amountPaid,
  onCheckStatus = () => {},
  onReturnToSubscription = () => {},
  onContactSupport = () => {},
}: PaymentPendingProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNav />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 3.5 },
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3.5 }}>
          <WarningBanner />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 2fr) minmax(320px, 0.95fr)",
              },
              gap: { xs: 2.5, lg: 3 },
              alignItems: "start",
            }}
          >
            <PendingPaymentCard
              estateName={estateName ?? ""}
              subscription={subscription ?? ""}
              transactionId={transactionId ?? ""}
              amountPaid={amountPaid ?? ""}
              onCheckStatus={onCheckStatus}
              onReturnToSubscription={onReturnToSubscription}
              onContactSupport={onContactSupport}
            />

            <SidePanel />
          </Box>
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default PaymentPending;
