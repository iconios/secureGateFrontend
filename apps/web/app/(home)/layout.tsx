import type { Metadata } from "next";
import { Box, Container } from "@mui/material";

export const metadata: Metadata = {
  title: "SecureGate Home",
  description: "SecureGate home page",
};

export default function HomeLayout({
  Aside,
  RightColumn,
}: Readonly<{
  Aside: React.ReactNode;
  RightColumn: React.ReactNode;
}>) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: { xs: "column", lg: "row" },
        px: 0,
        mx: -3,
      }}
    >
      {/* Aside section */}
      <Box
        component="aside"
        sx={{
          width: { xs: "100%", lg: "30%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Aside}
      </Box>

      {/* Right column section */}
      <Box
        component="main"
        sx={{
          width: { xs: "100%", lg: "70%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {RightColumn}
      </Box>
    </Container>
  );
}
