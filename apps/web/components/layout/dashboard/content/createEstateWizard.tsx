import React, { Activity, useState } from "react";
import EstateForm from "./estateForm";
import HouseholdLimitSelection from "./householdLimitSelection";
import NoEstateYet from "./emptyEstate";
import { Box } from "@mui/material";
import EstateConfirmAndPay from "./confirmAndPay";
import useAuthCheck from "../../../../hooks/useAuthCheck";

const CreateEstateWizardForm = () => {
  // Check user authentication status
  useAuthCheck();

  const [currentStep, setCurrentStep] = useState(0);

  // Navigation handlers
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <Box>
      <Activity mode={currentStep === 0 ? "visible" : "hidden"}>
        <NoEstateYet nextStepHandler={nextStep} />
      </Activity>
      <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
        <EstateForm nextStepHandler={nextStep} />
      </Activity>
      <Activity mode={currentStep === 2 ? "visible" : "hidden"}>
        <HouseholdLimitSelection
          nextStepHandler={nextStep}
          prevStepHandler={prevStep}
        />
      </Activity>
      <Activity mode={currentStep === 3 ? "visible" : "hidden"}>
        <EstateConfirmAndPay prevStepHandler={prevStep} />
      </Activity>
    </Box>
  );
};

export default CreateEstateWizardForm;
