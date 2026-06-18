// Dashboard Manager Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Parse the server response
4. Relay backend success or failure responses to the frontend
5. Return fallback error only when the response body cannot be used
*/

import { ServerManagerDashboardResponse } from "./manager.types";

const DashboardManagerService = async (
  token: string,
  config: { baseUrl: string },
): Promise<ServerManagerDashboardResponse> => {
  // Step 1: Get and validate the necessary data
  const API_BASE_URL = config.baseUrl;

  if (!API_BASE_URL) {
    return {
      success: false,
      message: "API_BASE_URL is not defined in environment variables",
      data: [],
      error: {
        code: "API_BASE_URL_REQUIRED",
        details: "API_BASE_URL is required",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (!token) {
    return {
      success: false,
      message: "Unauthenticated. Please login",
      data: [],
      error: {
        code: "TOKEN_REQUIRED",
        details: "Unauthenticated user",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  try {
    // Step 2: Pass the data to the API
    const response = await fetch(
      `${API_BASE_URL}/estates_manager/estates/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    // Step 3: Parse the server response
    let result: ServerManagerDashboardResponse | null = null;

    try {
      result = await response.json();
    } catch {
      result = null;
    }

    // Step 4: Relay backend success or failure responses to the frontend
    if (result) {
      return result;
    }

    // Step 5: Return fallback error only when the response body cannot be used
    return {
      success: false,
      message: "Network or API error. Failed to fetch dashboard data",
      data: [],
      error: {
        code: response.ok ? "INVALID_API_RESPONSE" : "NETWORK_OR_API_ERROR",
        details: "The server response could not be parsed",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error fetching dashboard data",
      data: [],
      error: {
        code: "UNKNOWN_ERROR",
        details:
          error instanceof Error
            ? error.message
            : "Unknown dashboard service error",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};

export default DashboardManagerService;
