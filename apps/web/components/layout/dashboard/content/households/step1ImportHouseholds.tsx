"use client";

import {
  CloudUploadOutlined,
  DescriptionOutlined,
  DownloadOutlined,
  NotificationsOutlined,
  TableChartOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ChangeEvent } from "react";

export const Step1ImportHouseholds = ({
  handleFile,
  fileName,
  fileError,
}: {
  handleFile: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileName: string;
  fileError: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        component="label"
        htmlFor="household-file-upload"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: isMobile ? "grab" : "pointer",
          border: "1px solid",
          borderColor: "#e8e8e8",
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <CloudUploadOutlined />
        <Typography
          sx={{
            fontSize: { xs: 12, md: 14 },
          }}
        >
          {isMobile ? "Tap to upload" : "Click to upload"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12, md: 14 },
          }}
        >
          Maximum file size: 2MB
        </Typography>
        {fileName && (
          <Typography color="success.main">Selected: {fileName}</Typography>
        )}

        {fileError && (
          <Typography color="error" role="alert">
            {fileError}
          </Typography>
        )}

        <input
          id="household-file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          hidden
        />
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{
          mb: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            flexDirection: "row",
          }}
        >
          <Chip
            icon={<DescriptionOutlined fontSize="medium" />}
            label=".CSV"
            sx={{
              p: 1,
              backgroundColor: "#e8e8e8",
              color: "text.primary",
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<TableChartOutlined fontSize="medium" />}
            label=".XLSX"
            sx={{
              p: 1,
              backgroundColor: "#e8e8e8",
              color: "text.primary",
              fontWeight: 500,
            }}
          />
        </Box>
        <Button
          component="a"
          href="/templates/household-import-template.xlsx"
          download="household-import-template.xlsx"
          startIcon={<DownloadOutlined fontSize="medium" />}
          variant="text"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 12, md: 14 },
          }}
        >
          Download Template
        </Button>
      </Stack>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "#e8e8e8",
          borderRadius: 1,
          p: 1,
          mb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1}>
          <NotificationsOutlined fontSize="medium" />
          <Typography
            sx={{
              fontSize: { xs: 12, md: 14 },
            }}
          >
            Ensure your file includes{" "}
            <strong>
              Unit Number, Block or Street, Principal Full Name, Principal
              Gender, Principal Phone and Principal Email
            </strong>{" "}
            columns.
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
