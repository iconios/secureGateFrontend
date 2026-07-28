"use client";

import {
  AddAPhotoOutlined,
  CheckOutlined,
  Delete,
  Edit,
  PersonAddAlt1Outlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Stack,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import useAuthCheck from "../../../../../hooks/useAuthCheck";
import { SyntheticEvent, useEffect, useState } from "react";
import {
  CreateHouseholdFormInput,
  CreateHouseholdPayload,
  ResidentFormInput,
  ResidentPayload,
  ResidentSchema,
} from "./types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { useImageUpload } from "../../../../../hooks/useImageUpload";
import { useGetAllNonPrincipalsByEstate } from "../../../../../hooks/useGetAllNonPrincipalsByEstate";
import { zodResolver } from "@hookform/resolvers/zod";

export const AddMemberResident = () => {
  // Local state for image preview URL and check authentication state
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>("");
  useAuthCheck();

  // Other local state variables
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const estateId = useSelector((state: RootState) => state.estate.estateId);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  // React Hook Form context
  const { control: householdControl } = useFormContext<
    CreateHouseholdFormInput,
    unknown,
    CreateHouseholdPayload
  >();

  const { fields, append, update, remove } = useFieldArray({
    control: householdControl,
    name: "households.0.members",
  });

  const registeredMembers =
    useWatch({
      control: householdControl,
      name: "households.0.members",
    }) ?? [];

  const memberForm = useForm<ResidentFormInput, unknown, ResidentPayload>({
    mode: "onBlur",
    resolver: zodResolver(ResidentSchema),
    defaultValues: {
      mode: "create",
      fullName: "",
      email: "",
      phone: "",
      gender: "male",
      photoUrl: "",
      dateOfBirth: "",
    },
  });

  const {
    control: memberControl,
    handleSubmit: handleMemberSubmit,
    reset: resetMemberForm,
    setValue: setMemberValue,
    formState: { errors: memberErrors },
  } = memberForm;

  const memberMode = useWatch({
    control: memberControl,
    name: "mode",
  });

  const resetMemberDraft = () => {
    resetMemberForm({
      mode: "create",
      fullName: "",
      email: "",
      phone: "",
      gender: "male",
      photoUrl: "",
      dateOfBirth: "",
    });

    setPhotoPreviewUrl("");
    setEditingIndex(null);
  };

  const resetToCreatedMember = () => {
    resetMemberForm({
      mode: "create",
      fullName: "",
      email: "",
      phone: "",
      gender: "male",
      photoUrl: "",
      dateOfBirth: "",
    });
  };

  const resetToLinkedMember = () => {
    resetMemberForm({
      mode: "link",
      personId: "",
    });
  };

  const handleEditMember = (index: number) => {
    const member = registeredMembers[index];

    if (!member) {
      return;
    }

    setEditingIndex(index);

    if (member.mode === "create") {
      resetMemberForm({
        mode: "create",
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        gender: member.gender,
        photoUrl: member.photoUrl,
        dateOfBirth: member.dateOfBirth,
      });

      setPhotoPreviewUrl(member.photoUrl);
      return;
    }

    resetMemberForm({
      mode: "link",
      personId: member.personId,
    });

    setPhotoPreviewUrl("");
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const saveMember = (member: ResidentPayload) => {
    if (editingIndex === null) {
      append(member);
    } else {
      update(editingIndex, member);
    }

    resetMemberDraft();
  };

  // Local state and handler for Tabs
  const handleTabChange = (_: SyntheticEvent, newTab: "create" | "link") => {
    if (newTab === "create") {
      resetToCreatedMember();
    } else {
      resetToLinkedMember();
    }

    setEditingIndex(null);
    setPhotoPreviewUrl("");
  };

  const selectedPersonId = useWatch({
    control: memberControl,
    name: "personId",
  });

  const shouldFetchExistingResidents =
    memberMode === "link" && Boolean(estateId);

  const { isError, error, data, isSuccess, isLoading, isFetching, refetch } =
    useGetAllNonPrincipalsByEstate(
      estateId,
      "1",
      "20",
      debounceSearchTerm,
      shouldFetchExistingResidents,
    );
  const fetchedResidents =
    data && "nonPrincipals" in data ? data.nonPrincipals : [];
  console.log({
    shouldFetchExistingResidents,
    estateId,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    rawData: data,
    fetchedResidents,
    fetchedResidentsLength: fetchedResidents.length,
  });

  // Get user id
  const user = useSelector(
    (state: RootState) => (state as RootState).auth.user,
  );
  const userId = user && "id" in user ? user.id : "";
  // useImageUpload hook for handling image uploads and validations
  const {
    handleFileUpload,
    error: uploadError,
    loading: uploadLoading,
  } = useImageUpload({ userId });

  useEffect(() => {
    const delayDebounceFunction = setTimeout(() => {
      setDebounceSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(delayDebounceFunction);
  }, [searchTerm]);

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
        Optional: Register occupants for digital gate passes
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
          value={memberMode}
          onChange={handleTabChange}
          aria-label="action-tabs"
        >
          <Tab label="ADD NEW MEMBER" {...a11yProps(0)} value="create" />
          <Tab label="LINK EXISTING MEMBER" {...a11yProps(1)} value="link" />
        </Tabs>
      </Box>
      {memberMode === "create" && (
        <Box sx={{ marginTop: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            {/* Resident Photo UI */}
            <Box sx={{ flexShrink: 0 }}>
              <Controller
                name="photoUrl"
                control={memberControl}
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
                              setPhotoPreviewUrl(uploadResult.publicUrl);
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
                            <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />{" "}
                            Photo verified and uploaded!
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
                name="fullName"
                control={memberControl}
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
                  name="gender"
                  control={memberControl}
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
                  name="dateOfBirth"
                  control={memberControl}
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
              name="phone"
              control={memberControl}
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
              name="email"
              control={memberControl}
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
          <Button
            startIcon={<PersonAddAlt1Outlined />}
            variant="contained"
            onClick={handleMemberSubmit(saveMember)}
            sx={{
              color: "primary.contrastText",
              width: "100%",
            }}
          >
            {editingIndex === null ? "Add Member to List" : "Update Member"}
          </Button>
        </Box>
      )}
      {memberMode === "link" && (
        <>
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
                <Typography>{error.message}</Typography>
                <Button variant="contained" onClick={() => refetch()}>
                  Refetch
                </Button>
              </Box>
            )}
            {shouldFetchExistingResidents && (isLoading || isFetching) && (
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

            {/** Radio items list */}
            <RadioGroup
              value={selectedPersonId ?? ""}
              onChange={(event) => {
                // set members as an array of link objects to satisfy expected type
                setMemberValue("personId", event.target.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            >
              {fetchedResidents.map(
                (item: { id: string; fullName: string; phone: string }) => {
                  const isSelected = selectedPersonId === item.id;

                  return (
                    <Paper
                      key={item.id}
                      elevation={isSelected ? 3 : 0}
                      onClick={() => {
                        setMemberValue("personId", item.id, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
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
          {memberMode === "link" &&
            "personId" in memberErrors &&
            memberErrors.personId && (
              <Typography color="error">
                {memberErrors.personId.message}
              </Typography>
            )}
          <Button
            startIcon={<PersonAddAlt1Outlined />}
            variant="contained"
            onClick={handleMemberSubmit(saveMember)}
            sx={{
              color: "primary.contrastText",
              width: "100%",
            }}
          >
            {editingIndex === null ? "Add Member to List" : "Update Member"}
          </Button>
        </>
      )}

      <Typography
        variant="h2"
        sx={{
          paddingTop: 4,
          paddingBottom: 2,
          fontWeight: 600,
          fontSize: { xs: 12, md: 16 },
        }}
      >
        REGISTERED MEMBERS ({fields.length})
      </Typography>

      {fields.map((field, index) => {
        const member = registeredMembers[index];
        if (!member) {
          return null;
        }

        const linkedResident =
          member.mode === "link"
            ? fetchedResidents.find(
                (resident) => resident.id === member.personId,
              )
            : undefined;

        const fullName =
          member.mode === "create"
            ? member.fullName
            : (linkedResident?.fullName ?? "Linked resident");

        const email = member.mode === "create" ? member.email : "";

        const phone =
          member.mode === "create"
            ? member.phone
            : (linkedResident?.phone ?? "");

        const initials = fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join("");

        return (
          <Box key={field.id} sx={{ mb: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                padding: 1,
                border: "1px solid grey",
                borderRadius: 1,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      height: { xs: 45, md: 55 },
                      width: { xs: 45, md: 55 },
                      borderRadius: "50%",
                      backgroundColor: "lightblue",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 16, md: 20 },
                        color: "primary.main",
                      }}
                    >
                      {initials}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        fontSize: { xs: 14, md: 18 },
                        fontWeight: 500,
                      }}
                    >
                      {fullName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: 12, md: 15 },
                      }}
                    >
                      {email ?? ""}
                    </Typography>
                    {isMobile && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: 12, md: 15 },
                        }}
                      >
                        {phone}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {!isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {phone}
                  </Typography>
                )}
                <Box>
                  <IconButton onClick={() => handleEditMember(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => remove(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
