// Fetch Household Data By Estate API

import { NextRequest, NextResponse } from "next/server";
import { CreateHouseholdsService } from "@shared/services/household";
import type { CreateHouseholdInput } from "@shared/services/household";
import { webStorage } from "../../../../lib/server-storage";

export const POST = async (req: NextRequest) => {
  try {
    const token = await webStorage.get("auth_token");
    const householdData = (await req.json()) as CreateHouseholdInput;
    if (
      !householdData ||
      typeof householdData !== "object" ||
      Array.isArray(householdData)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid household data",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token found",
          data: null,
          error: {
            code: "TOKEN_MISSING",
            details: "No token found",
          },
        },
        { status: 401 },
      );
    }

    const apiUrl = process.env.API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "API URL configuration missing",
          data: null,
          error: {
            code: "API_URL_MISSING",
            details: "API URL configuration missing",
          },
        },
        { status: 500 },
      );
    }

    // 1. Run the service fully on the server
    const result = await CreateHouseholdsService(token, apiUrl, householdData);

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message ?? "Error creating household(s)",
          data: null,
          error: result?.error,
        },
        { status: 400 },
      );
    }

    // 2. Return the data back to your client-side useMutation
    return NextResponse.json(
      {
        success: true,
        message: result.message ?? "Household(s) created successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Households creation error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Error creating household(s)";
    return NextResponse.json(
      {
        success: false,
        message: errMessage,
        data: null,
        error: {
          code: "ERROR",
          details: errMessage,
        },
      },
      { status: 500 },
    );
  }
};
