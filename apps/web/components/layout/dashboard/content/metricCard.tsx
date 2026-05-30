import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Paper, Stack, Typography, Box } from "@mui/material";

const MetricCard = ({
  icon,
  value,
  label,
  trend,
  trendDirection = "up",
  accentColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  trend?: string;
  trendDirection?: "up" | "down";
  accentColor?: string;
}) => {
  const isDown = trendDirection === "down";

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: 168,
        p: { xs: 2.25, md: 3 },
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        borderLeft: accentColor ? 3 : 1,
        borderLeftColor: accentColor || "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: "#E5E4E2",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          {trend && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
              }}
            >
              {isDown ? (
                <TrendingDown
                  sx={{
                    fontSize: 16,
                    color: "error.main",
                  }}
                />
              ) : (
                <TrendingUp
                  sx={{
                    fontSize: 16,
                    color: "success.dark",
                  }}
                />
              )}

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isDown ? "error.main" : "success.dark",
                }}
              >
                {trend}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box>
          <Typography
            sx={{
              fontSize: { xs: 34, md: 42 },
              fontWeight: 500,
              lineHeight: 1,
              color: "text.primary",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: 15, md: 18 },
              color: "text.secondary",
              lineHeight: 1.3,
            }}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MetricCard;
