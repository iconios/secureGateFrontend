import { useState } from "react";
import { HouseholdUnitDetailsProvision } from "./addUnitDetails";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { Close } from "@mui/icons-material";
import { AddPrincipalResident } from "./addPrincipalResident";
import { HouseholdCreationSteps } from "./creationSteps";
import { FormProvider, useForm } from "react-hook-form";
import { CreateHouseholdInputSchema, CreateHouseholdInputType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";

enum HouseholdWizardSteps {
  UnitDetails = 0,
  PrincipalResident = 1,
  HouseholdMembers = 2,
  Review = 3,
}

export const AddHouseholdWizardDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  // Local state variables
  const [activeStep, setActiveStep] = useState(0);
  const estateId = useSelector((state: RootState) => state.estate.estateId);

  // Form initialization
  const methods = useForm<CreateHouseholdInputType>({
    mode: "onBlur",
    resolver: zodResolver(CreateHouseholdInputSchema),
    defaultValues: {
      households: [
        {
          house: {
            unitNumber: "",
            blockOrStreet: "",
          },
          // default to creating a new principal resident
          principalResident: {
            mode: "create",
            fullName: "",
            email: "",
            phone: "",
            photoUrl: "",
            dateOfBirth: "",
            gender: "male" as const satisfies "male" | "female",
          },
          members: [],
        },
      ],
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  // Wizard handlers
  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const handleNext = async () => {
    let fieldsToValidate: Array<
      | `households.${number}.house`
      | `households.${number}.principalResident`
      | `households.${number}.members`
    > = [];

    if (activeStep === HouseholdWizardSteps.UnitDetails) {
      fieldsToValidate = ["households.0.house"];
    }

    if (activeStep === HouseholdWizardSteps.PrincipalResident) {
      fieldsToValidate = ["households.0.principalResident"];
    }

    if (activeStep === HouseholdWizardSteps.HouseholdMembers) {
      fieldsToValidate = ["households.0.members"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) {
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === HouseholdWizardSteps.UnitDetails) {
      return;
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Step Content Renderer
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <HouseholdUnitDetailsProvision estateId={estateId} />;
      case 1:
        return <AddPrincipalResident />;
      case 2:
        return <Typography>Step 3 page</Typography>;
      case 3:
        return <Typography>Step 4 page</Typography>;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Box>
      {/** Changing content UI based on household creation steps */}
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>
          {/** Heading and subheading */}
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  color: "text.primary",
                  fontSize: { xs: 20, md: 28 },
                  fontWeight: 600,
                }}
              >
                Add New Household
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 14, md: 18 },
                  fontWeight: "thin",
                }}
              >
                Initialize a new residential record with the estate system.
              </Typography>
            </Box>
            <IconButton onClick={handleClose}>
              <Close fontSize="medium" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true}>
          {/** Household creation steps */}
          <FormProvider {...methods}>
            <HouseholdCreationSteps step={activeStep} />
            <Box sx={{ minHeight: "200px" }} component="form">
              {renderStepContent(activeStep)}
            </Box>
          </FormProvider>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            px: 3,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleBack}
            sx={{ display: activeStep === 0 ? "none" : "block" }}
          >
            Back
          </Button>
          <Button onClick={handleNext} variant="contained" color="primary">
            {activeStep === 3 ? "Submit" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
