"use client";

/*
#Plan:
1. Set up the client component and imports.
2. Define payment status types and component props.
3. Validate the incoming payment status.
4. Prepare the component and clean the payment reference.
5. Fetch the estate payment data from the backend.
6. Show API errors safely through useEffect.
7. Stop rendering if the reference, status, or API response is invalid.
8. Prepare formatted display values.
9. Render the pending payment page.
10. Render the failed payment page.
11. Render the success payment page.
*/

/*
Workflow Step 1:
Set up the client component and imports.
*/
import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PaymentSuccess from "./successful-status";
import PaymentPending from "./pending-status";
import PaymentFailed from "./failed-status";
import { EstatePaymentData } from "./types";
import { showToast } from "../../../utils/toast";
import useAuthCheck from "../../../hooks/useAuthCheck";

/*
Workflow Step 2:
Define payment status types and component props.
*/
type PaymentStatus = "success" | "pending" | "failed";

type StatusSwitchProps = {
  status?: string | null;
  reason?: string | null;
  reference?: string | null;
};

/*
Workflow Step 3:
Validate the incoming payment status.
*/
const isValidPaymentStatus = (
  value: string | null | undefined,
): value is PaymentStatus => {
  return value === "success" || value === "pending" || value === "failed";
};

/*
Workflow Step 4:
Prepare the component and clean the payment reference.
*/
export const StatusSwitch = ({
  status,
  reason,
  reference,
}: StatusSwitchProps) => {
  // Validate authentication
  useAuthCheck();

  const safeReference = reference?.trim();
  const paymentStatus = isValidPaymentStatus(status) ? status : null;

  /*
  Workflow Step 5:
  Fetch the estate payment data from the backend.
  */
  const { data, error, isError, isPending } = useQuery({
    queryKey: ["estatePaymentStatus", safeReference],
    enabled: Boolean(safeReference && paymentStatus),
    retry: false,
    queryFn: async (): Promise<EstatePaymentData> => {
      if (!safeReference) {
        throw new Error("Payment reference is missing.");
      }

      const response = await fetch(
        `/api/payment/estate-status?reference=${encodeURIComponent(safeReference)}`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const payload = await response.json();
      console.log("Payload from backend", payload);
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to fetch payment details.");
      }

      return payload;
    },
  });

  /*
  Workflow Step 6:
  Show API errors safely through useEffect.
  */
  useEffect(() => {
    if (isError) {
      showToast.error(
        error instanceof Error
          ? error.message
          : "Unable to fetch payment details.",
      );
    }
  }, [isError, error]);

  /*
  Workflow Step 7:
  Stop rendering if the reference, status, or API response is invalid.
  */
  if (!safeReference) {
    return <Alert severity="error">Payment reference is missing.</Alert>;
  }

  if (!paymentStatus) {
    return <Alert severity="error">Invalid payment status.</Alert>;
  }

  if (isPending) {
    return (
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        Unable to load payment details. Please try again.
      </Alert>
    );
  }

  /*
  Workflow Step 8:
  Prepare formatted display values.
  */
  const estateData = data.data.estate_payment;
  const estateName = estateData.estate_name ?? "Unknown Estate";
  const planName = estateData.plan_name ?? "Unknown";
  const householdLimit = estateData.household_limit ?? "1";
  const paymentReference = estateData.payment_reference ?? safeReference;

  const subscriptionAmount = Number(estateData.subscription_amount ?? 0);

  const amountPaid = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(subscriptionAmount);

  const subscription = `${planName.toUpperCase()} (${householdLimit} households)`;

  /*
  Workflow Step 9:
  Render the pending payment page.
  */
  if (paymentStatus === "pending") {
    return (
      <PaymentPending
        estateName={estateName}
        subscription={subscription}
        amountPaid={amountPaid}
        transactionId={paymentReference}
      />
    );
  }

  /*
  Workflow Step 10:
  Render the failed payment page.
  */
  if (paymentStatus === "failed") {
    return (
      <PaymentFailed
        estateName={estateName}
        plan={planName}
        amount={amountPaid}
        reason={reason || "Payment failed or was cancelled."}
        paymentReference={paymentReference}
      />
    );
  }

  /*
  Workflow Step 11:
  Render the success payment page.
  */
  return (
    <PaymentSuccess
      estateName={estateName}
      subscription={subscription}
      amountPaid={amountPaid}
      transactionId={paymentReference}
    />
  );
};
