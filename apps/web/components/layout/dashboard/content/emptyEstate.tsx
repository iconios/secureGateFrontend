"use client";

import { Add, BookOnline, HouseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Fab,
  Paper,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import useAuthCheck from "../../../../hooks/useAuthCheck";

const NoEstateYet = ({ nextStepHandler }: { nextStepHandler: () => void }) => {
  // Check user auth status
  useAuthCheck();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);

  const estateCreationSteps = [
    "Fill estate form",
    "Review & submit form",
    "Household plan selection",
    "Make payment",
    "Estate created",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        pt: { xs: 2, md: 5 },
        flex: 1,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          mb: 5,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 2, md: 8 },
          py: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: 220, md: 280 },
            height: { xs: 200, md: 250 },
            position: "relative",
          }}
        >
          <Image
            src="/no-estate-yet.png"
            alt="No estate yet"
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Typography
          sx={{ pb: 2, fontWeight: 600, fontSize: { xs: 20, md: 28 } }}
        >
          Welcome to SecureGate
        </Typography>
        <Typography
          sx={{
            color: "grey",
            fontSize: 14,
          }}
        >
          Create your first estate to start managing residents, households,
          vehicles, guests, and incidents from one secure dashboard.
        </Typography>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          sx={{
            py: 3,
            width: { xs: "100%", md: "60%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              nextStepHandler();
            }}
            startIcon={<HouseOutlined />}
            sx={{ px: 3, py: 1 }}
          >
            Create Estate
          </Button>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<BookOnline />}
            sx={{ px: 3, py: 1 }}
          >
            View Setup Guide
          </Button>
        </Stack>
        <Typography
          sx={{
            color: "grey",
            fontSize: 10,
          }}
        >
          It only takes a few minutes to set up your estate profile
        </Typography>
      </Paper>

      {/* Setup Journey */}
      {isMobile ? (
        <>
          <Stepper activeStep={activeStep} orientation="vertical">
            {estateCreationSteps.map((step, index) => (
              <Step key={step}>
                <StepLabel
                  optional={
                    index === estateCreationSteps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step}
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === estateCreationSteps.length - 1
                        ? "Finish"
                        : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === estateCreationSteps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </>
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel>
          {estateCreationSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <Fab
        color="primary"
        aria-label="add estate"
        onClick={() => {
          nextStepHandler();
        }}
        variant="extended"
        sx={{
          display: "block",
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <Add sx={{ mr: 1 }} />
        CREATE ESTATE
      </Fab>
    </Box>
  );
};

export default NoEstateYet;
