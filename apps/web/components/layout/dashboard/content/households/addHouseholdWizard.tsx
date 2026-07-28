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
import {
  ArrowBackOutlined,
  ArrowForwardOutlined,
  CancelOutlined,
  Close,
  PostAdd,
} from "@mui/icons-material";
import { AddPrincipalResident } from "./addPrincipalResident";
import { HouseholdCreationSteps } from "./creationSteps";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateHouseholdFormInput,
  CreateHouseholdInputSchema,
  CreateHouseholdPayload,
} from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddMemberResident } from "./addMemberResident";
import { ReviewAndSubmit } from "./reviewAndSubmit";

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
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const estateId = useSelector((state: RootState) => state.estate.estateId);

  // Local state for image preview URL and check authentication state
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");

  const handleSetCustomOptions = (v: string) => {
    setCustomOptions((prev) => {
      if (prev.includes(v)) return prev;
      return [...prev, v];
    });
  };

  // Form initialization
  const methods = useForm<
    CreateHouseholdFormInput,
    unknown,
    CreateHouseholdPayload
  >({
    mode: "onBlur",
    resolver: zodResolver(CreateHouseholdInputSchema),
    defaultValues: {
      households: [
        {
          house: {
            unitNumber: "",
            blockOrStreet: "",
          },
          principalResident: {
            mode: "create",
            fullName: "",
            email: "",
            phone: "",
            gender: "male",
            photoUrl: "",
            dateOfBirth: "",
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
    if (activeStep === HouseholdWizardSteps.Review) {
      await handleSubmit(handleFormSubmit)();
      return;
    }

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
        return (
          <HouseholdUnitDetailsProvision
            estateId={estateId}
            customOptions={customOptions}
            handleSetCustomOptions={handleSetCustomOptions}
          />
        );
      case 1:
        return (
          <AddPrincipalResident
            photoPreviewUrl={photoPreviewUrl}
            setPhotoPreviewUrl={setPhotoPreviewUrl}
          />
        );
      case 2:
        return <AddMemberResident />;
      case 3:
        return <ReviewAndSubmit />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  // Handler for form submit
  const handleFormSubmit = async (data: CreateHouseholdPayload) => {
    console.log(data);
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
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CancelOutlined />}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              display: activeStep === 0 ? "none" : "block",
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            endIcon={activeStep === 3 ? <PostAdd /> : <ArrowForwardOutlined />}
          >
            {activeStep === 3 ? "Submit" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
