// Get Non Principals By Household
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";
import { GetNonPrincipalsByHouseholdServerResponse } from "./types";

export const getNonPrincipalsByHousehold = async (
  token: string,
  apiUrl: string,
  estateId: string,
  householdId: string,
  searchTerm?: string,
) => {
  try {
    // 1. Get and validate the necessary data
    if (!token || !apiUrl || !estateId || !householdId) {
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
      `${apiUrl}/residents/nonPrincipals/estate/${estateId}/household/${householdId}?searchTerm=${searchTerm ?? ""}`,
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let result: GetNonPrincipalsByHouseholdServerResponse | null = null;

    try {
      result = await response.json();
      console.log("Get non-principals by household data", result);
    } catch {
      return errorResponseHelper(
        "Invalid server response while getting non-principals.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!result?.success) {
      return errorResponseHelper(
        result?.message ?? "Failed to get non-principals.",
        result?.error?.code ?? "GET_NON-PRINCIPALS_FAILED",
        result?.error?.details ?? "Failed to get non-principals.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Unknown error while getting non-principals.";
    return errorResponseHelper(
      errMessage,
      "UNKNOWN_ERROR",
      "Unknown error while getting non-principals.",
    );
  }
};
