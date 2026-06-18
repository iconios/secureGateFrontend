"use client";

import {
  CachedOutlined,
  CreditCardOutlined,
  ErrorOutlineOutlined,
  HelpOutlineOutlined,
  InfoOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import useAuthCheck from "../../../hooks/useAuthCheck";

type PaymentFailedProps = {
  estateName?: string;
  plan?: string;
  amount?: string;
  reason?: string;
  paymentReference?: string;
  onRetryPayment?: () => void;
  onChooseAnotherMethod?: () => void;
  onContactSupport?: () => void;
};

const paymentFailedDetails = {
  estateName: "Greenfield Estate",
  plan: "Annual Subscription",
  amount: "₦1,000,000",
  reason: "Card authentication failed",
  paymentReference: "SG-PAY-9X2K81",
};

const TopHeader = ({ reference }: { reference: string }) => {
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
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            bgcolor: "#080B25",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          S
        </Box>
        <Typography
          sx={{
            color: "#080B25",
            fontSize: { xs: 18, md: 20 },
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          SecureGate
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={{ xs: 2, md: 3 }}
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
          Reference: {reference}
        </Typography>

        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            alignItems: "center",
          }}
        >
          <HelpOutlineOutlined sx={{ color: "#374151", fontSize: 18 }} />
          <Typography
            sx={{
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Help Center
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const FailureIcon = () => {
  return (
    <Box
      sx={{
        width: { xs: 78, md: 92 },
        height: { xs: 78, md: 92 },
        borderRadius: "50%",
        bgcolor: "#FDE2E2",
        color: "#C81E1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: { xs: 2.5, md: 3 },
      }}
    >
      <ErrorOutlineOutlined
        sx={{
          fontSize: { xs: 38, md: 46 },
        }}
      />
    </Box>
  );
};

const InfoRow = ({
  label,
  value,
  danger,
  status,
}: {
  label: string;
  value?: string;
  danger?: boolean;
  status?: string;
}) => {
  return (
    <Box
      sx={{
        py: 1.8,
        borderBottom: "1px solid #D1D5DB",
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
          <Chip
            label={status}
            size="small"
            sx={{
              bgcolor: "#FDE2E2",
              color: "#C81E1E",
              fontWeight: 700,
              height: 24,
              borderRadius: 999,
            }}
          />
        ) : (
          <Typography
            sx={{
              color: danger ? "#C81E1E" : "#111827",
              fontSize: { xs: 13, md: 14 },
              fontWeight: 700,
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

const SupportNotice = ({ paymentReference }: { paymentReference: string }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: 1.5,
        bgcolor: "#FFF5F5",
        border: "1px solid #F5C2C7",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <InfoOutlined
          sx={{
            color: "#C81E1E",
            fontSize: 20,
            mt: 0.2,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            color: "#B42318",
            fontSize: { xs: 13, md: 14 },
            lineHeight: 1.5,
          }}
        >
          If you were debited, please contact support with your payment
          reference:{" "}
          <Box component="span" sx={{ fontWeight: 800 }}>
            {paymentReference}
          </Box>
        </Typography>
      </Stack>
    </Paper>
  );
};

const TransactionDetails = ({
  estateName,
  plan,
  amount,
  reason,
  paymentReference,
}: {
  estateName: string;
  plan: string;
  amount: string;
  reason: string;
  paymentReference: string;
}) => {
  return (
    <Box>
      <Typography
        sx={{
          color: "#111827",
          fontSize: 15,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          mb: 2.2,
        }}
      >
        Transaction Details
      </Typography>

      <InfoRow label="Estate Name" value={estateName} />
      <InfoRow label="Plan" value={plan} />
      <InfoRow label="Amount" value={amount} />
      <InfoRow label="Status" status="Failed" />
      <InfoRow label="Reason" value={reason} danger />
      <SupportNotice paymentReference={paymentReference} />
    </Box>
  );
};

const ResolveItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.8}
      sx={{
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: "#1F2544",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.2,
          "& svg": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#111827",
            fontSize: 14,
            fontWeight: 800,
            mb: 0.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#4B5563",
            fontSize: 13.5,
            lineHeight: 1.45,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

const ResolveSection = () => {
  return (
    <Box>
      <Typography
        sx={{
          color: "#111827",
          fontSize: 15,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          mb: 2.2,
        }}
      >
        How to Resolve This
      </Typography>

      <Stack spacing={4}>
        <ResolveItem
          icon={<CachedOutlined />}
          title="Confirm payment details"
          description="Ensure your card info and balance are correct before retrying."
        />

        <ResolveItem
          icon={<CreditCardOutlined />}
          title="Try another method"
          description="Use a different bank card or try direct bank transfer."
        />

        <ResolveItem
          icon={<SupportAgentOutlined />}
          title="Contact support"
          description="Reach out to our 24/7 team with your reference ID."
        />
      </Stack>
    </Box>
  );
};

const ActionBar = ({
  onRetryPayment,
  onChooseAnotherMethod,
  onContactSupport,
}: {
  onRetryPayment: () => void;
  onChooseAnotherMethod: () => void;
  onContactSupport: () => void;
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3.5 },
        py: { xs: 2, md: 2.4 },
        bgcolor: "#F9FAFB",
        borderTop: "1px solid #E5E7EB",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Button
          variant="contained"
          startIcon={<CachedOutlined />}
          onClick={onRetryPayment}
          sx={{
            minHeight: 48,
            px: 3,
            bgcolor: "#080B25",
            color: "#FFFFFF",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#111536",
            },
          }}
        >
          Retry Payment
        </Button>

        <Button
          variant="outlined"
          startIcon={<CreditCardOutlined />}
          onClick={onChooseAnotherMethod}
          sx={{
            minHeight: 48,
            px: 3,
            color: "#111827",
            borderColor: "#9CA3AF",
            bgcolor: "#FFFFFF",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#F9FAFB",
              borderColor: "#6B7280",
            },
          }}
        >
          Choose Another Payment Method
        </Button>

        <Button
          variant="text"
          onClick={onContactSupport}
          sx={{
            minHeight: 48,
            px: 3,
            color: "#111827",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#F3F4F6",
            },
          }}
        >
          Contact Support
        </Button>
      </Stack>
    </Box>
  );
};

const FailedCard = ({
  estateName,
  plan,
  amount,
  reason,
  paymentReference,
  onRetryPayment,
  onChooseAnotherMethod,
  onContactSupport,
}: Required<PaymentFailedProps>) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 670,
        mx: "auto",
        bgcolor: "#FFFFFF",
        border: "1px solid #D1D5DB",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, md: 5 },
          py: { xs: 4, md: 5 },
          textAlign: "center",
        }}
      >
        <FailureIcon />

        <Typography
          component="h1"
          sx={{
            color: "#080B25",
            fontSize: { xs: 30, md: 34 },
            fontWeight: 850,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            mb: 1.2,
          }}
        >
          Payment Failed
        </Typography>

        <Typography
          sx={{
            color: "#4B5563",
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.5,
            maxWidth: 420,
            mx: "auto",
          }}
        >
          We could not complete your payment. Your estate subscription has not
          been activated.
        </Typography>
      </Box>

      <Divider />

      <Box
        sx={{
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 5 },
          }}
        >
          <TransactionDetails
            estateName={estateName}
            plan={plan}
            amount={amount}
            reason={reason}
            paymentReference={paymentReference}
          />

          <ResolveSection />
        </Box>
      </Box>

      <ActionBar
        onRetryPayment={onRetryPayment}
        onChooseAnotherMethod={onChooseAnotherMethod}
        onContactSupport={onContactSupport}
      />
    </Paper>
  );
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        pt: 1.5,
        borderTop: "3px solid #C81E1E",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          px: 2,
          py: 4,
        }}
      >
        <Typography
          sx={{
            color: "#4B5563",
            fontSize: 13,
            mb: 2.5,
          }}
        >
          © {new Date().getFullYear()} SecureGate Management Systems. All rights
          reserved.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.2, sm: 3.5 }}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#111827",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Terms of Service
          </Typography>
          <Typography
            sx={{
              color: "#111827",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            sx={{
              color: "#111827",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Contact Support
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

const PaymentFailed = ({
  estateName,
  plan,
  amount,
  reason,
  paymentReference,
  onRetryPayment = () => {},
  onChooseAnotherMethod = () => {},
  onContactSupport = () => {},
}: PaymentFailedProps) => {
  // Validate authentication
  useAuthCheck();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopHeader reference={paymentReference ?? ""} />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 4 },
        }}
      >
        <FailedCard
          estateName={estateName ?? ""}
          plan={plan ?? ""}
          amount={amount ?? ""}
          reason={reason ?? ""}
          paymentReference={paymentReference ?? ""}
          onRetryPayment={onRetryPayment}
          onChooseAnotherMethod={onChooseAnotherMethod}
          onContactSupport={onContactSupport}
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default PaymentFailed;
