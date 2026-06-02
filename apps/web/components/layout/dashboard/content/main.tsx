"use client";

import NoEstateYet from "./emptyEstate";
import EstateBanner from "./estateBanner";
import EstateForm from "./estateForm";
import RecentGateActivityAlerts from "./gateActivityAlerts";
import HouseholdLimitSelection from "./householdLimitSelection";
import MainTopBar from "./mainTopBar";
import Metrics from "./metrics";

const OverviewPage = () => {
  return (
    <>
      <MainTopBar />
      <EstateForm />
    </>
  );
};

export default OverviewPage;
