"use client";

import { GroupsOutlined, House } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateHouseholdFormInput, CreateHouseholdPayload } from "./types";
import { useEffect } from "react";
import { PrincipalResidentSkeleton } from "./skeletonPrincipalResidentReview";

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

export const AddReviewAndSubmit = ({
  fetchedResidents,
  shouldFetchExistingResidents,
  setShouldFetchExistingResidents,
  isFetching,
}: {
  fetchedResidents:
    | {
        id: string;
        fullName: string;
        phone: string;
        email: string;
        photoUrl: string;
      }[]
    | [];
  shouldFetchExistingResidents: boolean;
  setShouldFetchExistingResidents: (v: boolean) => void;
  isFetching: boolean;
}) => {
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

  useEffect(() => {
    setShouldFetchExistingResidents(true);
  }, [setShouldFetchExistingResidents]);

  type MemberFormValue = (typeof members)[number];

  const memeberEntity = (person: MemberFormValue) => {
    if (person.mode === "link" && shouldFetchExistingResidents && !isFetching) {
      return fetchedResidents.find((item) => item.id === person.personId);
    }

    return undefined;
  };

  const principalEntity = () => {
    if (
      principalResident.mode === "link" &&
      shouldFetchExistingResidents &&
      !isFetching
    ) {
      return fetchedResidents.find(
        (person) => person.id === principalResident.personId,
      );
    }

    return undefined;
  };

  const principalFullname = () => {
    if (principalResident.mode === "create") return principalResident.fullName;

    return principalEntity()?.fullName;
  };

  const memberFullname = (person: MemberFormValue) => {
    if (person.mode === "create") return person.fullName;

    return memeberEntity(person)?.fullName;
  };

  const principalEmail = () => {
    if (principalResident.mode === "create") return principalResident.email;

    const person = principalEntity();
    return person?.email;
  };

  const principalPhone = () => {
    if (principalResident.mode === "create") return principalResident.phone;

    const person = principalEntity();
    return person?.phone;
  };

  const principalPhotoUrl = () => {
    if (principalResident.mode === "create") return principalResident.photoUrl;

    const person = principalEntity();
    return person?.photoUrl;
  };

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
            {isFetching ? (
              <PrincipalResidentSkeleton />
            ) : (
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
                  src={principalPhotoUrl() ?? ""}
                  alt={principalFullname() ?? "Principal resident"}
                  width={45}
                  height={45}
                />
                <Box>
                  <SummaryItem
                    label="principal resident"
                    value={principalFullname() ?? "Principal resident"}
                    primary
                  />
                </Box>
              </Stack>
            )}
            <Box>
              <SummaryItem
                label="contact details"
                value={principalEmail() ?? "Principal email"}
                optionalValue={principalPhone() ?? "Principal phone"}
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
              {members.length > 0 &&
                members.map((person, index) => {
                  const keyId =
                    person.mode === "link"
                      ? person.personId
                      : (person.photoUrl ?? `created-member-${index}`);

                  return (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                      key={keyId}
                    >
                      {memberFullname(person) ?? "Member name"}
                    </Typography>
                  );
                })}
            </Box>
            <Box>
              <SummaryOtherTitle title="VEHICLES (1)" />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 400,
                  textAlign: "center",
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
