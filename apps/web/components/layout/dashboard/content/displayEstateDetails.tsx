// Purpose: Display (selected) estate details
/*
#Plan:
1. Accept and validate an array of estates
2. Model the estate selection state and data
3. Handle the selected Id change
4. Normalize the data 
5. Render the UI
*/

import { useEffect, useState } from "react";
import { EstatesData } from "./estate.types";
import { Box } from "@mui/material";
import MainTopBar from "./mainTopBar";
import EstateBanner from "./estateBanner";
import Metrics from "./metrics";
import RecentGateActivityAlerts from "./gateActivityAlerts";
import { useDispatch } from "react-redux";
import { estateActions } from "../../../../lib/features/estate/estateSlice";
import { ServerManagerDashboardResponse } from "@shared/services/manager";

const { insertEstateId } = estateActions;

// 1. Accept and validate an array of estates
export const DisplaySelectedEstateDetails = ({
  estates = [],
}: {
  estates: EstatesData[];
}) => {
  // 2. Model the estate selection state and data
  // Guard against empty or undefined estates array
  const dispatch = useDispatch();
  const initialId = estates[0]?.estate_id ?? "";
  console.log("Initial estate id", initialId);
  const [selectedEstateId, setSelectedEstateId] = useState<string>(initialId);

  useEffect(() => {
    if (!initialId) return;

    setSelectedEstateId(initialId);
    dispatch(insertEstateId(initialId));
  }, [initialId, dispatch]);

  // 3. Handle the selected Id change
  const handleSelectedEstateIdChange = (newId: string) => {
    setSelectedEstateId(newId);
    dispatch(insertEstateId(newId));
  };

  // 4. Normalize the data
  console.log("Estates data", estates);
  const selectedEstateData = estates.find(
    (item) => item.estate_id === selectedEstateId,
  );
  console.log("Selected estate data", selectedEstateData);
  const estatesSummary = estates.map((item) => ({
    id: item.estate_id,
    name: item.estate_name,
  }));

  const localDateFormatter = (v: string): string => {
    const dateObject = new Date(v);
    return dateObject.toLocaleString("en-GB").replace(/\//g, "-");
  };

  // 5. Render the UI
  return (
    <Box>
      <MainTopBar
        estates={estatesSummary}
        changeSelectedEstate={handleSelectedEstateIdChange}
        selectedEstateId={selectedEstateId}
      />
      <EstateBanner
        logoUrl={selectedEstateData?.estate_logo_url ?? ""}
        name={selectedEstateData?.estate_name ?? ""}
        status={selectedEstateData?.estate_status ?? ""}
        location={selectedEstateData?.estate_location ?? ""}
        state={selectedEstateData?.estate_state ?? ""}
        createdAt={localDateFormatter(
          selectedEstateData?.estate_payment_paid_at ?? "",
        )}
      />
      <Metrics
        subscription_plan={
          selectedEstateData?.estate_subscription_plan_name ?? ""
        }
        max_residents={
          selectedEstateData?.estate_subscription_plan_household_limit ?? 0
        }
        residents_number={selectedEstateData?.resident_count ?? 0}
        principal_residents_number={
          selectedEstateData?.principal_resident_count ?? 0
        }
        next_bill={localDateFormatter(
          selectedEstateData?.estate_payment_expires_at ?? "",
        )}
        households={selectedEstateData?.estate_number_of_households ?? 0}
        active_guests={0}
        flagged_guests={0}
        blacklisted_vehicles={0}
        open_incidents={0}
      />
      <RecentGateActivityAlerts />
    </Box>
  );
};
