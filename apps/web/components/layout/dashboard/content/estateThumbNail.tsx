import { LocationPin } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

type EstateThumbnailProps = {
  id: string;
  src: string;
  name: string;
  location: string;
  stateRegion: string;
  residentsNumber: number;
  securityStatus: string;
  handleSelection: (v: string) => void;
};

export const EstateThumbnail = ({
  id,
  src,
  name,
  location,
  stateRegion,
  residentsNumber,
  securityStatus,
  handleSelection,
}: EstateThumbnailProps) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          pb: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 1,
          }}
        >
          <Image src={src} alt={name} height={50} width={50} />
        </Box>
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 20, md: 28 },
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <LocationPin />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 16 },
              }}
            >
              {location}, {stateRegion}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Divider
        sx={{
          mb: 1,
        }}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          pb: { xs: 2, md: 3 },
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: 12, md: 16 },
            }}
          >
            TOTAL RESIDENTS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "text.primary",
              fontSize: { xs: 20, md: 28 },
              fontWeight: 700,
            }}
          >
            {residentsNumber}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: 12, md: 16 },
            }}
          >
            SECURITY STATUS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "primary.main",
              fontSize: { xs: 20, md: 28 },
              fontWeight: 700,
            }}
          >
            {securityStatus}
          </Typography>
        </Box>
      </Stack>
      <Button
        size="large"
        variant="contained"
        sx={{
          color: "primary.contrastText",
        }}
        onClick={() => handleSelection(id)}
      >
        Enter Dashboard
      </Button>
    </Paper>
  );
};
