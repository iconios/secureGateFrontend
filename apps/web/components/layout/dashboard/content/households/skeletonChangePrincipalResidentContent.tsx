import { Box, Skeleton, Stack } from "@mui/material";

export const ChangePrincipalResidentSkeleton = () => {
  return (
    <Box role="status" aria-label="Loading residents" aria-live="polite">
      {/* Matches the results-count typography */}
      <Skeleton
        variant="rounded"
        width={145}
        height={20}
        sx={{
          mb: { xs: 1, md: 2 },
          borderRadius: 0.5,
        }}
      />

      {/* Match the number of rows normally expected */}
      <Stack spacing={{ xs: 1, md: 2 }}>
        <ResidentRowSkeleton />
      </Stack>
    </Box>
  );
};

function ResidentRowSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        // Exactly matches the real resident-row padding
        px: { xs: 1, sm: 1.25 },
        py: { xs: 1, sm: 1.25 },

        border: "2px solid",
        borderColor: "divider",
        borderRadius: "11px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
          flex: 1,
        }}
      >
        {/* Matches the real 45 × 45 resident image */}
        <Skeleton
          variant="circular"
          width={45}
          height={45}
          sx={{ flexShrink: 0 }}
        />

        {/* Matches the resident name */}
        <Skeleton
          variant="rounded"
          width="55%"
          height={20}
          sx={{
            maxWidth: 245,
            borderRadius: 0.5,
          }}
        />
      </Box>

      {/* Matches the 29px radio icon */}
      <Skeleton
        variant="circular"
        width={29}
        height={29}
        sx={{
          flexShrink: 0,
          ml: 1.5,
          mx: 0.5,
        }}
      />
    </Box>
  );
}
