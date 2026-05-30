"use client";

import { Box } from "@mui/material";
import Header from "../../components/layout/home/header";
import {
  NavigationProvider,
  useNavigation,
} from "../../providers/NavigationContext";

const DashboardLayoutContent = ({
  Aside,
  RightColumn,
}: {
  Aside: React.ReactNode;
  RightColumn: React.ReactNode;
}) => {
  const { setMobileOpen } = useNavigation();

  return (
    <>
      <Header onMenuClick={() => setMobileOpen(true)} />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Box component="aside">{Aside}</Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {RightColumn}
        </Box>
      </Box>
    </>
  );
};

const DashboardLayoutClient = ({
  Aside,
  RightColumn,
}: {
  Aside: React.ReactNode;
  RightColumn: React.ReactNode;
}) => {
  return (
    <NavigationProvider>
      <DashboardLayoutContent Aside={Aside} RightColumn={RightColumn} />
    </NavigationProvider>
  );
};

export default DashboardLayoutClient;
