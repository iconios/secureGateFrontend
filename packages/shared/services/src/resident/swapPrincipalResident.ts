// Swap Principal Resident Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";
import { SwapPrincipalResidentServerResponse } from "./types";

export const swapPrincipalResident = async (
  token: string,
  apiUrl: string,
  estateId: string,
  householdId: string,
  oldPrincipalId: string,
  newPrincipalId: string,
) => {
  try {
    // 1. Get and validate the necessary data
    if (
      !token ||
      !apiUrl ||
      !estateId ||
      !householdId ||
      !oldPrincipalId ||
      !newPrincipalId
    ) {
      return {
        success: false,
        message: "Required arguments are missing. Please make available",
        data: {},
        error: {
          code: "API_URL_OR_TOKEN_ESTATE_ID_MISSING",
          details: "Required arguments are missing",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 2. Pass the data to the API
    const url = new URL(
      `${apiUrl}/residents/swap/principals/estate/${estateId}/household/${householdId}`,
    );

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPrincipalId, newPrincipalId }),
    });

    let result: SwapPrincipalResidentServerResponse | null = null;

    try {
      result = await response.json();
      console.log("Swap principal resident data", result);
    } catch {
      return errorResponseHelper(
        "Invalid server response while swapping principal resident.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!result?.success) {
      return errorResponseHelper(
        result?.message ?? "Failed to swap principal resident.",
        result?.error?.code ?? "SWAP_PRINCIPAL_RESIDENT_FAILED",
        result?.error?.details ?? "Failed to swap principal resident",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Unknown error while swapping principal resident.";
    return errorResponseHelper(
      errMessage,
      "UNKNOWN_ERROR",
      "Unknown error while swapping principal resident.",
    );
  }
};
