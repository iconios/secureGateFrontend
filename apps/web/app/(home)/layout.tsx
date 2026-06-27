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
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        minHeight: "100vh",
        mx: "auto",
        p: 0,
        m: 0,
        overflowX: "hidden",
      }}
    >
      {/* Aside section */}
      <Box
        component="aside"
        sx={{
          width: { xs: "100%", md: "30%" },
          display: "flex",
          flexDirection: "column",
          minHeight: { xs: "auto", md: "100vh" },
        }}
      >
        {Aside}
      </Box>

      {/* Right column section */}
      <Box
        component="main"
        sx={{
          width: { xs: "100%", md: "70%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {RightColumn}
      </Box>
    </Container>
  );
}
