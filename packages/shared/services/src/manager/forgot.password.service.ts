// Forgot Password Manager Service
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { errorResponseHelper } from "../util/errorResponseHelper";

export const ForgotPasswordManagerService = async (
  email: string,
  baseUrl: string,
) => {
  console.log("Email:", email);
  console.log("Base Url:", baseUrl);
  try {
    // 1. Get and validate the necessary data
    const safeEmail = email?.trim();
    if (!safeEmail) {
      return errorResponseHelper(
        "Email is required",
        "EMAIL_REQUIRED",
        "Email is required",
      );
    }

    if (!baseUrl) {
      return errorResponseHelper(
        "Base url is required",
        "BASE_URL_REQUIRED",
        "Base url is required",
      );
    }

    // 2. Pass the data to the API
    const response = await fetch(`${baseUrl}/managers/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: safeEmail }),
    });

    // if (!response.ok) {
    //   return errorResponseHelper(
    //     "Error initiating request",
    //     "NETWORK_ERROR",
    //     "Error initiating request",
    //   );
    // }

    // 3. Get the server response and send to the client
    const result = await response.json();
    console.log("Forgot password service server response", result);
    return result;
  } catch (error: any) {
    return errorResponseHelper(
      "Unknown error while processing request",
      "UNKNOWN_ERROR",
      error?.message ?? "Unknown error while processing request",
    );
  }
};
