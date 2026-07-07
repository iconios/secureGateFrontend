// Fetch Block Or Street Options Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { FetchBlockOrStreetOptionsServerResponse } from "./types";
import { errorResponseHelper } from "../util/errorResponseHelper";

export const FetchBlockOrStreetOptions = async (
  token: string,
  apiUrl: string,
  estateId: string,
) => {
  try {
    // 1. Get and validate the necessary data
    if (!token || !apiUrl || !estateId) {
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
    const response = await fetch(
      `${apiUrl}/households/fetch/blockorstreet?estateId=${encodeURIComponent(estateId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    let result: FetchBlockOrStreetOptionsServerResponse | null = null;

    try {
      result = await response.json();
    } catch {
      return errorResponseHelper(
        "Invalid server response while fetching block or street options.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!response.ok) {
      return errorResponseHelper(
        "Failed to fetch block or street options.",
        "FETCH_FAILED",
        result?.message ?? "Failed to fetch block or street options.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: any) {
    return errorResponseHelper(
      error?.message ?? "Unknown error while fetching block or street options",
      "UNKNOWN_ERROR",
      "Unknown error while fetching block or street options",
    );
  }
};
