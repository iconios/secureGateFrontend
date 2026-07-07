"use client";

import {
  SchoolOutlined,
  Shield,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type ReminderProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

const Reminders = ({ title, description, icon }: ReminderProps) => {
  return (
    <Box
      sx={{
        mb: 2,
        px: { xs: 2, md: 3 },
        py: { xs: 1, md: 2 },
      }}
    >
      <Stack direction="row">
        {icon}
        <Typography
          variant="h2"
          sx={{
            color: "primary.main",
            fontSize: { xs: 14, md: 18 },
            fontWeight: 600,
            mb: { xs: 1, md: 1.5 },
            ml: 2,
          }}
        >
          {title}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontSize: { xs: 12, md: 14 },
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export const HouseholdsFooter = () => {
  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Reminders
            title="Did you know?"
            description="You can bulk import residents using our excel template to save time during estate setup."
            icon={<SchoolOutlined color="primary" fontSize="inherit" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Reminders
            title="Security Codes"
            description="Each household automatically gets a unique primary code once a resident is linked."
            icon={<Shield color="primary" fontSize="inherit" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Reminders
            title="Household Roles"
            description="Assign 'Assistant' roles to lend a hand to the principal resident to manage a household."
            icon={<WorkOutlineOutlined color="primary" fontSize="inherit" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
