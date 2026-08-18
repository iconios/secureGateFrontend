"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Drawer, Modal, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  EditPrincipalSchema,
  EditPrincipalType,
  OpenHandleProps,
} from "./types";
import { EditHouseholdDetails } from "./editHouseholdContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateHouseholdAndPrincipalServerResponse,
  UpdateHouseholdAndPrincipalType,
} from "@shared/services/household";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { showToast } from "../../../../../utils/toast";
import { EditHouseholdSuccess } from "./editHouseholdSuccess";

export const EditHousehold = ({ open, setOpen }: OpenHandleProps) => {
  // Initialize local variables
  const {
    principalResidentId,
    householdId,
    unitNumber,
    blockOrStreet,
    photoUrl,
    fullName,
    gender,
    dateOfBirth,
    phone,
    email,
    mobileAccess,
    guestPreAuthorize,
    guestArrivalNotify,
    emergencyAlerts,
  } = useSelector((state: RootState) => state.household);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(photoUrl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successData, setSuccessData] = useState({
    message: "",
    unitDetails: "",
    principalFullName: "",
    totalResidents: "",
  });
  const estateId = useSelector((state: RootState) => state.estate.estateId);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setActiveTab(0);
    setSuccessData({
      message: "",
      unitDetails: "",
      principalFullName: "",
      totalResidents: "",
    });
  };

  // Form initialization
  const methods = useForm<EditPrincipalType>({
    mode: "onChange",
    resolver: zodResolver(EditPrincipalSchema),
    defaultValues: {
      fullName: "",
      gender: "male",
      dateOfBirth: "",
      phone: "",
      email: "",
      photoUrl: "",
      unitNumber: "",
      blockOrStreet: "",
      principalPersonId: "",
      householdId: "",
      mobileAccess: mobileAccess ?? false,
      guestPreAuthorize: guestPreAuthorize ?? false,
      guestArrivalNotify: guestArrivalNotify ?? false,
      emergencyAlerts: emergencyAlerts ?? false,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = methods;
  useEffect(() => {
    if (!open) return;

    reset({
      fullName: fullName ?? "",
      gender: gender ?? "male",
      dateOfBirth: dateOfBirth ?? "",
      phone: phone ?? "",
      email: email ?? "",
      photoUrl: photoUrl ?? "",
      unitNumber: unitNumber ?? "",
      blockOrStreet: blockOrStreet ?? "",
      householdId: householdId ?? "",
      principalPersonId: principalResidentId ?? "",
      mobileAccess: mobileAccess ?? false,
      guestPreAuthorize: guestPreAuthorize ?? false,
      guestArrivalNotify: guestArrivalNotify ?? false,
      emergencyAlerts: emergencyAlerts ?? false,
    });

    setPhotoPreviewUrl(photoUrl ?? "");
  }, [
    open,
    fullName,
    gender,
    dateOfBirth,
    phone,
    email,
    photoUrl,
    unitNumber,
    blockOrStreet,
    householdId,
    principalResidentId,
    reset,
    mobileAccess,
    guestPreAuthorize,
    guestArrivalNotify,
    emergencyAlerts,
  ]);

  const mutation = useMutation({
    mutationKey: [
      "household",
      "principal",
      householdId,
      estateId,
      principalResidentId,
    ],
    mutationFn: async (data: UpdateHouseholdAndPrincipalType) => {
      if (!estateId || !householdId || !principalResidentId) {
        throw new Error("Missing household or principal information");
      }

      const params = new URLSearchParams({
        estateId,
        householdId,
        principalResidentId,
      });

      const response = await fetch(
        `/api/household/updateHouseholdAndPrincipal?${params.toString()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to update household and principal",
        );
      }

      return (await response.json()) as UpdateHouseholdAndPrincipalServerResponse;
    },
    onSuccess: (responseData) => {
      console.log("Success data", responseData);

      const { message, data } = responseData;

      if (!data) {
        showToast.error(
          "The update succeeded, but no updated data was returned",
        );
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["households", estateId] });

      setSuccessData({
        message,
        unitDetails: [data.household.unitNumber, data.household.blockOrStreet]
          .filter(Boolean)
          .join(" "),
        principalFullName: data.principal.fullName ?? "",
        totalResidents: String(data.totalResidents ?? 0),
      });

      setOpen(false);
      setActiveTab(0);
      setOpenSuccess(true);
    },
    onError: (error) => {
      const errMessage =
        error instanceof Error
          ? error.message
          : "Error while updating household and principal";
      showToast.error(errMessage);
    },
  });

  const onSubmit = async (values: EditPrincipalType) => {
    const householdChanges: NonNullable<
      UpdateHouseholdAndPrincipalType["household"]
    > = {};

    const principalChanges: NonNullable<
      UpdateHouseholdAndPrincipalType["principal"]
    > = {};

    // Household fields
    if (dirtyFields.unitNumber) {
      householdChanges.unitNumber = values.unitNumber;
    }

    if (dirtyFields.blockOrStreet) {
      householdChanges.blockOrStreet = values.blockOrStreet;
    }

    if (dirtyFields.mobileAccess) {
      householdChanges.mobileAccess = values.mobileAccess;
    }

    if (dirtyFields.guestPreAuthorize) {
      householdChanges.guestPreAuthorize = values.guestPreAuthorize;
    }

    if (dirtyFields.guestArrivalNotify) {
      householdChanges.guestArrivalNotify = values.guestArrivalNotify;
    }

    if (dirtyFields.emergencyAlerts) {
      householdChanges.emergencyAlerts = values.emergencyAlerts;
    }

    // Principal fields
    if (dirtyFields.fullName) {
      principalChanges.fullName = values.fullName;
    }

    if (dirtyFields.gender) {
      principalChanges.gender = values.gender;
    }

    if (dirtyFields.dateOfBirth) {
      principalChanges.dateOfBirth = new Date(values.dateOfBirth);
    }

    if (dirtyFields.phone) {
      principalChanges.phone = values.phone;
    }

    if (dirtyFields.email) {
      principalChanges.email = values.email;
    }

    if (dirtyFields.photoUrl) {
      principalChanges.photoUrl = values.photoUrl;
    }

    const payload: UpdateHouseholdAndPrincipalType = {
      ...(Object.keys(householdChanges).length > 0
        ? {
            household: householdChanges,
          }
        : {
            household: undefined,
          }),

      ...(Object.keys(principalChanges).length > 0
        ? {
            principal: principalChanges,
          }
        : {
            principal: undefined,
          }),
    };

    if (
      Object.keys(householdChanges).length === 0 &&
      Object.keys(principalChanges).length === 0
    ) {
      showToast.error("No changes were made");
      return;
    }

    await mutation.mutateAsync(payload);
  };

  const contentProps = {
    handleClose,
    photoPreviewUrl,
    setPhotoPreviewUrl,
    activeTab,
    setActiveTab,
    isPending: mutation.isPending || isSubmitting,
    isDirty,
  };

  return (
    <>
      <FormProvider {...methods}>
        {isMobile ? (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-household-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 480,
                maxHeight: "90dvh",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                outline: "none",
              }}
            >
              <EditHouseholdDetails {...contentProps} />
            </Box>
          </Modal>
        ) : (
          <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
              zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
            slotProps={{
              paper: {
                sx: {
                  width: 420,
                  maxWidth: "100vw",
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  marginTop: 0,
                  height: "auto",
                  maxHeight: "100dvh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  zIndex: (theme) => theme.zIndex.appBar + 1,
                  paddingTop: 10,
                },
              },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <EditHouseholdDetails {...contentProps} />
            </Box>
          </Drawer>
        )}
      </FormProvider>

      {/* Edit Household Success */}
      <EditHouseholdSuccess
        open={openSuccess}
        setOpen={() => setOpenSuccess(false)}
        subTitle={successData.message}
        backButtonName="Back to Households"
        backFunction={() => setOpenSuccess(false)}
        unitDetails={successData.unitDetails}
        principalFullName={successData.principalFullName}
        totalResidents={`${successData.totalResidents}`}
      />
    </>
  );
};
