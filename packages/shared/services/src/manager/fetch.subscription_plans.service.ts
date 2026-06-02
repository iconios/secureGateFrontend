// Fetch Subscription Plans Service
/*
#Plan:
1. Pass the data to the API
2. Get the server response and send to the client
*/

import { ServerSubscriptionPlansResponse } from "./manager.types";

const FetchSubscriptionPlansService = async (config: { baseUrl: string }) => {
  const API_BASE_URL = config.baseUrl;
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  try {
    // Step 1. Pass the data to the API
    const response = await fetch(`${API_BASE_URL}/subscription_plans/`, {
      method: "GET",
    });

    const result: ServerSubscriptionPlansResponse = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error?.details || "Failed to fetch plans");
    }

    // Step 2. Get the server response and send to the client
    return result;
  } catch (error) {
    console.error("Error fetching plans", error);

    if (error instanceof Error) throw error;

    throw new Error("Error fetching plans");
  }
};

export default FetchSubscriptionPlansService;
