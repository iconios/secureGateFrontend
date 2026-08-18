"use client";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { AddHouseholdSuccessData } from "./types";
import {
  Close,
  Check,
  ArrowBack,
  FlashOnOutlined,
  AddHomeOutlined,
  PersonAddOutlined,
  HomeOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../lib/store";

const SummaryItem = ({
  label,
  value,
  image,
  fullNameInitials,
}: {
  label: string;
  value: string;
  image?: {
    src: string;
    alt: string;
  };
  fullNameInitials?: string;
}) => {
  const hasImage = Boolean(image?.src);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: { xs: 12, md: 14 },
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>

      {image ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
          }}
        >
          <Avatar
            src={hasImage ? image.src : undefined}
            alt={image.alt}
            sx={{
              height: 24,
              width: 24,
              fontSize: 11,
            }}
          >
            {!hasImage ? fullNameInitials || "NA" : undefined}
          </Avatar>

          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 12, md: 14 },
              fontWeight: 500,
            }}
          >
            {value}
          </Typography>
        </Stack>
      ) : (
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 12, md: 14 },
            fontWeight: 500,
            textAlign: "right",
          }}
        >
          {value}
        </Typography>
      )}
    </Stack>
  );
};

export const AddOneHouseholdSuccess = ({
  open,
  onClose,
  subTitle,
  backButtonName,
  onBack,
  onAddAnother,
}: AddHouseholdSuccessData) => {
  // Initialize local variables
  const {
    houseCode,
    unitNumber,
    blockOrStreet,
    fullName,
    totalMembers,
    photoUrl,
  } = useSelector((state: RootState) => state.household);

  const safeFullName = fullName ?? "";
  const unitDetails = [unitNumber, blockOrStreet].filter(Boolean).join(", ");
  const image = {
    src: photoUrl ?? "",
    alt: safeFullName,
  };

  const [firstName = "", lastName = ""] = safeFullName.split(" ");
  const initials = `${(firstName.charAt(0) ?? "").toUpperCase()}${(lastName.charAt(0) ?? "").toUpperCase()}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          paddingBlock: 2,
          width: "100%",
          backgroundColor: "#CCE7C9",
          mb: 2,
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
          aria-label="Close success dialog"
          onClick={onClose}
        >
          <Close fontSize="medium" />
        </IconButton>
        <Box
          sx={{
            padding: 1.5,
            borderRadius: "50%",
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
            mb: 2,
            border: "3px solid",
            borderColor: "#E8E8E8",
            backgroundColor: "#E8E8E8",
          }}
        >
          <Check color="success" fontSize="large" />
        </Box>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Household Added Successfully
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 13, md: 16 },
            textAlign: "center",
          }}
        >
          {subTitle}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 2,
        }}
      >
        <Grid container spacing={1}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              p: 1,
              backgroundColor: "#F0F0F0",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                my: 2,
                pb: 2,
              }}
            >
              <HomeOutlined fontSize="medium" />
              <Typography
                sx={{
                  color: "text.primary",
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: 13, md: 16 },
                }}
              >
                Household Summary
              </Typography>
            </Stack>

            <SummaryItem label="Household Code" value={houseCode} />

            <SummaryItem label="Unit" value={unitDetails} />

            <SummaryItem
              label="Principal Resident"
              value={fullName}
              image={image}
              fullNameInitials={initials}
            />

            <SummaryItem label="Total Members" value={`${totalMembers}`} />
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              p: 1,
              backgroundColor: "#F0F0F0",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                my: 2,
                pb: 2,
              }}
            >
              <FlashOnOutlined fontSize="medium" />
              <Typography
                sx={{
                  color: "text.primary",
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: 13, md: 16 },
                }}
              >
                What&apos;s Next?
              </Typography>
            </Stack>

            <Button
              startIcon={<AddHomeOutlined fontSize="medium" />}
              onClick={onAddAnother}
              variant="text"
            >
              Add another household
            </Button>

            <Button
              startIcon={<PersonAddOutlined fontSize="medium" />}
              onClick={() => {}}
              variant="text"
              disabled
            >
              Add more household members
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#E8E8E8",
          padding: 2,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            flexGrow: 1,
          }}
          onClick={onBack}
        >
          {backButtonName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
