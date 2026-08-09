// Delete Household
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";
import { DeleteHouseholdServerResponse } from "./types";

export const deleteHousehold = async (
  token: string,
  apiUrl: string,
  householdId: string,
  estateId: string,
) => {
  try {
    // 1. Get and validate the necessary data
    if (!token || !apiUrl) {
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
      `${apiUrl}/households/delete/household/${householdId}/estate/${estateId}`,
    );

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let result: DeleteHouseholdServerResponse | null = null;

    try {
      result = await response.json();
      console.log("Delete household data", result);
    } catch {
      return errorResponseHelper(
        "Invalid server response while deleting household.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!result?.success) {
      return errorResponseHelper(
        result?.message ?? "Failed to delete household.",
        "HOUSEHOLDS_DELETION_FAILED",
        result?.message ?? "Failed to delete household.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: any) {
    return errorResponseHelper(
      error?.message ?? "Unknown error while deleting household.",
      "UNKNOWN_ERROR",
      "Unknown error while deleting household.",
    );
  }
};
