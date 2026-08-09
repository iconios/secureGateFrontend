// Delete Household API

import { NextRequest, NextResponse } from "next/server";
import { deleteHousehold } from "@shared/services/household";
import { webStorage } from "../../../../lib/server-storage";

export const DELETE = async (req: NextRequest) => {
  try {
    const token = await webStorage.get("auth_token");
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const householdId = searchParams.get("householdId");

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

    if (!householdId || typeof householdId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid household id",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!estateId || typeof estateId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid estate id",
          data: null,
        },
        { status: 400 },
      );
    }

    // 1. Run the service fully on the server
    const result = await deleteHousehold(token, apiUrl, householdId, estateId);

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message ?? "Error deleting household.",
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
        message: result.message ?? "Household deleted successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Household deletion error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Error deleting household.";
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
