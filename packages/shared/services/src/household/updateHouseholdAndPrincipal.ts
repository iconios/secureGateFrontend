// Update Household And Principal
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";
import {
  UpdateHouseholdAndPrincipalServerResponse,
  UpdateHouseholdAndPrincipalType,
} from "./types";

export const UpdateHouseholdAndPrincipal = async (
  token: string,
  apiUrl: string,
  estateId: string,
  householdId: string,
  principalResidentId: string,
  updateData: UpdateHouseholdAndPrincipalType,
) => {
  try {
    // 1. Get and validate the necessary data
    if (
      !token ||
      !apiUrl ||
      !estateId ||
      !householdId ||
      !principalResidentId
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
      `${apiUrl}/households/update/estate/${estateId}/household/${householdId}/resident/${principalResidentId}`,
    );

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    let result: UpdateHouseholdAndPrincipalServerResponse | null = null;

    try {
      result = await response.json();
      console.log("Update household and principal data", result);
    } catch {
      return errorResponseHelper(
        "Invalid server response while updating household and principal.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!result?.success) {
      return errorResponseHelper(
        result?.message ?? "Failed to update household and principal.",
        result?.error?.code ?? "HOUSEHOLDS_AND_PRINCIPAL_UPDATE_FAILED",
        result?.error?.details ?? "Failed to update household and principal.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Unknown error while updating household and principal.";
    return errorResponseHelper(
      errMessage,
      "UNKNOWN_ERROR",
      "Unknown error while updating household and principal.",
    );
  }
};
