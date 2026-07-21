import { Box, Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  {
    label: "Unit details",
    content: "Enter the unit details for the household",
  },
  {
    label: "Principal resident details",
    content:
      "Enter or link up the principal resident details for the household",
  },
  {
    label: "Household members",
    content: "Enter the details or link up to each household member",
  },
  {
    label: "Review and submit",
    content:
      "Review all the entered details and submit the household creation request",
  },
];

export const HouseholdCreationSteps = ({ step }: { step: number }) => {
  return (
    <Box
      sx={{
        my: 2,
      }}
    >
      <Stepper
        activeStep={step}
        alternativeLabel
        sx={{
          orientation: { xs: "vertical", md: "horizontal" },
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
