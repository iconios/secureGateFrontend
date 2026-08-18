"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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
import { householdActions } from "../../../../../lib/features/household/householdSlice";
import { AddOneHouseholdSuccess } from "./addOneHouseholdSuccess";

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
  const dispatch = useDispatch();
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [shouldFetchExistingResidents, setShouldFetchExistingResidents] =
    useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const estateId = useSelector((state) => (state as RootState).estate.estateId);
  const {
    isError,
    error,
    mutateAsync,
    isPending,
    reset: resetMutation,
  } = useCreateHouseholds(estateId);

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

  // Reset Wizard handlers and form variables
  const resetWizard = useCallback(() => {
    methods.reset();
    setActiveStep(HouseholdWizardSteps.UnitDetails);
    setCustomOptions([]);
    setPhotoPreviewUrl("");
    setSearchTerm("");
    setDebounceSearchTerm("");
    setShouldFetchExistingResidents(false);
  }, [methods]);

  const handleClose = () => {
    if (isPending) {
      return;
    }

    setOpenSuccess(false);
    resetWizard();
    resetMutation();
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
    if (isPending) return;

    if (activeStep === HouseholdWizardSteps.Review) {
      setSearchTerm("");
      setDebounceSearchTerm("");
      await handleSubmit(onSubmit)();
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

  // Handler to close the success notification
  const handleCloseSuccessDialog = () => {
    setOpenSuccess(false);
    onClose();
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
  const onSubmit = async (payload: CreateHouseholdPayload) => {
    try {
      const result = await mutateAsync(payload);

      const createdHousehold = result?.households?.[0];

      if (!createdHousehold) {
        console.error("Unexpected create-household response:", result);

        showToast.error(
          "The household was created, but the server returned an invalid response.",
        );
        return;
      }

      dispatch(
        householdActions.insertEditHouseholdData({
          unitNumber: createdHousehold.unitNumber,
          blockOrStreet: createdHousehold.blockOrStreet,
          houseCode: createdHousehold.code,
          fullName: createdHousehold.principalResident?.fullName ?? "",
          photoUrl: createdHousehold.principalResident?.photoUrl ?? "",
          totalMembers: createdHousehold.members?.length ?? 0,
        }),
      );

      resetWizard();
      resetMutation();
      setOpenSuccess(true);
    } catch (submissionError) {
      console.error("Household creation failed:", submissionError);
    }
  };

  useEffect(() => {
    console.log("AddHouseholdWizardDialog mounted");

    return () => {
      console.log("AddHouseholdWizardDialog unmounted");
    };
  }, []);

  useEffect(() => {
    if (!isError) return;

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error encountered during household creation";
    showToast.error(errorMessage);
  }, [error, isError]);

  const submitButtonLabel = () => {
    if (isPending) return "Submitting...";
    if (activeStep === HouseholdWizardSteps.Review) return "Submit";
    return "Next";
  };

  useEffect(() => {
    if (!open || estateId) return;

    showToast.error("No estate has been selected.");
  }, [estateId, open]);

  if (!estateId) {
    return null;
  }

  return (
    <Box>
      {/** Changing content UI based on household creation steps */}
      <Dialog open={open && !openSuccess} onClose={handleClose}>
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
            <IconButton
              onClick={handleClose}
              disabled={isPending}
              aria-label="Close add household dialog"
            >
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

      {/* Successful mutation notification */}
      <AddOneHouseholdSuccess
        open={open && openSuccess}
        subTitle="Household and residents successfully provisioned"
        backButtonName="Back to Households"
        onClose={handleCloseSuccessDialog}
        onBack={handleCloseSuccessDialog}
        onAddAnother={() => {
          setOpenSuccess(false);
        }}
      />
    </Box>
  );
};
