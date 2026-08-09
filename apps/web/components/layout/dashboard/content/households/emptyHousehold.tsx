"use client";

import { Box } from "@mui/material";
import { EmptyHouseholdTable } from "./emptyTable";
import { HouseholdsHeader } from "./headerForHouseholds";
import { HouseholdsFooter } from "./footerForHouseholds";

export const EmptyHousehold = ({ estateName }: { estateName: string }) => {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        width: "100%",
      }}
    >
      {/** Header text and metrics for household data */}
      <HouseholdsHeader
        estateName={estateName}
        totalHouseholds={0}
        totalMembers={0}
        totalAssistants={0}
        isFetching={false}
      />

      {/** Empty table for household data */}
      <EmptyHouseholdTable />

      {/** Footer */}
      <HouseholdsFooter />
    </Box>
  );
};
