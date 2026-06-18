// Initialize Payment
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { ZodError } from "zod";
import {
  InitializeEstatePaymentData,
  InitializeEstatePaymentDataSchema,
  InitializeEstatePaymentServerResponse,
} from "./payment.types";

export const InitializePayment = async (
  initializePaymentData: InitializeEstatePaymentData,
  baseUrl: string,
  token: string,
) => {
  try {
    // 1. Get and validate the necessary data
    const validatedInput = InitializeEstatePaymentDataSchema.parse(
      initializePaymentData,
    );

    if (!token) {
      return {
        success: false,
        message: "Unauthenticated. User identity required",
        data: {},
        error: {
          code: "USER_IDENTITY_REQUIRED",
          details: "Unauthenticated. User identity required",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    if (!baseUrl) {
      return {
        success: false,
        message: "Api url is required",
        data: {},
        error: {
          code: "API_URL_REQUIRED",
          details: "Api url is required",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 2. Pass the data to the API
    const response = await fetch(
      `${baseUrl}/payments/initialize/paystack/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedInput),
      },
    );

    const result =
      (await response.json()) as InitializeEstatePaymentServerResponse;

    // 3. Get the server response and send to the client
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues,
        data: {},
        error: {
          code: "DATA_VALIDATION_ERROR",
          details: error.issues,
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
      message: "Unexpected error when initializing estate payment",
      data: {},
      error: {
        code: "UNEXPECTED_ERROR",
        details: "Unexpected error when initializing estate payment",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};
