import { RowResult } from "./types";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CheckBoxOutlined, ErrorOutlineOutlined } from "@mui/icons-material";

export const Step2ImportHouseholds = ({
  validCount,
  invalidCount,
  rows,
}: {
  validCount: number;
  invalidCount: number;
  rows: RowResult[];
}) => {
  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 2 }}>
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            gap: 1,
          }}
        >
          <CheckBoxOutlined fontSize="medium" color="success" />
          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 14, md: 18 },
                fontWeight: 600,
              }}
            >
              {validCount} valid households will be imported.
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 14 },
              }}
            >
              These households have passed all validation checks and are ready
              to be imported into the system.
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            backgroundColor: "#F7CAC1",
            gap: 1,
          }}
        >
          <ErrorOutlineOutlined fontSize="medium" color="error" />
          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: { xs: 14, md: 18 },
                fontWeight: 600,
              }}
            >
              {invalidCount} invalid rows will be skipped.
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: 12, md: 14 },
              }}
            >
              These rows contain data formatting issues or missing required
              fields. They will be skipped during import.
            </Typography>
          </Box>
        </Paper>
      </Stack>

      <Paper elevation={1}>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 13, md: 16 },
            fontWeight: 600,
            pb: 1,
            pl: 1,
            pt: 2,
          }}
        >
          Data Preview
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableHeadingItem label="#" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Status" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Unit / Block" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Primary Contact Name" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Gender" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Phone Number" />
                </TableCell>
                <TableCell>
                  <TableHeadingItem label="Email" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const unitBlock = [
                  row.original["Unit Number"] ?? "",
                  row.original["Block or Street"] ?? "",
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <TableRow
                    key={row.rowNumber}
                    style={{
                      background: row.valid ? "#f0fff4" : "#fff1f2",
                    }}
                  >
                    <TableCell>{row.rowNumber}</TableCell>

                    <ValidationCell value={row.valid ? "Ready" : "Error"} />

                    <ValidationCell
                      value={unitBlock}
                      errors={[
                        ...(row.errors.unitNumber ?? []),
                        ...(row.errors.blockOrStreet ?? []),
                      ]}
                    />

                    <ValidationCell
                      value={row.original["Principal Full Name"]}
                      errors={row.errors.principalFullName}
                    />

                    <ValidationCell
                      value={row.original["Principal Gender"]}
                      errors={row.errors.principalGender}
                    />

                    <ValidationCell
                      value={row.original["Principal Phone"]}
                      errors={row.errors.principalPhone}
                    />

                    <ValidationCell
                      value={row.original["Principal Email"]}
                      errors={row.errors.principalEmail}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

type ValidationCellProps = {
  value: unknown;
  errors?: string[];
};

const ValidationCell = ({ value, errors = [] }: ValidationCellProps) => {
  return (
    <TableCell
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        verticalAlign: "middle",
      }}
    >
      <Typography>{String(value ?? "")}</Typography>

      {errors.map((error, index) => (
        <Typography
          key={`${error}-${index}`}
          component="small"
          sx={{
            display: "block",
            color: "error.main",
            mt: 0.5,
          }}
        >
          {error}
        </Typography>
      ))}
    </TableCell>
  );
};

const TableHeadingItem = ({ label }: { label: string }) => {
  return (
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: { xs: 12, md: 15 },
      }}
    >
      {label}
    </Typography>
  );
};
