"use client";

import { Box, Grid, Skeleton, Stack } from "@mui/material";

export const HouseholdHeaderSkeleton = () => {
  return (
    <Box
      aria-label="Loading household overview"
      aria-busy="true"
      sx={{ width: "100%" }}
    >
      {/* Header and action buttons */}
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mx: "auto",
          mb: 2,
          width: "100%",
          gap: { xs: 2, md: 3 },
        }}
      >
        {/* Title and description */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Skeleton
            variant="text"
            height={40}
            sx={{
              width: {
                xs: "70%",
                sm: 340,
                md: 400,
              },
              mx: {
                xs: "auto",
                md: 0,
              },
              transform: "none",
              mb: 1,
            }}
          />

          <Skeleton
            variant="text"
            height={25}
            sx={{
              width: {
                xs: "95%",
                sm: 540,
                md: 650,
              },
              maxWidth: "100%",
              mx: {
                xs: "auto",
                md: 0,
              },
              transform: "none",
            }}
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
          }}
        >
          <Stack
            spacing={1}
            direction={{
              xs: "column",
              md: "row",
            }}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
              alignItems: {
                xs: "stretch",
                md: "center",
              },
            }}
          >
            <Skeleton
              variant="rounded"
              height={42}
              sx={{
                width: {
                  xs: "100%",
                  md: 175,
                },
                borderRadius: 1,
              }}
            />

            <Skeleton
              variant="rounded"
              height={42}
              sx={{
                width: {
                  xs: "100%",
                  md: 160,
                },
                borderRadius: 1,
              }}
            />
          </Stack>
        </Box>
      </Stack>

      {/* Metric cards */}
      <Grid
        container
        spacing={1}
        sx={{
          mb: { xs: 2, md: 4 },
          mx: "auto",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid
            key={`household-metric-skeleton-${index}`}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Box
              sx={{
                minHeight: 120,
                width: "100%",
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  {/* Metric label */}
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={22}
                    sx={{
                      transform: "none",
                      mb: 1.5,
                    }}
                  />

                  {/* Metric value */}
                  <Skeleton
                    variant="text"
                    width={70}
                    height={38}
                    sx={{ transform: "none" }}
                  />
                </Box>

                {/* Metric icon */}
                <Skeleton
                  variant="rounded"
                  width={48}
                  height={48}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 2,
                  }}
                />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
