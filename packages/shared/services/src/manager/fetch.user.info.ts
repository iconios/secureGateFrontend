// Fetch User Info Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/
import { FetchUserInfoServerResponse } from "./manager.types";

const FetchUserInfoService = async (token: string, apiUrl: string) => {
  try {
    // 1. Get and validate the necessary data
    if (!token || !apiUrl) {
      return {
        success: false,
        message: "Required arguments are missing. Please make available",
        data: {},
        error: {
          code: "API_URL_OR_TOKEN_MISSING",
          details: "Required arguments are missing",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 2. Pass the data to the API
    const response = await fetch(`${apiUrl}/managers/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    return result as FetchUserInfoServerResponse;
  } catch (error: any) {
    return {
      success: false,
      message: "Unknown error while fetching user info",
      data: {},
      error: {
        code: "UNKNOWN_ERROR",
        details: error?.message ?? "Unknown error while fetching user info",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};

export default FetchUserInfoService;
