// Verify manager service:
/**
 * This service handles the verification of managers, including validation and API integration.
 * It provides methods to submit verification codes and manage the verification process.
 * Key features:
 * - Verify Manager: Submits verification code to the API and handles the verification response.
 */

import { CodeVerificationServerResponse } from "./manager.types";

/*
#Plan:
1. Get and validate the verification code
2. Pass the code to the API
3. Get the server response and send to the client
*/

export const VerifyManagerService = async (
  {
    email,
    code,
  }: {
    email: string;
    code: string;
  },
  config: { baseUrl: string },
) => {
  const API_BASE_URL = config.baseUrl;
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  try {
    // 1. Get and validate the verification code
    if (!code || !/^[a-zA-Z0-9]{6}$/.test(code)) {
      throw new Error("Invalid verification code format");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }

    // 2. Pass the code to the API
    const response = await fetch(`${API_BASE_URL}/managers/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    // 3. Get the server response and send to the client
    const result = (await response.json()) as CodeVerificationServerResponse;
    if (!response.ok || !result.success) {
      const errorDetails = (result.error as { code: string; details: string })
        .details;
      throw new Error(errorDetails || "Failed to verify manager");
    }

    return result;
  } catch (error) {
    console.error("Error verifying manager", error);

    if (error instanceof Error) throw error;

    throw new Error("Error verifying manager");
  }
};
