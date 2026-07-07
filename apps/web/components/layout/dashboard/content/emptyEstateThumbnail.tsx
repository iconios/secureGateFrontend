import { AddBusinessOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const EmptyEstateThumbnail = () => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1,
        border: "1px dashed grey",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", md: "30%" },
        height: { xs: 120, md: 220 },
      }}
    >
      <Box
        sx={{
          borderRadius: "50%",
          backgroundColor: "grey",
          mb: 2,
          mx: "auto",
        }}
      >
        <AddBusinessOutlined fontSize="large" />
      </Box>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 22, md: 28 },
          fontWeight: 700,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        Add New Estate
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontSize: { xs: 12, md: 16 },
          textAlign: "center",
        }}
      >
        Expand your SecureGate estate network
      </Typography>
    </Box>
  );
};
