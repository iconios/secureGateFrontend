"use client";

import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CreateHouseholdFormInput, CreateHouseholdPayload } from "./types";
import useAuthCheck from "../../../../../hooks/useAuthCheck";
import { SyntheticEvent, useEffect } from "react";
import {
  CheckOutlined,
  AddAPhotoOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useImageUpload } from "../../../../../hooks/useImageUpload";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const AddPrincipalResident = ({
  photoPreviewUrl,
  setPhotoPreviewUrl,
  searchTerm,
  setSearchTerm,
  fetchedResidents,
  isError,
  error,
  isSuccess,
  isLoading,
  isFetching,
  refetch,
  setShouldFetchExistingResidents,
  shouldFetchExistingResidents,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  fetchedResidents:
    | {
        id: string;
        fullName: string;
        phone: string;
        email: string;
        photoUrl: string;
      }[]
    | [];
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  setShouldFetchExistingResidents: (v: boolean) => void;
  shouldFetchExistingResidents: boolean;
  photoPreviewUrl: string;
  setPhotoPreviewUrl: (v: string) => void;
}) => {
  useAuthCheck();

  // Other local state variables
  const estateId = useSelector((state: RootState) => state.estate.estateId);

  // React Hook Form context
  const { setValue, control, clearErrors } = useFormContext<
    CreateHouseholdFormInput,
    unknown,
    CreateHouseholdPayload
  >();

  // Local state and handler for Tabs
  const principalMode =
    useWatch({
      control,
      name: "households.0.principalResident.mode",
    }) ?? "create";
  const tabValue = principalMode === "create" ? 0 : 1;
  const handleTabChange = (_: SyntheticEvent, nextTab: number) => {
    const nextMode = nextTab === 0 ? "create" : "link";

    if (nextMode === "create") {
      setValue(
        "households.0.principalResident",
        {
          mode: "create",
          fullName: "",
          email: "",
          phone: "",
          gender: "male",
          photoUrl: "",
          dateOfBirth: "",
        },
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false,
        },
      );
    } else {
      setValue(
        "households.0.principalResident",
        {
          mode: "link",
          personId: "",
        },
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false,
        },
      );
    }
    clearErrors("households.0.principalResident");
    setPhotoPreviewUrl("");
  };

  // Local state and handler for selectId and personId change
  const selectedId =
    useWatch({
      control,
      name: "households.0.principalResident.personId",
    }) ?? "";

  useEffect(() => {
    setShouldFetchExistingResidents(tabValue === 1 && !!estateId);
  }, [tabValue, estateId, setShouldFetchExistingResidents]);

  // Get user id
  const user = useSelector((state: unknown) => (state as RootState).auth.user);
  const userId = user && "id" in user ? user.id : "";
  // useImageUpload hook for handling image uploads and validations
  const {
    handleFileUpload,
    error: uploadError,
    loading: uploadLoading,
  } = useImageUpload({ userId });

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: "text.secondary",
          fontSize: { xs: 12, md: 16 },
          pt: 1.5,
          textAlign: "center",
        }}
      >
        Specify the primary contact person for this household. You can create a
        new profile or link an existing resident from the estate database.
      </Typography>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          justifyContent: "center",
          display: "flex",
          mx: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="action-tabs"
        >
          <Tab label="CREATE NEW RESIDENT" {...a11yProps(0)} />
          <Tab label="LINK EXISTING RESIDENT" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          {/* Resident Photo UI */}
          <Box sx={{ flexShrink: 0 }}>
            <Controller
              name="households.0.principalResident.photoUrl"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <Box
                      component="label"
                      sx={{
                        width: { xs: "100%", md: 180 },
                        height: 112,
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
                      {photoPreviewUrl ? (
                        <Box
                          component="img"
                          src={photoPreviewUrl}
                          alt="Resident photo"
                          onError={() => {
                            console.error(
                              "Photo preview failed:",
                              photoPreviewUrl,
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
                          <AddAPhotoOutlined sx={{ fontSize: 24, mb: 0.5 }} />

                          <Typography
                            sx={{
                              fontSize: 10,
                              fontWeight: 500,
                              textAlign: "center",
                              lineHeight: 1.2,
                              textTransform: "uppercase",
                            }}
                          >
                            Upload photo
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
                            setPhotoPreviewUrl(uploadResult.publicUrl); // Update local state with the public URL for preview
                          }
                        }}
                      />
                    </Box>
                    <Box>
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
                        {uploadLoading && "Uploading..."}
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

                      {fieldState.error && (
                        <Typography
                          sx={{ fontSize: 12, color: "error.main", mt: 1 }}
                        >
                          {fieldState.error.message}
                        </Typography>
                      )}

                      {/* Safe check: Using field.value directly ensures instant synchronization */}
                      {field.value && photoPreviewUrl && !uploadLoading && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "success.main",
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} /> Photo
                          verified and uploaded!
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Resident Full Name UI */}
            <Controller
              name="households.0.principalResident.fullName"
              control={control}
              render={({ field, fieldState }) => (
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      mb: 1,
                      color: "text.secondary",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    {...field}
                    placeholder="Jonathan Aris"
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              {/* Gender UI */}
              <Controller
                name="households.0.principalResident.gender"
                control={control}
                render={({ field, fieldState }) => (
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <Typography
                      component="label"
                      sx={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        mb: 1,
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Gender
                    </Typography>
                    <TextField
                      {...field}
                      placeholder="Select"
                      variant="outlined"
                      select
                      size="small"
                      fullWidth
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                    >
                      {[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ].map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              />

              {/** Date of Birth UI */}
              <Controller
                name="households.0.principalResident.dateOfBirth"
                control={control}
                render={({
                  field: { onChange: fieldOnChange, value },
                  fieldState,
                }) => (
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <Typography
                      component="label"
                      sx={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        mb: 1,
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Date of Birth
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="MM/DD/YYYY"
                        value={value ? dayjs(value) : null}
                        onChange={(newValue) => {
                          fieldOnChange(
                            newValue ? newValue.format("YYYY-MM-DD") : "",
                          );
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            error: Boolean(fieldState.error),
                            helperText: fieldState.error?.message,
                            fullWidth: true,
                          },
                          actionBar: {
                            actions: ["clear", "accept"],
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                )}
              />
            </Stack>
          </Box>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          sx={{
            mb: 3,
          }}
        >
          {/* Phone UI */}
          <Controller
            name="households.0.principalResident.phone"
            control={control}
            render={({ field, fieldState }) => (
              <Box sx={{ mb: { xs: 2, md: 3 }, flex: 1 }}>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    mb: 1,
                    color: "text.secondary",
                    textTransform: "uppercase",
                  }}
                >
                  Phone Number
                </Typography>
                <TextField
                  {...field}
                  placeholder="08012345678"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              </Box>
            )}
          />

          {/* Email address UI */}
          <Controller
            name="households.0.principalResident.email"
            control={control}
            render={({ field, fieldState }) => (
              <Box sx={{ mb: { xs: 2, md: 3 }, flex: 1 }}>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    mb: 1,
                    color: "text.secondary",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  {...field}
                  placeholder="jonathan@example.com"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              </Box>
            )}
          />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ maxWidth: 600, width: "100%", mx: "auto", p: 2 }}>
          {/** Header Row */}
          <Grid
            container
            sx={{
              px: 2,
              pb: 1,
              borderBottom: "2px solid",
              borderColor: "divider",
            }}
          >
            <Grid size={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                SELECT
              </Typography>
            </Grid>
            <Grid size={5}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                FULL NAME
              </Typography>
            </Grid>
            <Grid size={5} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                PHONE NUMBER
              </Typography>
            </Grid>
          </Grid>

          {isError && (
            <Box>
              <Typography>{error?.message}</Typography>
              <Button variant="contained" onClick={() => refetch()}>
                Refetch
              </Button>
            </Box>
          )}
          {shouldFetchExistingResidents &&
            isSuccess &&
            !isError &&
            fetchedResidents?.length === 0 && (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  py: 3,
                  fontSize: 14,
                }}
              >
                No matching resident found.
              </Typography>
            )}
          {shouldFetchExistingResidents && isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <CircularProgress size={40} sx={{ color: "primary.main" }} />
            </Box>
          )}

          {/** Radio items list */}
          <RadioGroup
            value={selectedId}
            onChange={(event) => {
              setValue(
                "households.0.principalResident.personId",
                event.target.value,
                {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                },
              );
            }}
          >
            {fetchedResidents.map(
              (item: { id: string; fullName: string; phone: string }) => {
                const isSelected = selectedId === item.id;

                return (
                  <Paper
                    key={item.id}
                    elevation={isSelected ? 3 : 0}
                    onClick={() => {
                      setValue(
                        "households.0.principalResident.personId",
                        item.id,
                        {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        },
                      );
                    }}
                    sx={{
                      mt: 1,
                      p: 1,
                      cursor: "pointer",
                      border: "1px solid",
                      borderRadius: 1,
                      borderColor: isSelected ? "primary.main" : "divider",
                      backgroundColor: isSelected
                        ? "action.selected"
                        : "background.paper",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.light",
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Grid container sx={{ alignItems: "center" }}>
                      <Grid
                        size={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControlLabel
                          value={item.id}
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                      </Grid>

                      <Grid size={5}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: isSelected ? 600 : 400 }}
                        >
                          {item.fullName}
                        </Typography>
                      </Grid>

                      <Grid size={5}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: isSelected ? 600 : 400 }}
                        >
                          {item.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              },
            )}
          </RadioGroup>
        </Box>
      </CustomTabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3, paddingBottom: 0, paddingX: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
