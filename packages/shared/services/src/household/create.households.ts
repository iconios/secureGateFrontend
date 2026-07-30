// Fetch Households By Estate
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";
import { CreateHouseholdInput, CreateHouseholdServerResponse } from "./types";

export const CreateHouseholdsService = async (
  token: string,
  apiUrl: string,
  createHouseholdData: CreateHouseholdInput,
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
    const url = new URL(`${apiUrl}/households/create`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createHouseholdData),
    });

    let result: CreateHouseholdServerResponse | null = null;

    try {
      result = await response.json();
      console.log("Create households data", result);
    } catch {
      return errorResponseHelper(
        "Invalid server response while creating households.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!result?.success) {
      return errorResponseHelper(
        result?.message ?? "Failed to create households.",
        "HOUSEHOLDS_CREATION_FAILED",
        result?.message ?? "Failed to create households.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: any) {
    return errorResponseHelper(
      error?.message ?? "Unknown error while creating households.",
      "UNKNOWN_ERROR",
      "Unknown error while creating households.",
    );
  }
};
