"use client";

import {
  ApartmentOutlined,
  Add,
  ImportContacts,
  VerifiedUserOutlined,
  FileOpenOutlined,
} from "@mui/icons-material";
import { Paper, Box, Typography, Stack } from "@mui/material";
import { SecureGateButton } from "./householdButton";
import { useState } from "react";
import { AddHouseholdWizardDialog } from "./addHouseholdWizard";

export const EmptyHouseholdTable = () => {
  // Local state variables to manage dialog box
  const [open, setOpen] = useState(false);
  const handleDialog = (v: boolean) => {
    setOpen(v);
  };
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 1,
          mb: { xs: 4, md: 7 },
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Empty image */}
        <Box
          sx={{
            borderRadius: "50%",
            backgroundColor: "#F0F2F5",
            mx: "auto",
            height: { xs: 70, md: 95 },
            width: { xs: 70, md: 95 },
            mb: 3,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Box
            sx={{
              border: "3px dashed grey",
              borderRadius: "50%",
              mx: "auto",
              height: { xs: 50, md: 70 },
              width: { xs: 50, md: 70 },
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <ApartmentOutlined
              fontSize="large"
              sx={{
                color: "grey",
              }}
            />
          </Box>
        </Box>

        {/* Heading and subheading */}
        <Typography
          variant="h2"
          sx={{
            color: "text.primary",
            fontSize: { xs: 18, md: 24 },
            fontWeight: 600,
            textAlign: "center",
            mb: 1,
          }}
        >
          No households registered yet
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: 14, md: 18 },
            textAlign: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          Create your first household by adding a unit and linking a principal
          resident. You can manage access codes and staff for each residence
          here.
        </Typography>

        {/* Buttons */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          sx={{
            mb: { xs: 4, md: 7 },
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <SecureGateButton
            label="Add Household"
            icon={<Add />}
            iconPosition="start"
            onClick={() => handleDialog(true)}
          />

          <SecureGateButton
            label="Import CSV"
            icon={<ImportContacts />}
            iconPosition="start"
            appearance="secondary"
          />
        </Stack>

        {/* Outlined features */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1.5,
            }}
          >
            <VerifiedUserOutlined fontSize="inherit" />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 14 },
              }}
            >
              Secure Access
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1.5,
            }}
          >
            <FileOpenOutlined fontSize="inherit" />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 14 },
              }}
            >
              Auto-generation
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <AddHouseholdWizardDialog
        open={open}
        onClose={() => handleDialog(false)}
      />
    </>
  );
};
