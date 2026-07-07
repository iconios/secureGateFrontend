import { useState } from "react";
import EstateCreationSteps from "../estateStepper";
import { HouseholdUnitDetailsProvision } from "./addUnitDetails";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const AddHouseholdWizardDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 3) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return;
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submit data");
    handleClose();
  };

  // Step Content Renderer
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <HouseholdUnitDetailsProvision estateId={""} />;
      case 1:
        return <Typography>Step 2 page</Typography>;
      case 2:
        return <Typography>Step 3 page</Typography>;
      case 3:
        return <Typography>Step 4 page</Typography>;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 4,
      }}
    >
      <EstateCreationSteps activeStep={activeStep} />
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Add Household Wizard</DialogTitle>
        <DialogContent dividers={true}>
          <Box sx={{ minHeight: "200px" }}>{renderStepContent(activeStep)}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleNext} variant="contained" color="primary">
            {activeStep === 3 ? "Submit" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
