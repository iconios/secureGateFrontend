// Forgot Password Api Route

import { ForgotPasswordManagerService } from "@shared/services/manager";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const email = body?.email;
    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
      console.log("Missing api base url configuration");
      return NextResponse.json(
        {
          success: false,
          message: "Missing api base url configuration",
          data: null,
        },
        { status: 500 },
      );
    }

    if (!email || typeof email !== "string") {
      console.log("Missing or invalid email data");
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid email data",
          data: null,
        },
        { status: 400 },
      );
    }

    // 1. Run the service fully on the server
    const result = await ForgotPasswordManagerService(email, baseUrl);
    console.log("Api forgot password", result);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          data: null,
        },
        { status: 400 },
      );
    }

    // 2. Return the data back to the client-side useMutation
    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Forgot password route error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Forgot password request failed";
    return NextResponse.json(
      {
        success: false,
        message: errMessage,
        data: null,
      },
      { status: 400 },
    );
  }
};
