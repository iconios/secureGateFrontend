"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Drawer, Modal, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  EditPrincipalSchema,
  EditPrincipalType,
  UpdateHouseholdAndPrincipalApiSuccess,
  OpenHandleProps,
} from "./types";
import { EditHouseholdDetails } from "./editHouseholdContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateHouseholdAndPrincipalType } from "@shared/services/household";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { showToast } from "../../../../../utils/toast";

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
    houseCode,
  } = useSelector((state: RootState) => state.household);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(photoUrl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState(0);
  const estateId = useSelector((state: RootState) => state.estate.estateId);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setActiveTab(0);
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
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
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
    houseCode,
    reset,
  ]);

  const mutation = useMutation<
    UpdateHouseholdAndPrincipalApiSuccess,
    Error,
    UpdateHouseholdAndPrincipalType
  >({
    mutationKey: [
      "household",
      "principal",
      householdId,
      estateId,
      principalResidentId,
    ],
    mutationFn: async (data: UpdateHouseholdAndPrincipalType) => {
      const response = await fetch(
        `/api/household/updateHouseholdAndPrincipal?estateId=${estateId}&householdId=${householdId}&principalResidentId=${principalResidentId}`,
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

      return (await response.json()) as UpdateHouseholdAndPrincipalApiSuccess;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["households", estateId] });
      // handleClose();
    },
    onError: (error) => {
      const errMessage =
        error instanceof Error
          ? error.message
          : "Error while updating household and principal";
      showToast.error(errMessage);
    },
  });

  const onSubmit = (values: EditPrincipalType) => {
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

    mutation.mutate(payload);
  };

  const contentProps = {
    handleClose,
    photoPreviewUrl,
    setPhotoPreviewUrl,
    activeTab,
    setActiveTab,
    isPending: mutation.isPending || isSubmitting,
  };

  return (
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
  );
};
