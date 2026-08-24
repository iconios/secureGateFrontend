import {
  Close,
  SearchOutlined,
  CheckOutlined,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Avatar,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Drawer,
  Switch,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useImageUpload } from "../../../../../hooks/useImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";
import { EditPrincipalType } from "./types";
import Image from "next/image";
import { useGetAllNonPrincipalResidentsByHousehold } from "../../../../../hooks/useGetAllNonPrincipalResidentsByHousehold";
import { ChangePrincipalResident } from "./changePrincipalResident";
import { useSwapPrincipalResident } from "../../../../../hooks/useSwapPrincipalResident";
import { householdActions } from "../../../../../lib/features/household/householdSlice";
import { DeleteHouseholdRecord } from "./deleteHousehold";
import { EditHouseholdSuccess } from "./editHouseholdSuccess";
import { DeleteHouseholdSuccess } from "./deleteHouseholdSuccess";

type BooleanChangeHandler = (
  event: ChangeEvent<HTMLInputElement>,
  checked: boolean,
) => void;

type ChangePrincipalSuccessNotificationData = {
  message: string;
  unitDetails: string;
  principalFullName: string;
  totalResidents: string;
};

const UnitInfo = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box
      sx={{
        mb: 1.5,
      }}
    >
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
        {label}
      </Typography>
      <TextField
        value={value}
        fullWidth
        size="medium"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
    </Box>
  );
};

const TabSubTitle = ({ label }: { label: string }) => {
  return (
    <Typography
      variant="h3"
      sx={{
        color: "text.primary",
        fontSize: { xs: 14, md: 16 },
        fontWeight: 600,
        marginBottom: { xs: 1, md: 2 },
        textTransform: "uppercase",
        paddingTop: 3,
      }}
    >
      {label}
    </Typography>
  );
};

const AccessControlUnit = ({
  label,
  value,
  handleChange,
}: {
  label: string;
  value: boolean;
  handleChange: BooleanChangeHandler;
}) => {
  return (
    <FormControlLabel
      label={label}
      labelPlacement="start"
      control={<Switch checked={Boolean(value)} onChange={handleChange} />}
      sx={{
        width: "100%",
        justifyContent: "space-between",
        margin: 0,
      }}
    />
  );
};

const NotificationUnit = ({
  label,
  value,
  handleChange,
}: {
  label: string;
  value: boolean;
  handleChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}) => {
  return (
    <FormControlLabel
      label={label}
      control={<Checkbox checked={Boolean(value)} onChange={handleChange} />}
    />
  );
};

