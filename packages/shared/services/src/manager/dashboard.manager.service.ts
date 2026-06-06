// Dashboard Manager Service
/**
 *
 */

import { ServerManagerDashboardResponse } from "./manager.types";

/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

const DashboardManagerService = async (
  token: string,
  config: { baseUrl: string },
) => {
  // Step 1: Get and validate the necessary data
  const API_BASE_URL = config.baseUrl;
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  try {
    if (!token) throw new Error("Unauthorized");

    // Step 2: Pass the data to the API
    const response = await fetch(
      `${API_BASE_URL}/estates_manager/estates/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Step 3: Get the server response and send to the client
    const result: ServerManagerDashboardResponse = await response.json();
    console.log("DashboardManagerService result", result);
    if (!result.success || !response.ok) {
      throw new Error(result.message || "Failed to fetch dashboard data");
    }

    return result;
  } catch (error) {
    console.error("Error fetching dashboard data", error);

    if (error instanceof Error) throw error;

    throw new Error("Error fetching dashboard data");
  }
};

export default DashboardManagerService;
