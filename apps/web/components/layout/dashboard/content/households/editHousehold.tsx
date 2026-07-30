import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";

const UnitInfo = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "text.secondary",
          fontSize: { xs: 12, md: 18 },
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <TextField
        value={value}
        fullWidth
        size="medium"
        sx={{
          padding: 1,
        }}
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
        color: "text.secondary",
        fontSize: { xs: 14, md: 20 },
        fontWeight: 500,
        marginBottom: { xs: 1, md: 2 },
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
  );
};

export const EditHousehold = ({
  unitNumber,
  blockOrStreet,
  photoUrl,
  fullName,
  gender,
  dateOfBirth,
  phone,
  email,
  houseCode,
}: {
  unitNumber: string;
  blockOrStreet: string;
  photoUrl: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  houseCode: string;
}) => {
  // Initialize local variables
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const EditHouseholdDetails = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{
            marginBottom: 3,
            marginTop: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ gap: 2 }}>
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
        <hr />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="edit-household-tabs"
        >
          <Tab label="Unit Details" />
          <Tab label="Principal Resident" />
          <Tab label="Settings" />
        </Tabs>
        {value === 0 && (
          <Box
            sx={{
              padding: { xs: 1, md: 2 },
            }}
          >
            <TabSubTitle label="unit information" />
            <UnitInfo label="Unit Number" value={unitNumber} />
            <UnitInfo label="Block/Street" value={blockOrStreet} />
            <UnitInfo
              label="House Label"
              value={`${unitNumber} ${blockOrStreet}`}
            />
            <Box>
              <TabSubTitle label="principal resident" />
              <Stack direction="row" spacing={1}>
                <Image
                  src={photoUrl}
                  alt={fullName}
                  height={isMobile ? 45 : 55}
                  width={isMobile ? 45 : 55}
                />
                <Box
                  sx={{
                    padding: 1,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: 14, md: 18 },
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {fullName}
                  </Typography>
                  <Button variant="text" color="primary" onClick={() => {}}>
                    Change Resident
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}
        {value === 1 && <Box></Box>}
      </Box>
    );
  };

  return (
    <>
      {isMobile ? (
        <Modal open={open} onClose={handleClose}>
          <EditHouseholdDetails />
        </Modal>
      ) : (
        <Drawer anchor="right" open={open} onClose={handleClose}>
          <EditHouseholdDetails />
        </Drawer>
      )}
    </>
  );
};
