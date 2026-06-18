// Create manager service:
/**
 * This service handles the creation of new managers, including validation and API integration.
 * It provides methods to submit manager details and manage the creation process.
 * Key features:
 * - Create Manager: Submits new manager details to the API and handles the creation response.
 */

import { CreateManagerServerResponse } from "./manager.types";

/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

export const CreateManagerService = async (
  createManagerData: {
    email: string;
    full_name: string;
    phone: string;
    password: string;
  },
  config: { baseUrl: string },
) => {
  const API_BASE_URL = config.baseUrl;
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  try {
    // 1. Get and validate the necessary data
    if (
      !createManagerData.email ||
      !createManagerData.full_name ||
      !createManagerData.phone ||
      !createManagerData.password
    ) {
      throw new Error("All fields are required");
    }

    // 2. Pass the data to the API
    const response = await fetch(`${API_BASE_URL}/managers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createManagerData),
    });

    // 3. Get the server response and send to the client
    const result: CreateManagerServerResponse = await response.json();
    if (!response.ok || !result.success) {
      const errorDetails = (result.error as { code: string; details: string })
        .details;
      throw new Error(errorDetails || "Failed to create manager");
    }

    return result;
  } catch (error) {
    console.error("Error creating manager", error);

    if (error instanceof Error) throw error;

    throw new Error("Error creating manager");
  }
};
