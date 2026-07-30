import { Box, Skeleton, Stack } from "@mui/material";

export const PrincipalResidentSkeleton = () => {
  return (
    <Stack
      direction="row"
      spacing={1}
      aria-label="Loading principal resident"
      aria-busy="true"
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Resident photo */}
      <Skeleton
        variant="rounded"
        width={45}
        height={45}
        sx={{
          flexShrink: 0,
          borderRadius: 1,
        }}
      />

      {/* SummaryItem label and value */}
      <Box>
        <Skeleton
          variant="text"
          width={95}
          height={18}
          sx={{ transform: "none", mb: 0.5 }}
        />

        <Skeleton
          variant="text"
          width={150}
          height={24}
          sx={{ transform: "none" }}
        />
      </Box>
    </Stack>
  );
};
