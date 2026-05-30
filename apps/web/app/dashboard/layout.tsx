import React from "react";
import DashboardLayoutClient from "./DashboardLayoutClient";

const DashboardLayout = ({
  Aside,
  RightColumn,
}: {
  Aside: React.ReactNode;
  RightColumn: React.ReactNode;
}) => {
  return <DashboardLayoutClient Aside={Aside} RightColumn={RightColumn} />;
};

export default DashboardLayout;
