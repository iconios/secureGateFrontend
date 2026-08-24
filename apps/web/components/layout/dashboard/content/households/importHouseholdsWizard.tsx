"use client";

import {
  CloseOutlined,
  ImportContactsOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { RowSchema, RowResult, RawHouseholdRow } from "./types";
import * as XLSX from "xlsx";
import { z } from "zod";
import { Step1ImportHouseholds } from "./step1ImportHouseholds";
import { Step2ImportHouseholds } from "./step2ImportHouseholds";

const groupErrors = (issues: z.core.$ZodIssue[]): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = issue.path.join(".") || "row";

    errors[field] ??= [];
    errors[field].push(issue.message);
  }

  return errors;
};

const StepLabel = ({ label }: { label: string }) => {
  return (
    <Typography
      sx={{
        fontSize: { xs: 14, md: 18 },
        fontWeight: 200,
        color: "text.secondary",
      }}
    >
      {label}
    </Typography>
  );
};

const Steps = ({ step }: { step: number }) => {
  if (step === 1) {
    return <StepLabel label="Step 1 of 2: Upload File" />;
  } else if (step === 2) {
    return <StepLabel label="Step 2 of 2: Validate & Review" />;
  } else return;
};

const NextAction = (step: number) => {
  if (step === 1) {
    return "Review";
  } else return "Import";
};

export const ImportHouseholdsWizard = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [rows, setRows] = useState<RowResult[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setRows([]);
    setFileError("");

    if (!file) return;
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      setFileError("The file must not be larger than 2MB.");
      event.target.value = "";
      return;
    }

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setFileError("Please select an XLSX, XLS or CSV file.");
      event.target.value = "";
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);

      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setFileError("The workbook contains no worksheets.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];

      if (!worksheet) {
        setFileError("The first worksheet could not be read.");
        return;
      }

      const importedRows = XLSX.utils.sheet_to_json<RawHouseholdRow>(
        worksheet,
        {
          defval: "",
          raw: false,
        },
      );

      if (importedRows.length === 0) {
        setFileError("The selected file contains no household rows.");
        return;
      }

      const MAX_ROWS = 10;

      if (importedRows.length > MAX_ROWS) {
        setFileError(`The file contains too many rows. Maximum: ${MAX_ROWS}.`);
        return;
      }

      const validatedRows = importedRows.map((rawRow, index): RowResult => {
        const normalizedRow = {
          unitNumber: rawRow["Unit Number"],
          blockOrStreet: rawRow["Block or Street"],
          principalFullName: rawRow["Principal Full Name"],
          principalEmail: rawRow["Principal Email"],
          principalPhone: rawRow["Principal Phone"],
          principalGender: rawRow["Principal Gender"],
        };

        const result = RowSchema.safeParse(normalizedRow);

        if (result.success) {
          return {
            rowNumber: index + 1,
            original: rawRow,
            data: result.data,
            errors: {},
            valid: true,
          };
        }

        return {
          rowNumber: index + 1,
          original: rawRow,
          errors: groupErrors(result.error.issues),
          valid: false,
        };
      });

      setFileName(file.name);
      setRows(validatedRows);
    } catch {
      setFileError(
        "The file could not be read. It may be damaged or unsupported.",
      );
    } finally {
      // Allows the same file to be selected again.
      event.target.value = "";
    }
  };

  const validCount = rows.filter((row) => row.valid).length;
  const invalidCount = rows.length - validCount;

  const handleNext = async () => {
    if (activeStep === 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      console.log("Submit button pressed");
    }
  };

  const handleBack = () => {
    if (activeStep === 1) return;

    setActiveStep((prev) => prev - 1);
  };

  const resetWizard = () => {
    setActiveStep(1);
    setRows([]);
    setFileName("");
    setFileError("");
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const canContinue =
    activeStep === 1 ? rows.length > 0 && !fileError : validCount > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ p: 2 }}>
      <DialogTitle
        sx={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseOutlined fontSize="medium" />
        </IconButton>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: 20, md: 28 },
            fontWeight: 600,
          }}
        >
          Import Households
        </Typography>
        <Steps step={activeStep} />
      </DialogTitle>

      <DialogContent>
        {activeStep === 1 ? (
          <Step1ImportHouseholds
            handleFile={handleFile}
            fileName={fileName}
            fileError={fileError}
          />
        ) : (
          <Step2ImportHouseholds
            validCount={validCount}
            invalidCount={invalidCount}
            rows={rows}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 4,
          px: 2,
        }}
      >
        <Button onClick={handleClose} variant="text">
          Cancel
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleBack}
            sx={{
              display: activeStep === 1 ? "none" : "block",
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            endIcon={<ImportContactsOutlined fontSize="medium" />}
            onClick={handleNext}
            variant="contained"
            disabled={!canContinue}
          >
            {NextAction(activeStep)}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
