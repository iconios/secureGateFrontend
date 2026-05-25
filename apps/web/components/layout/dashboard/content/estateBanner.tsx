import { Button, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

const EstateBanner = () => {
  const data = {
    logoUrl: "/hello-world",
    alt: "hello-world",
    name: "Oakwood Residency",
    status: "active",
    location: "Prime Residential Complex",
    state: "Lagos",
    created_at: "12 Jan 2023",
    payment_status: "up to date",
  };

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Image src={data.logoUrl} alt={data.alt} height={50} width={50} />
          <Stack direction="column" spacing={1}>
            <Typography variant="h4">
              {data.name}
              <Typography
                component="span"
                sx={{
                  textTransform: "uppercase",
                  backgroundColor: "Background",
                }}
              >
                <strong> . </strong>
                {data.status}
              </Typography>
            </Typography>
            <Typography variant="h6" component="p">
              {data.location}
              <strong> . </strong>
              {data.state}
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            alert("clicked");
          }}
          sx={{
            backgroundColor: "color.main",
          }}
        >
          Manager Estate
        </Button>
      </Stack>
      <Stack direction="column" spacing={1}>
        <Typography variant="h5">REGISTERED SINCE</Typography>
        <Typography>{data.created_at}</Typography>
      </Stack>
      <Stack direction="column" spacing={1}>
        <Typography variant="h5">PAYMENT STATUS</Typography>
        <Typography>{data.payment_status}</Typography>
      </Stack>
    </Paper>
  );
};

export default EstateBanner;
