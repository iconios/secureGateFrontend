import {
  Block,
  FlagOutlined,
  HailOutlined,
  House,
  Person,
  ReportProblem,
  VerifiedOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Icon,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Metrics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const data = {
    subscription_plan: "Premium",
    max_principal_residents: 1000,
    principal_residents_number: 850,
    next_bill: "01 Feb 2024",
    households: 320,
    active_guests: 45,
    flagged_guests: 3,
    blacklisted_vehicles: 2,
    open_incidents: 5,
  };

  const percentageSubscriptionUsage = Math.ceil(
    data.principal_residents_number / data.max_principal_residents,
  );

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={1}>
      {/* Current Plan */}
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "100%",
            md: "30%",
          },
        }}
      >
        <Stack direction="row" spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">CURRENT PLAN</Typography>
            <Typography variant="h3">{data.subscription_plan} Plan</Typography>
          </Box>
          <Icon sx={{ display: "flex", justifyContent: "flex-end" }}>
            <VerifiedOutlined fontSize="medium" />
          </Icon>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6">
              {data.principal_residents_number}/{data.max_principal_residents}
            </Typography>
            <Typography variant="h6" component="p">
              Principal residents registered
            </Typography>
          </Stack>
          <Typography variant="h4" color="primary">
            {percentageSubscriptionUsage}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percentageSubscriptionUsage}
          sx={{
            height: 4,
            borderRadius: 10,
            width: "100%",
          }}
        />
        <Divider />
        <Stack direction="row" spacing={1}>
          <Typography variant="h6" component="p">
            Next billing {data.next_bill}
          </Typography>
          <Button variant="text" onClick={() => {}}>
            Upgrade Plan
          </Button>
        </Stack>
      </Paper>

      {/* Principal Residents Metric UI */}
      <Paper elevation={1} sx={{ width: { xs: "50%", md: "25%" } }}>
        <Stack direction="column" spacing={1}>
          <Icon>
            <Person
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.principal_residents_number}
          </Typography>
          <Typography variant="h6" component="p">
            Principal Residents
          </Typography>
        </Stack>
      </Paper>

      {/* Households Metric UI */}
      <Paper elevation={1} sx={{ width: { xs: "50%", md: "25%" } }}>
        <Stack direction="column" spacing={1}>
          <Icon>
            <House
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.households}
          </Typography>
          <Typography variant="h6" component="p">
            Households
          </Typography>
        </Stack>
      </Paper>

      {/* Active Guests Metric UI */}
      <Paper elevation={1} sx={{ width: { xs: "50%", md: "25%" } }}>
        <Stack direction="column" spacing={1}>
          <Icon>
            <HailOutlined
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.active_guests}
          </Typography>
          <Typography variant="h6" component="p">
            Active Guests
          </Typography>
        </Stack>
      </Paper>

      {/* Flagged Guests Metric UI */}
      <Paper
        elevation={1}
        sx={{
          width: { xs: "50%", md: "25%" },
          borderLeftColor: "red",
          borderLeftWidth: 2,
        }}
      >
        <Stack direction="column" spacing={1}>
          <Icon>
            <FlagOutlined
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.flagged_guests}
          </Typography>
          <Typography variant="h6" component="p">
            Flagged Guests
          </Typography>
        </Stack>
      </Paper>

      {/* Blacklisted Vehicles Metric UI */}
      <Paper
        elevation={1}
        sx={{
          width: { xs: "50%", md: "25%" },
          borderLeftColor: "black",
          borderLeftWidth: 2,
        }}
      >
        <Stack direction="column" spacing={1}>
          <Icon>
            <Block
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.blacklisted_vehicles}
          </Typography>
          <Typography variant="h6" component="p">
            Blacklisted Vehicles
          </Typography>
        </Stack>
      </Paper>

      {/* Open Incidents Metric UI */}
      <Paper
        elevation={1}
        sx={{
          width: { xs: "50%", md: "25%" },
          borderLeftColor: "pink",
          borderLeftWidth: 2,
        }}
      >
        <Stack direction="column" spacing={1}>
          <Icon>
            <ReportProblem
              fontSize="medium"
              sx={{ backgroundColor: "grey", color: "primary" }}
            />
          </Icon>
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            {data.open_incidents}
          </Typography>
          <Typography variant="h6" component="p">
            Open Incidents
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Metrics;
