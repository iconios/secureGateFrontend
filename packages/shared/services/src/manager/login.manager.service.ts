// Login manager service
/**
 * This service handles the logic for authenticating managers, including validation and API integration.
 * It is responsible for sending authentication requests to the backend and processing the responses.
 * It provides methods to submit authentication credentials and manage the authentication state.
 */

import { ServerResponse } from "./manager.types";

/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

export const LoginManagerService = async (
  {
    email,
    password,
  }: {
    email: string;
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // 2. Pass the data to the API
    const response = await fetch(`${API_BASE_URL}/managers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // 3. Get the server response and send to the client
    const result: ServerResponse = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error?.details || "Failed to login manager");
    }

    return result;
  } catch (error) {
    console.error("Error logging in manager", error);

    if (error instanceof Error) throw error;

    throw new Error("Error logging in manager");
  }
};
