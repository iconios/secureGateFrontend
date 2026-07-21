"use client";

// Main Household Page Component
/*
#Workflow Plan:
1. User clicks household sidebar link
2. Household page accepts estate id for its household to be fetched to display
3. If the user provides no estate id or fetching the household data for the estate id returns no estate, 
    the page redirects to the main overview page
4. If the user provides an estate id and fetching the household data for the estate id returns household data even if zeros,
    the page should display the zero household data
    the page should also display the top bar to switch between estates if available. 
*/

import { useEffect, useState } from "react";
import { useFetchedHouseholdDataByEstate } from "../../../../../hooks/useFetchedHouseholdData";
import { EmptyHousehold } from "./emptyHousehold";
import { ErrorHouseholdsPage } from "./errorMainPage";
import { LoadingHouseholdPage } from "./loadingMainPage";
import { useRouter } from "next/navigation";
import { HouseholdsHeader } from "./headerForHouseholds";
import { HouseholdsTable } from "./householdsTable";
import { HouseholdsFooter } from "./footerForHouseholds";
import { Box } from "@mui/material";
import MainTopBar from "../mainTopBar";

export const MainHouseholdComponent = ({ estateId }: { estateId: string }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  console.log("Initial estate id", estateId);
  const [selectedEstateId, setSelectedEstateId] = useState<string>(estateId);

  useEffect(() => {
    if (!searchTerm) return;

    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const { isError, error, data, isPending, isLoading, isFetching, refetch } =
    useFetchedHouseholdDataByEstate(selectedEstateId, "", "", debouncedSearchTerm);

  useEffect(() => {
    if (data === null) {
      router.replace("/dashboard");
    }
  }, [data, router]);

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const errorCode =
      error instanceof Error &&
      error.cause &&
      (error.cause as any).code !== undefined
        ? (error.cause as any).code
        : "UNKNOWN_CODE";
    const errorRequestId =
      error instanceof Error &&
      error.cause &&
      (error.cause as any).details !== undefined
        ? (error.cause as any).details
        : "NOT_AVAILABLE";

    console.log("Message", errorMessage);
    console.log("code", errorCode);
    console.log("RequestId", errorRequestId);
    return (
      <ErrorHouseholdsPage
        message={errorMessage}
        code={errorCode}
        requestId={errorRequestId}
        refetch={() => refetch()}
      />
    );
  }

  if (isPending || isLoading || isFetching) {
    return <LoadingHouseholdPage />;
  }

  // fetching the household data for the estate id returns no estate,
  //  the page redirects to the main overview page
  if (data === null) {
    return null;
  }  

  const allUserEstates = data.allEstates;

  if (data.households.length === 0) {
    return (
      <>
        <MainTopBar 
          estates={allUserEstates} 
          selectedEstateId={selectedEstateId} 
          changeSelectedEstate={setSelectedEstateId} 
        />
        <EmptyHousehold 
          estateName={data?.estateName ?? "Unknown"} 
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        width: "100%",
      }}
    >
      <MainTopBar 
        estates={allUserEstates} 
        selectedEstateId={selectedEstateId} 
        changeSelectedEstate={setSelectedEstateId} 
      />
      <HouseholdsHeader estateName={data.estateName} />
      <Box
        sx={{
          mb: { xs: 2, md: 4 },
        }}
      >
        <HouseholdsTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          householdsTableData={{
            households: data.households,
            pagination: data.pagination,
          }}
        />
      </Box>
      <HouseholdsFooter />
    </Box>
  );
};
