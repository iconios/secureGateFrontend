"use client";

import { GroupsOutlined, House } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateHouseholdFormInput, CreateHouseholdPayload } from "./types";

const SummaryItem = ({
  label,
  value,
  optionalValue,
  primary,
}: {
  label: string;
  value: string;
  optionalValue?: string;
  primary?: boolean;
}) => {
  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          color: "text.primary",
          fontSize: { xs: 10, md: 12 },
          fontWeight: 600,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontSize: { xs: primary ? 14 : 12, md: primary ? 16 : 14 },
          textAlign: "center",
        }}
      >
        {value}
      </Typography>
      {optionalValue && (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: primary ? 14 : 12, md: primary ? 16 : 14 },
            textAlign: "center",
          }}
        >
          {optionalValue}
        </Typography>
      )}
    </Box>
  );
};

const SummarySectionTitle = ({ title }: { title: string }) => {
  return (
    <Typography
      variant="h2"
      sx={{
        color: "background.default",
        fontSize: { xs: 14, md: 18 },
        fontWeight: 500,
      }}
    >
      {title}
    </Typography>
  );
};

const SummaryOtherTitle = ({ title }: { title: string }) => {
  return (
    <Typography
      variant="h2"
      sx={{
        color: "text.primary",
        fontSize: { xs: 10, md: 12 },
        fontWeight: 600,
      }}
    >
      {title}
    </Typography>
  );
};

export const AddReviewAndSubmit = () => {
  const { control: unitControl } = useFormContext<
    CreateHouseholdFormInput,
    unknown,
    CreateHouseholdPayload
  >();
  const unitDetails = useWatch({
    control: unitControl,
    name: "households.0.house",
  });

  const principalResident = useWatch({
    control: unitControl,
    name: "households.0.principalResident",
  });

  const members =
    useWatch({
      control: unitControl,
      name: "households.0.members",
    }) ?? [];

  return (
    <Box sx={{ paddingX: { xs: 1, md: 2 } }}>
      <Typography
        variant="h2"
        sx={{
          color: "text.primary",
          mb: 1,
          fontSize: { xs: 16, md: 22 },
          fontWeight: 700,
        }}
      >
        Final Verification
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 3,
          fontSize: { xs: 14, md: 18 },
          fontWeight: 400,
        }}
      >
        Please review the summarized details below before finalizing the
        household creation.
      </Typography>
      <Box
        sx={{
          border: "1px solid grey",
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            backgroundColor: "#708090",
            paddingY: 2,
            paddingX: 1,
            borderTopRightRadius: 7,
            borderTopLeftRadius: 7,
          }}
        >
          <House sx={{ color: "background.default", fontSize: 22 }} />
          <SummarySectionTitle title="Unit Summary" />
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            paddingX: 1,
            paddingY: 2,
          }}
        >
          <SummaryItem
            label="unit number"
            value={unitDetails.unitNumber}
            primary
          />

          <SummaryItem label="location" value={unitDetails.blockOrStreet} />
        </Stack>
      </Box>
      <Box
        sx={{
          border: "1px solid grey",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            backgroundColor: "#708090",
            paddingY: 2,
            paddingX: 1,
            borderTopRightRadius: 6,
            borderTopLeftRadius: 6,
          }}
        >
          <GroupsOutlined sx={{ color: "background.default", fontSize: 22 }} />
          <SummarySectionTitle title="Registered Members" />
        </Stack>
        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingY: 2,
              paddingX: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={
                  principalResident.mode === "create"
                    ? principalResident.photoUrl
                    : ""
                }
                alt={
                  principalResident.mode === "create"
                    ? principalResident.fullName
                    : ""
                }
                width={45}
                height={45}
              />
              <Box>
                <SummaryItem
                  label="principal resident"
                  value={
                    principalResident.mode === "create"
                      ? principalResident.fullName
                      : "Principal Resident"
                  }
                  primary
                />
              </Box>
            </Stack>
            <Box>
              <SummaryItem
                label="contact details"
                value={
                  principalResident.mode === "create"
                    ? principalResident.email
                    : "Principal Email"
                }
                optionalValue={
                  principalResident.mode === "create"
                    ? principalResident.phone
                    : "Principal Phone"
                }
              />
            </Box>
          </Stack>
          <hr />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 1,
            }}
          >
            <Box>
              <SummaryOtherTitle
                title={`ADDITIONAL RESIDENTS (${members.length})`}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 400,
                }}
              >
                Sarah James
              </Typography>
            </Box>
            <Box>
              <SummaryOtherTitle title="VEHICLES (1)" />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 400,
                }}
              >
                Comming soon
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
