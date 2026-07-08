import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NewResidentSchema } from "./types";
import useAuthCheck from "../../../../../hooks/useAuthCheck";
import { useState } from "react";
import { InsertDriveFileOutlined, CheckOutlined } from "@mui/icons-material";
import { useImageUpload } from "../../../../../hooks/useImageUpload";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";

export const AddPrincipalResident = () => {
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

  // React Hook Form setup with Zod validation and React Redux integration
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewResidentSchema),
    defaultValues: {
      fullName: "",
      gender: "male",
      photoUrl: "",
      dateOfBirth: "",
      phone: "",
      email: "",
    },
  });

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: "text.secondary",
          fontSize: { xs: 12, md: 16 },
        }}
      >
        Specify the primary contact person for this household. You can create a
        new profile or link an existing resident from the estate database.
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
        }}
      >
        <Button>CREATE NEW RESIDENT</Button>
        <Button>LINK EXISTING RESIDENT</Button>
      </Stack>
      <Box>
        <Stack direction="row" spacing={2}>
          {/* Resident Photo UI */}
          <Box>
            <Controller
              name="photoUrl"
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
                      Resident Photo
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
                            alt="Resident photo"
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
                          A clear logo helps residents identify the official
                          gate pass and community communications.
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

                        {errors.photoUrl && (
                          <Typography
                            sx={{ fontSize: 12, color: "error.main", mt: 1 }}
                          >
                            {errors.photoUrl.message}
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
                            <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />{" "}
                            Logo verified and uploaded!
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                );
              }}
            />
          </Box>
          <Box></Box>
        </Stack>
      </Box>
    </Box>
  );
};