export const EditHouseholdDetails = ({
  handleClose,
  photoPreviewUrl,
  setPhotoPreviewUrl,
  activeTab,
  setActiveTab,
  isPending,
  isDirty,
}: {
  photoPreviewUrl: string;
  activeTab: number;
  isPending: boolean;
  isDirty: boolean;
  setPhotoPreviewUrl: (v: string) => void;
  handleClose: () => void;
  setActiveTab: (v: number) => void;
}) => {
  // Initialize local variables
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { insertEditHouseholdData } = householdActions;
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [openSuccessNotification, setOpenSuccessNotification] = useState(false);
  const [successData, setSuccessData] =
    useState<ChangePrincipalSuccessNotificationData | null>(null);

  //Get estate id, house code and block/street details
  const estateId =
    useSelector((state: RootState) => state.estate.estateId) ?? "";
  const {
    houseCode,
    unitNumber,
    blockOrStreet,
    photoUrl,
    householdId,
    principalResidentId,
    totalResidents,
  } = useSelector((state: RootState) => state.household);
  const { closeEditView } = householdActions;

  // Initialize the swap resident custom hook
  const mutation = useSwapPrincipalResident(estateId, householdId);
  const deletedHouseCode = houseCode;
  const deletedUnitNumber = unitNumber;
  const deletedBlockOrStreet = blockOrStreet;
  const deletedTotalResidents = totalResidents;

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

  const { control } = useFormContext<EditPrincipalType>();

  const [watchedUnitNumber, watchedBlockOrStreet] = useWatch({
    control,
    name: ["unitNumber", "blockOrStreet"],
  });

  const principalFullName = useWatch({
    control,
    name: "fullName",
  });

  useEffect(() => {
    const debounceFunction = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(debounceFunction);
  }, [searchTerm, setDebouncedSearchTerm]);

  // Get non-principal residents by household
  const {
    isError: nonPrincipalIsError,
    error: nonPrincipalError,
    data: nonPrincipalData,
    isPending: nonPrincipalIsPending,
    isFetching: nonPrincipalIsFetching,
  } = useGetAllNonPrincipalResidentsByHousehold(
    estateId,
    householdId,
    debouncedSearchTerm,
  );

  console.log("EditHouseholdDetails data", nonPrincipalData);
  const residents = nonPrincipalData?.nonPrincipalResidents;

  useEffect(() => {
    if (residents?.length === 0) return;

    if (residents?.[0]?.id) {
      setSelectedId(residents[0].id);
    }
  }, [residents, setSelectedId]);

  // Data object for the ChangePrincipalResident component
  const changePrincipalContent = {
    residents: residents ?? [],
    selectedId,
    searchTerm,
    setSearchTerm,
    setSelectedId,
    isPending: nonPrincipalIsPending || nonPrincipalIsFetching,
    isError: nonPrincipalIsError,
    error: nonPrincipalError,
  };

  // Handler for the ChangePrincipalResident Confirm Selection button
  const handleConfirmSelection = () => {
    if (!selectedId) return;

    mutation.mutate({
      oldPrincipalId: principalResidentId,
      newPrincipalId: selectedId,
    });
  };

  const swapPrincipalData = mutation.data;

  useEffect(() => {
    if (!mutation.isSuccess) return;

    dispatch(
      insertEditHouseholdData({
        ...swapPrincipalData?.data?.principal,
        principalResidentId: swapPrincipalData?.data?.principal.id,
      }),
    );
    // Close the Change Principal Resident window
    setOpenDialog(false);
    mutation.reset();

    // Set data for success notification
    setSuccessData({
      message: swapPrincipalData?.message ?? "",
      unitDetails: [
        swapPrincipalData?.data?.household.unitNumber,
        swapPrincipalData?.data?.household.blockOrStreet,
      ]
        .filter(Boolean)
        .join(" "),
      principalFullName: swapPrincipalData?.data?.principal.fullName ?? "",
      totalResidents: String(swapPrincipalData?.data?.totalResidents ?? 0),
    });

    // Open the success notification
    setOpenSuccessNotification(true);
  }, [
    setOpenDialog,
    mutation,
    dispatch,
    insertEditHouseholdData,
    swapPrincipalData,
  ]);

  // Close the success notification handler
  const handleCloseSuccessNotification = () => {
    setOpenSuccessNotification(false);
  };

  // Handler for success notification back button
  const successBackFn = () => {
    handleCloseSuccessNotification();
    dispatch(closeEditView());
  };

  return (
    <>
      {/* Header */}
      <Stack
        direction="row"
        aria-labelledby="edit-household-title"
        spacing={1}
        sx={{
          flexShrink: 0,
          px: 2.5,
          py: 2,
          minWidth: 0,
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ gap: 1, display: "flex", flexDirection: "row" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 16, md: 22 },
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Edit Household
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 16, md: 22 },
              fontWeight: 300,
              color: "text.secondary",
            }}
          >
            {houseCode}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <Close fontSize="medium" />
        </IconButton>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        aria-label="edit-household-tabs"
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        sx={{
          flexShrink: 0,
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab label="Unit Details" />
        <Tab label="Principal Resident" />
        <Tab label="Settings" />
      </Tabs>

      {/* Scrollable tab content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: { xs: 2, md: 2.5 },
        }}
      >
        {/* Current tab */}
        {activeTab === 0 && (
          <Box
            sx={{
              padding: { xs: 1, md: 2 },
            }}
          >
            <TabSubTitle label="unit information" />
            {/* Unt Number Textfield UI */}
            <Controller
              name="unitNumber"
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
                    Unit Number
                  </Typography>
                  <TextField
                    {...field}
                    placeholder="A-101"
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />

            {/* Block or Street Textfield UI */}
            <Controller
              name="blockOrStreet"
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
                    Block/Street
                  </Typography>
                  <TextField
                    {...field}
                    placeholder="Sapphire Block"
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />
            <UnitInfo
              label="House Label"
              value={`${watchedUnitNumber} ${watchedBlockOrStreet}`}
            />
            <Box>
              <TabSubTitle label="principal resident" />
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      padding: 1,
                      backgroundColor: "#DADEDF",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "#DADEDF",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={field.value || "Principal resident"}
                        height={isMobile ? 45 : 55}
                        width={isMobile ? 45 : 55}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Avatar
                        alt={field.value || "Principal resident"}
                        sx={{
                          width: isMobile ? 45 : 55,
                          height: isMobile ? 45 : 55,
                        }}
                      >
                        {field.value?.charAt(0).toUpperCase() || "?"}
                      </Avatar>
                    )}
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "text.primary",
                          fontSize: { xs: 14, md: 18 },
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {principalFullName}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setActiveTab(1);
                        }}
                      >
                        Change Resident
                      </Button>
                    </Box>
                  </Stack>
                )}
              />
            </Box>
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <TabSubTitle label="Change Principal Resident" />
            <TextField
              placeholder="Search for a resident to replace..."
              onClick={() => setOpenDialog(true)}
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: <SearchOutlined />,
                },
              }}
              size="medium"
              fullWidth
            />
            <TabSubTitle label="Resident Photo" />
            <Controller
              control={control}
              name="photoUrl"
              render={({ field, fieldState }) => {
                const handlePhotoChange = async (
                  event: ChangeEvent<HTMLInputElement>,
                ) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  const uploadResult = await handleFileUpload(file);

                  if (uploadResult) {
                    field.onChange(uploadResult.publicUrl);
                    setPhotoPreviewUrl(uploadResult.publicUrl);
                  }

                  // Allows the user to select the same file again.
                  event.target.value = "";
                };

                return (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      alignItems: { xs: "stretch", sm: "center" },
                      mb: { xs: 2, md: 3 },
                    }}
                  >
                    {/* Photo preview */}
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        height: 112,
                        border: "1.5px dashed",
                        borderColor: field.value ? "success.main" : "divider",
                        borderRadius: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.default",
                        color: "text.secondary",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={field.value || "Principal resident"}
                          height={isMobile ? 45 : 55}
                          width={isMobile ? 45 : 55}
                          style={{
                            objectFit: "fill",
                          }}
                        />
                      ) : (
                        <Avatar
                          alt={field.value || "Principal resident"}
                          sx={{
                            width: isMobile ? 45 : 55,
                            height: isMobile ? 45 : 55,
                          }}
                        >
                          {field.value?.charAt(0).toUpperCase() || "?"}
                        </Avatar>
                      )}
                    </Box>

                    <Box>
                      {/* Hidden input opened by the button below */}
                      <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="image/png,image/jpeg"
                        disabled={uploadLoading}
                        onChange={handlePhotoChange}
                      />

                      <Button
                        type="button"
                        variant="contained"
                        disabled={uploadLoading}
                        size="medium"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          color: "background.default",
                          borderRadius: 1,
                        }}
                      >
                        {uploadLoading ? "Uploading..." : "Upload New Photo"}
                      </Button>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        JPG or PNG. Exactly 80 × 80px. Max size 10KB.
                      </Typography>

                      {uploadLoading && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 12,
                            color: "primary.main",
                          }}
                        >
                          Verifying image and uploading...
                        </Typography>
                      )}

                      {uploadError && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 12,
                            color: "error.main",
                          }}
                        >
                          {uploadError}
                        </Typography>
                      )}

                      {fieldState.error && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 12,
                            color: "error.main",
                          }}
                        >
                          {fieldState.error.message}
                        </Typography>
                      )}

                      {field.value &&
                        photoPreviewUrl &&
                        !uploadLoading &&
                        !uploadError && (
                          <Typography
                            sx={{
                              mt: 1,
                              fontSize: 12,
                              color: "success.main",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                            Photo verified and uploaded!
                          </Typography>
                        )}
                    </Box>
                  </Stack>
                );
              }}
            />
            <TabSubTitle label="Personal Details" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Resident Full Name UI */}
              <Controller
                name="fullName"
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

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{
                  marginBottom: 2,
                }}
              >
                {/* Gender UI */}
                <Controller
                  name="gender"
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="dateOfBirth"
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
                          Date of Birth
                        </Typography>

                        <DatePicker
                          format="MM/DD/YYYY"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            field.onChange(
                              newValue?.isValid()
                                ? newValue.format("YYYY-MM-DD")
                                : "",
                            );
                          }}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              error: Boolean(fieldState.error),
                              helperText: fieldState.error?.message,
                            },
                            actionBar: {
                              actions: ["clear", "accept"],
                            },
                          }}
                        />
                      </Box>
                    )}
                  />
                </LocalizationProvider>
              </Stack>
            </Box>

            {/* Phone UI */}
            <Controller
              name="phone"
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
              name="email"
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
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <TabSubTitle label="Access Control" />
              <Controller
                name="mobileAccess"
                control={control}
                render={({ field }) => (
                  <AccessControlUnit
                    label="Enable Mobile App Access"
                    value={Boolean(field.value)}
                    handleChange={(_, checked) => field.onChange(checked)}
                  />
                )}
              />
              <Controller
                name="guestPreAuthorize"
                control={control}
                render={({ field }) => (
                  <AccessControlUnit
                    label="Allow Guest Pre-authorization"
                    value={Boolean(field.value)}
                    handleChange={(_, checked) => field.onChange(checked)}
                  />
                )}
              />
            </Box>

            <Box
              sx={{
                mb: 2,
              }}
            >
              <TabSubTitle label="Notification Preferences" />
              <Stack direction="column" spacing={1}>
                <Controller
                  name="guestArrivalNotify"
                  control={control}
                  render={({ field }) => (
                    <NotificationUnit
                      label="Notify on Guest Arrival"
                      value={Boolean(field.value)}
                      handleChange={(_, checked) => field.onChange(checked)}
                    />
                  )}
                />
                <Controller
                  name="emergencyAlerts"
                  control={control}
                  render={({ field }) => (
                    <NotificationUnit
                      label="Emergency Alerts"
                      value={Boolean(field.value)}
                      handleChange={(_, checked) => field.onChange(checked)}
                    />
                  )}
                />
              </Stack>
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<Delete color="error" />}
            onClick={() => {
              setOpenDelete(true);
            }}
            sx={{ flexShrink: 0, borderColor: "red", color: "red" }}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isPending}
            onClick={handleClose}
            sx={{ flexShrink: 0 }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ flex: 1 }}
            disabled={isPending || !isDirty}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>

      {/* Change Principal Resident modal */}
      {isMobile ? (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 16, md: 22 },
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Change Principal Resident
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 14, md: 20 },
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              Household: {houseCode}, {blockOrStreet}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <ChangePrincipalResident {...changePrincipalContent} />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenDialog(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmSelection}
              loading={mutation.isPending}
            >
              Confirm Selection
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Drawer
          anchor="right"
          open={openDialog}
          onClose={() => setOpenDialog(false)}
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
                paddingTop: 12,
                paddingX: 2,
              },
            },
          }}
        >
          <Box
            component="form"
            onSubmit={() => {}}
            sx={{
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                marginBottom: 3,
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: { xs: 16, md: 22 },
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Change Principal Resident
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 14, md: 20 },
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                Household: {houseCode}
              </Typography>
            </Box>
            <ChangePrincipalResident {...changePrincipalContent} />
            <Stack
              direction="row"
              sx={{
                marginTop: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenDialog(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmSelection}
                loading={mutation.isPending}
              >
                Confirm Selection
              </Button>
            </Stack>
          </Box>
        </Drawer>
      )}

      {/* Delete Household Dialog Box */}
      <DeleteHouseholdRecord
        open={openDelete}
        setOpen={setOpenDelete}
        onDeleteSuccess={() => setOpenDeleteSuccess(true)}
      />

      {/* Successful Updated Household Notification */}
      {successData && (
        <EditHouseholdSuccess
          open={openSuccessNotification}
          setOpen={handleCloseSuccessNotification}
          subTitle={successData.message}
          backButtonName="Back to Households"
          backFunction={successBackFn}
          unitDetails={successData.unitDetails}
          principalFullName={successData.principalFullName}
          totalResidents={successData.totalResidents}
        />
      )}

      {/* Successful deletion UI */}
      <DeleteHouseholdSuccess
        open={openDeleteSuccess}
        onDismiss={() => {}}
        houseCode={deletedHouseCode}
        unitNumber={deletedUnitNumber}
        blockOrStreet={deletedBlockOrStreet}
        totalResidents={deletedTotalResidents}
      />
    </>
  );
};
