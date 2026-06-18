// Get Estate Database Status Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { EstateDBPaymentStatusServerResponse } from "./payment.types";

export const GetEstatePaymentDatabaseStatus = async (
  token: string,
  reference: string,
  apiUrl: string,
) => {
  try {
    // 1. Get and validate the necessary data
    if (!token || !apiUrl || !reference) {
      return {
        success: false,
        message: "Required arguments are missing. Please make available",
        data: {},
        error: {
          code: "API_URL_OR_TOKEN_OR_REFERENCE_MISSING",
          details: "Required arguments are missing",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 2. Pass the data to the API
    const response = await fetch(
      `${apiUrl}/payments/estate/status?reference=${encodeURIComponent(reference)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // 3. Get the server response and send to the client
    if (!response.ok) {
      return {
        success: false,
        message: "Network, server or api error",
        data: {},
        error: {
          code: "NETWORK_SERVER_API_ERROR",
          details: "Network, server or api error",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return (await response.json()) as EstateDBPaymentStatusServerResponse;
  } catch (error: any) {
    return {
      success: false,
      message: "Unknown error while fetching estate payment status",
      data: {},
      error: {
        code: "UNKNOWN_ERROR",
        details:
          error?.message ??
          "Unknown error while fetching estate payment status",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};
