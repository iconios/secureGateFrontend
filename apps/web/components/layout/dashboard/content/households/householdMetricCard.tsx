import { Paper, Stack, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

type SecureGateMetricCardProps = {
  label: string;
  value: number | string;
  icon?: ReactNode;
  onClick?: () => void;
};

export const SecureGateMetricCard = ({
  label,
  value,
  icon,
  onClick,
}: SecureGateMetricCardProps) => {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        width: "100%",
        minHeight: { xs: 84, md: 92 },
        p: { xs: 2, md: 2.5 },
        borderRadius: "12px",
        border: "1px solid #D7DCE3",
        bgcolor: "#ffffff",
        cursor: onClick ? "pointer" : "default",
        transition: "0.2s ease",
        "&:hover": onClick
          ? {
              borderColor: "#005BD3",
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
            }
          : undefined,
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1.5, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        {icon && (
          <Box
            sx={{
              width: { xs: 40, md: 44 },
              height: { xs: 40, md: 44 },
              borderRadius: "8px",
              bgcolor: "#F0F2F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#374151",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}

        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 11, md: 12 },
              fontWeight: 700,
              color: "#374151",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 22, md: 24 },
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
