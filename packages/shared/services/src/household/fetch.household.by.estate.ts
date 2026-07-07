// Fetch Households By Estate
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { URL } from "url";
import { errorResponseHelper } from "../util/errorResponseHelper";
import { FetchHouseholdsByEstateServerResponse } from "./types";

export const fetchHouseholdsByEstate = async (
  token: string,
  apiUrl: string,
  estateId: string,
  page?: string,
  pageSize?: string,
  searchTerm?: string,
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
    const url = new URL(`${apiUrl}/households/fetch/by-estate`);
    url.searchParams.set("estateId", encodeURIComponent(estateId));
    if (page) {
      url.searchParams.set("page", page);
    }
    if (pageSize) {
      url.searchParams.set("pageSize", pageSize);
    }
    if (searchTerm) {
      url.searchParams.set("searchTerm", searchTerm);
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    let result: FetchHouseholdsByEstateServerResponse | null = null;

    try {
      result = await response.json();
    } catch {
      return errorResponseHelper(
        "Invalid server response while fetching households data.",
        "INVALID_JSON_RESPONSE",
        "The backend did not return valid JSON.",
      );
    }

    if (!response.ok) {
      return errorResponseHelper(
        "Failed to fetch households data.",
        "FETCH_FAILED",
        result?.message ?? "Failed to fetch households data.",
      );
    }

    // 3. Get the server response and send to the client
    return result;
  } catch (error: any) {
    return errorResponseHelper(
      error?.message ?? "Unknown error while fetching households data.",
      "UNKNOWN_ERROR",
      "Unknown error while fetching households data.",
    );
  }
};
