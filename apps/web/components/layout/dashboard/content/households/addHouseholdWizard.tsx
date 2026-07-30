"use client";

import { useEffect, useState } from "react";
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
import {
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
import { AddReviewAndSubmit } from "./addReview&Submit";
import { useCreateHouseholds } from "../../../../../hooks/useCreateHouseholds";
import { showToast } from "../../../../../utils/toast";
import { RootState } from "../../../../../lib/store";
import { useGetAllNonPrincipalsByEstate } from "../../../../../hooks/useGetAllNonPrincipalsByEstate";

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
  const estateId = useSelector((state) => (state as RootState).estate.estateId);
  console.log("estate id", estateId);
  const { isError, error, mutateAsync, isPending, reset } =
    useCreateHouseholds(estateId);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [shouldFetchExistingResidents, setShouldFetchExistingResidents] =
    useState(false);

  useEffect(() => {
    const delayDebounceFunction = setTimeout(() => {
      setDebounceSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(delayDebounceFunction);
  }, [searchTerm]);

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

  const { handleSubmit, trigger } = methods;

  // Wizard handlers
  const handleClose = () => {
    if (isPending) {
      return;
    }

    methods.reset();
    reset();

    setActiveStep(HouseholdWizardSteps.UnitDetails);
    setCustomOptions([]);
    setPhotoPreviewUrl("");

    onClose();
  };

  // Handle fetch for non-principals
  const {
    isError: nonPrincipalIsError,
    error: nonPrincipalError,
    data: nonPrincipalData,
    isSuccess: nonPrincipalIsSuccess,
    isLoading: nonPrincipalIsLoading,
    isFetching: nonPrincipalIsFetching,
    refetch: nonPrincipalRefetch,
  } = useGetAllNonPrincipalsByEstate(
    estateId,
    "1",
    "20",
    debounceSearchTerm,
    shouldFetchExistingResidents,
  );
  const fetchedResidents =
    nonPrincipalData && "nonPrincipals" in nonPrincipalData
      ? nonPrincipalData.nonPrincipals
      : [];

  const handleNext = async () => {
    if (activeStep === HouseholdWizardSteps.Review) {
      setSearchTerm("");
      setDebounceSearchTerm("");
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
      setSearchTerm("");
      setDebounceSearchTerm("");
      return;
    }

    setActiveStep((prev) => prev + 1);
    setSearchTerm("");
    setDebounceSearchTerm("");
  };

  const handleBack = () => {
    if (activeStep === HouseholdWizardSteps.UnitDetails) {
      return;
    } else {
      setActiveStep((prev) => prev - 1);
      setSearchTerm("");
      setDebounceSearchTerm("");
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchedResidents={fetchedResidents}
            isError={nonPrincipalIsError}
            error={nonPrincipalError}
            isSuccess={nonPrincipalIsSuccess}
            isLoading={nonPrincipalIsLoading}
            isFetching={nonPrincipalIsFetching}
            refetch={nonPrincipalRefetch}
            setShouldFetchExistingResidents={setShouldFetchExistingResidents}
            shouldFetchExistingResidents={shouldFetchExistingResidents}
          />
        );
      case 2:
        return (
          <AddMemberResident
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchedResidents={fetchedResidents}
            isError={nonPrincipalIsError}
            error={nonPrincipalError}
            isSuccess={nonPrincipalIsSuccess}
            isLoading={nonPrincipalIsLoading}
            isFetching={nonPrincipalIsFetching}
            refetch={nonPrincipalRefetch}
            setShouldFetchExistingResidents={setShouldFetchExistingResidents}
            shouldFetchExistingResidents={shouldFetchExistingResidents}
          />
        );
      case 3:
        return (
          <AddReviewAndSubmit
            fetchedResidents={fetchedResidents}
            shouldFetchExistingResidents={shouldFetchExistingResidents}
            setShouldFetchExistingResidents={setShouldFetchExistingResidents}
            isFetching={nonPrincipalIsFetching}
          />
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  // Handler for form submit
  const handleFormSubmit = async (data: CreateHouseholdPayload) => {
    try {
      await mutateAsync(data);

      methods.reset();
      setActiveStep(HouseholdWizardSteps.UnitDetails);
      setCustomOptions([]);
      setPhotoPreviewUrl("");

      onClose();
    } catch {
      // The error is available through createHouseholds.error.
      // Keep the dialog open so it can be displayed to the user.
    }
  };

  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error encountered during household creation";
    showToast.error(errorMessage);
  }

  const submitButtonLabel = () => {
    if (isPending) return "Submitting...";
    if (activeStep === HouseholdWizardSteps.Review) return "Submit";
    return "Next";
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
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void handleNext();
            }}
          >
            <DialogContent dividers={true}>
              {/** Household creation steps */}
              <HouseholdCreationSteps step={activeStep} />
              <Box sx={{ minHeight: "200px" }}>
                {renderStepContent(activeStep)}
              </Box>
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
                type="button"
                onClick={handleClose}
                variant="outlined"
                startIcon={<CancelOutlined />}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Stack direction="row" spacing={1}>
                {activeStep !== HouseholdWizardSteps.UnitDetails && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleBack}
                    disabled={isPending}
                  >
                    Back
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPending}
                  endIcon={
                    activeStep === HouseholdWizardSteps.Review ? (
                      <PostAdd />
                    ) : (
                      <ArrowForwardOutlined />
                    )
                  }
                >
                  {submitButtonLabel()}
                </Button>
              </Stack>
            </DialogActions>
          </Box>
        </FormProvider>
      </Dialog>
    </Box>
  );
};
