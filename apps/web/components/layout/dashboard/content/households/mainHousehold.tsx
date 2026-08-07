"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { useFetchedHouseholdDataByEstate } from "../../../../../hooks/useFetchedHouseholdData";
import { estateActions } from "../../../../../lib/features/estate/estateSlice";

import { EmptyHousehold } from "./emptyHousehold";
import { ErrorHouseholdsPage } from "./errorMainPage";
import { LoadingHouseholdPage } from "./loadingMainPage";
import { HouseholdsHeader } from "./headerForHouseholds";
import { HouseholdsTable } from "./householdsTable";
import { HouseholdsFooter } from "./footerForHouseholds";
import MainTopBar from "../mainTopBar";
import { HouseholdsTableData } from "./types";

type MainHouseholdComponentProps = {
  estateId: string;
};

type HouseholdErrorCause = {
  code?: string;
  details?: string;
};

export const MainHouseholdComponent = ({
  estateId,
}: MainHouseholdComponentProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedEstateId, setSelectedEstateId] = useState(estateId);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    if (!estateId) {
      router.replace("/dashboard");
      return;
    }

    setSelectedEstateId(estateId);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, [estateId, router]);

  useEffect(() => {
    if (!selectedEstateId) {
      return;
    }

    dispatch(estateActions.insertEstateId(selectedEstateId));
  }, [dispatch, selectedEstateId]);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim();

    if (!normalizedSearchTerm) {
      setDebouncedSearchTerm("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(normalizedSearchTerm);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const { isError, error, data, isPending, refetch, isFetching } =
    useFetchedHouseholdDataByEstate(
      selectedEstateId,
      "1",
      "10",
      debouncedSearchTerm,
    );

  useEffect(() => {
    if (data === null) {
      router.replace("/dashboard");
    }
  }, [data, router]);

  const handleSelectedEstateIdChange = (newEstateId: string) => {
    if (!newEstateId || newEstateId === selectedEstateId) {
      return;
    }

    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedEstateId(newEstateId);

    router.replace(
      `/dashboard/households?estateId=${encodeURIComponent(newEstateId)}`,
    );
  };

  if (!estateId) {
    return null;
  }

  if (isError) {
    const cause =
      error instanceof Error &&
      typeof error.cause === "object" &&
      error.cause !== null
        ? (error.cause as HouseholdErrorCause)
        : undefined;

    return (
      <ErrorHouseholdsPage
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
        code={cause?.code ?? "UNKNOWN_CODE"}
        requestId={cause?.details ?? "NOT_AVAILABLE"}
        refetch={() => {
          void refetch();
        }}
      />
    );
  }

  // Initial loading only.
  if (isPending) {
    return <LoadingHouseholdPage />;
  }

  if (!data) {
    return null;
  }

  const estateHasNoHouseholds = data.summary.householdsTotal === 0;

  if (estateHasNoHouseholds) {
    return (
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, md: 3 },
          pt: { xs: 2, md: 3 },
        }}
      >
        <MainTopBar
          estates={data.allEstates}
          selectedEstateId={selectedEstateId}
          changeSelectedEstate={handleSelectedEstateIdChange}
        />

        <EmptyHousehold estateName={data.estateName ?? "Unknown"} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
      }}
    >
      <MainTopBar
        estates={data.allEstates}
        selectedEstateId={selectedEstateId}
        changeSelectedEstate={handleSelectedEstateIdChange}
      />

      <HouseholdsHeader
        estateName={data.estateName}
        totalHouseholds={data.summary.householdsTotal}
        totalMembers={data.summary.membersTotal}
        totalAssistants={data.summary.assistantsTotal}
        isFetching={isFetching}
      />

      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <HouseholdsTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFetching={isFetching}
          householdsTableData={{
            households: data.households as HouseholdsTableData["households"],
            pagination: data.pagination,
          }}
        />
      </Box>

      <HouseholdsFooter />
    </Box>
  );
};
