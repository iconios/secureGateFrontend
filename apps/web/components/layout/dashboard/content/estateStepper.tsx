import { Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";

const estateCreationSteps = [
  "Fill estate details",
  "Select household limit",
  "Review & submit",
  "Make payment",
  "Estate created",
];

const EstateCreationSteps = ({ activeStep }: { activeStep: number }) => {
  const [step] = useState<number>(activeStep);
  return (
    <Stepper
      activeStep={step}
      alternativeLabel
      sx={{
        mb: 3,
        display: { xs: "none", md: "flex" },
      }}
    >
      {estateCreationSteps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default EstateCreationSteps;
