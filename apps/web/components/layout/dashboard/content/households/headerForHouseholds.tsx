"use client";

import {
  CloudUploadOutlined,
  Add,
  HouseOutlined,
  People,
  AssistantOutlined,
  CodeOutlined,
} from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { SecureGateButton } from "./householdButton";
import { SecureGateMetricCard } from "./householdMetricCard";
import { AddHouseholdWizardDialog } from "./addHouseholdWizard";
import { useState } from "react";

export const HouseholdsHeader = ({
  estateName,
  totalHouseholds,
  totalMembers,
  totalAssistants,
}: {
  estateName: string;
  totalHouseholds?: number;
  totalMembers?: number;
  totalAssistants?: number;
}) => {
  // Local state variables to manage dialog box
  const [open, setOpen] = useState(false);
  const handleDialog = (v: boolean) => {
    setOpen(v);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* First row of text and buttons */}
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            mx: "auto",
            mb: 2,
            width: "100%",
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "text.primary",
                fontSize: { xs: 20, md: 28 },
                fontWeight: 700,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {estateName} Households
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 14, md: 18 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              View household records, principal residents, members, assistants,
              and household codes.
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Stack
              spacing={1}
              direction={{
                xs: "column",
                md: "row",
              }}
              sx={{
                width: { xs: "100%", md: "auto" },
                alignItems: { xs: "stretch", md: "center" },
              }}
            >
              <SecureGateButton
                label="Import Households"
                icon={<CloudUploadOutlined />}
                iconPosition="start"
                mobileFullWidth
                appearance="secondary"
              />
              <SecureGateButton
                label="Add Household"
                icon={<Add />}
                iconPosition="start"
                mobileFullWidth
                onClick={() => handleDialog(true)}
              />
            </Stack>
          </Box>
        </Stack>

        {/* Second row of metric cards */}
        <Grid
          container
          spacing={1}
          sx={{
            mb: { xs: 2, md: 4 },
            mx: "auto",
          }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SecureGateMetricCard
              label="Total Households"
              value={totalHouseholds ?? 0}
              icon={<HouseOutlined />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SecureGateMetricCard
              label="Total Members"
              value={totalMembers ?? 0}
              icon={<People />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SecureGateMetricCard
              label="Assistants"
              value={totalAssistants ?? 0}
              icon={<AssistantOutlined />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SecureGateMetricCard
              label="Active Codes"
              value={0}
              icon={<CodeOutlined />}
            />
          </Grid>
        </Grid>
      </Box>
      <AddHouseholdWizardDialog
        open={open}
        onClose={() => handleDialog(false)}
      />
    </>
  );
};
