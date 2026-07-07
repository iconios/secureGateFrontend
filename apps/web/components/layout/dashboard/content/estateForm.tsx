"use client";

import {
  MenuItem,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Icon,
} from "@mui/material";
import { useState } from "react";
import { getAllStates } from "ng-locations";
import {
  CheckOutlined,
  Forward,
  InfoOutlined,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEstateData, createEstateSchema } from "./estate.types";
import { estateActions } from "../../../../lib/features/estate/estateSlice";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import { RootState } from "../../../../lib/store";
import useAuthCheck from "../../../../hooks/useAuthCheck";

const allNigerianStates = getAllStates();

const EstateForm = ({ nextStepHandler }: { nextStepHandler: () => void }) => {
  // Local state for image preview URL and check authentication state
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>("");
  useAuthCheck();

  // Get user id
  const user = useSelector(
    (state: RootState) => (state as RootState).auth.user,
  );
  const userId = "id" in user ? user.id : "";
  // useImageUpload hook for handling image uploads and validations
  const {
    handleFileUpload,
    error: uploadError,
    loading: uploadLoading,
  } = useImageUpload({ userId });

  // useDispatch initialization
  const dispatch = useDispatch();

  // React Hook Form setup with Zod validation and React Redux integration
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createEstateSchema),
    defaultValues: {
      name: "",
      location: "",
      stateRegion: "Lagos",
      logoUrl: "",
    },
  });
  const { insertEstate } = estateActions;
  const onSubmit = (data: createEstateData) => {
    console.log("Valid submit:", data);
    dispatch(insertEstate(data));
    console.log("Data pushed to redux", data);
    nextStepHandler();
  };
  const onInvalid = (errors: any) => {
    console.log("Form invalid:", errors);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 5 },
        minHeight: "60vh",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <Paper
          elevation={1}
          sx={{
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 2 },
            width: { xs: "100%", md: "66%" },
          }}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          {/* Heading */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: 20, md: 28 },
            }}
          >
            Create Estate Profile
          </Typography>
          {/* Subheading */}
          <Typography
            component="p"
            sx={{
              fontSize: { xs: 10, md: 12 },
              pb: { xs: 2, md: 3 },
            }}
          >
            Please provide the fundamental details of your community to begin
            setup.
          </Typography>

          {/* Estate Logo UI */}
          <Controller
            name="logoUrl"
            control={control}
            render={({ field }) => {
              return (
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    Estate Logo
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <Box
                      component="label"
                      sx={{
                        width: 80,
                        height: 80,
                        border: "1.5px dashed",
                        borderColor: field.value ? "success.main" : "divider",
                        borderRadius: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        bgcolor: "background.default",
                        color: "text.secondary",
                        overflow: "hidden",
                        position: "relative",
                        transition: "0.2s ease",
                        "&:hover": {
                          borderColor: field.value
                            ? "success.main"
                            : "primary.main",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      {/* Display the image preview if available, otherwise show the upload icon and text */}
                      {logoPreviewUrl ? (
                        <Box
                          component="img"
                          src={logoPreviewUrl}
                          alt="Estate Logo"
                          onError={() => {
                            console.error(
                              "Logo preview failed:",
                              logoPreviewUrl,
                            );
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <InsertDriveFileOutlined
                            sx={{ fontSize: 24, mb: 0.5 }}
                          />

                          <Typography
                            sx={{
                              fontSize: 10,
                              fontWeight: 500,
                              textAlign: "center",
                              lineHeight: 1.2,
                            }}
                          >
                            Upload PNG/JPG
                          </Typography>
                        </>
                      )}

                      <input
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        disabled={uploadLoading}
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          // Call useImageUpload handler function
                          const uploadResult = await handleFileUpload(file);

                          // If upload is successful, update the form field value with the returned path
                          if (uploadResult) {
                            console.log(
                              "Estate form public url",
                              uploadResult.publicUrl,
                            );
                            field.onChange(uploadResult.publicUrl);
                            setLogoPreviewUrl(uploadResult.publicUrl); // Update local state with the public URL for preview
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          mb: 0.75,
                        }}
                      >
                        A clear logo helps residents identify the official gate
                        pass and community communications.
                      </Typography>

                      <Typography
                        component="label"
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: uploadLoading ? "not-allowed" : "pointer",
                          color: "text.primary",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {uploadLoading ? "Uploading..." : "Choose File..."}
                        <input
                          hidden
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          disabled={uploadLoading}
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;

                            // Call useImageUpload handler function
                            const uploadResult = await handleFileUpload(file);

                            // If upload is successful, update the form field value with the returned path
                            if (uploadResult) {
                              field.onChange(uploadResult.path);
                              setLogoPreviewUrl(uploadResult.publicUrl); // Update local state with the public URL for preview
                            }
                          }}
                        />
                      </Typography>

                      {/* Dynamic Status Notifications */}
                      {uploadLoading && (
                        <Typography
                          sx={{ fontSize: 12, color: "primary.main", mt: 1 }}
                        >
                          Verifying image dimensions and uploading...
                        </Typography>
                      )}

                      {uploadError && (
                        <Typography
                          sx={{ fontSize: 12, color: "error.main", mt: 1 }}
                        >
                          {uploadError}
                        </Typography>
                      )}

                      {errors.logoUrl && (
                        <Typography
                          sx={{ fontSize: 12, color: "error.main", mt: 1 }}
                        >
                          {errors.logoUrl.message}
                        </Typography>
                      )}

                      {/* Safe check: Using field.value directly ensures instant synchronization */}
                      {field.value && logoPreviewUrl && !uploadLoading && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "success.main",
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} /> Logo
                          verified and uploaded!
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              );
            }}
          />

          {/* Estate Name UI */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: { xs: 2, md: 3 } }}>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    mb: 1,
                    color: "text.primary",
                  }}
                >
                  Estate Name
                </Typography>
                <TextField
                  {...field}
                  placeholder="e.g. Sapphire Gardens Residence"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              </Box>
            )}
          />

          {/* Location & State UI */}
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1}
            sx={{
              mb: { xs: 2, md: 3 },
            }}
          >
            {/* Location UI */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: { xs: 2, md: 3 }, flexGrow: 1 }}>
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    Location / Address
                  </Typography>
                  <TextField
                    {...field}
                    placeholder="Street name or Area"
                    variant="outlined"
                    size="small"
                    error={!!errors.location}
                    helperText={errors.location ? errors.location.message : ""}
                    sx={{
                      width: "100%",
                    }}
                  />
                </Box>
              )}
            />

            {/* State UI */}
            <Controller
              name="stateRegion"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    State / Region
                  </Typography>
                  <TextField
                    {...field}
                    select
                    size="small"
                    error={!!errors.stateRegion}
                    helperText={
                      errors.stateRegion
                        ? errors.stateRegion.message
                        : "Please select your community's state"
                    }
                  >
                    {allNigerianStates.map((state) => (
                      <MenuItem key={state.id} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            />
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
              }}
              endIcon={<Forward />}
              type="submit"
            >
              Continue
            </Button>
          </Box>
        </Paper>

        {/* Setup Guide UI for Desktop */}
        <Box
          sx={{
            display: { xs: "block", md: "block" },
            p: 3,
            borderRadius: 1,
            border: "1px solid grey",
            mb: 2,
            width: { xs: "100%", md: "33%" },
          }}
        >
          <InfoOutlined />
          <Typography
            sx={{
              fontSize: { xs: 20, md: 28 },
              fontWeight: 600,
              color: "grey",
              mb: 2,
            }}
          >
            Setup Guide
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              mb: 3,
            }}
          >
            You are creating a gated estate/community profile. This will help
            you manage households, residents, vehicles, and guests with
            enterprise-grade precision.
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.5,
            }}
          >
            <CheckOutlined
              sx={{
                color: "green",
              }}
            />
            <Typography
              component="p"
              sx={{
                fontSize: { xs: 10, md: 12 },
              }}
            >
              Define legal entity name for official documents.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Icon>
              <CheckOutlined
                sx={{
                  color: "green",
                }}
              />
            </Icon>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: 10, md: 12 },
              }}
            >
              Localized settings for state-specific compliance.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default EstateForm;
