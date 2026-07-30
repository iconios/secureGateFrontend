"use client";

import { Skeleton, Stack, TableCell, TableRow } from "@mui/material";

type HouseholdTableSkeletonProps = {
  rows?: number;
};

export const HouseholdTableSkeleton = ({
  rows = 4,
}: HouseholdTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={`household-skeleton-${index}`}
          aria-label="Loading household"
        >
          {/* Household code */}
          <TableCell>
            <Skeleton
              variant="text"
              width={90}
              height={28}
              sx={{ transform: "none" }}
            />
          </TableCell>

          {/* Unit number */}
          <TableCell>
            <Skeleton
              variant="text"
              width={60}
              height={28}
              sx={{ transform: "none" }}
            />
          </TableCell>

          {/* Principal resident */}
          <TableCell>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ flexShrink: 0 }}
              />

              <Skeleton
                variant="text"
                height={28}
                sx={{
                  width: {
                    xs: 100,
                    md: 160,
                  },
                  transform: "none",
                }}
              />
            </Stack>
          </TableCell>

          {/* Member count */}
          <TableCell>
            <Skeleton
              variant="text"
              height={28}
              sx={{
                width: {
                  xs: 70,
                  md: 105,
                },
                transform: "none",
              }}
            />
          </TableCell>

          {/* Assistant count */}
          <TableCell>
            <Skeleton
              variant="text"
              height={28}
              sx={{
                width: {
                  xs: 80,
                  md: 125,
                },
                transform: "none",
              }}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
