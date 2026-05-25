import {
  ApartmentOutlined,
  NotificationsOutlined,
  Search,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";

const MainTopBar = () => {
  const estates = [
    {
      name: "Oakwood Residency",
      status: "active",
      id: "123456",
    },
    {
      name: "Morenike Residential Estate",
      status: "active",
      id: "165432",
    },
  ];
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: 1,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "flex-start", md: "space-between" },
        },
      }}
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Search residents, vehicles or logs..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flexGrow: 1,
        }}
      />
      <Box>
        <IconButton size="medium">
          <NotificationsOutlined color="primary" fontSize="medium" />
        </IconButton>
        <TextField
          id="outlined-select-estate"
          select
          defaultValue="Estate Selector"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ApartmentOutlined fontSize="medium" />
                </InputAdornment>
              ),
            },
          }}
        >
          {estates.map((estate) => (
            <MenuItem key={estate.id} value={estate.name}>
              {estate.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default MainTopBar;
