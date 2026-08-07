// Fetch Non-Principal Residents By Household API

import { NextRequest, NextResponse } from "next/server";
import { webStorage } from "../../../../lib/server-storage";
import { getNonPrincipalsByHousehold } from "@shared/services/household";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const householdId = searchParams.get("householdId");
    const searchTerm = searchParams.get("searchTerm") ?? "";
    const token = await webStorage.get("auth_token");

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

    if (!estateId) {
      return NextResponse.json(
        {
          success: false,
          message: "No estate id found",
          data: null,
          error: {
            code: "ESTATE_ID_MISSING",
            details: "No estate id found",
          },
        },
        { status: 400 },
      );
    }

    if (!householdId) {
      return NextResponse.json(
        {
          success: false,
          message: "No household id found",
          data: null,
          error: {
            code: "HOUSEHOLD_ID_MISSING",
            details: "No household id found",
          },
        },
        { status: 400 },
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
    const result = await getNonPrincipalsByHousehold(
      token,
      apiUrl,
      estateId,
      householdId,
      searchTerm,
    );

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ?? "Error getting non-principal residents data",
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
        message:
          result.message ?? "Non-principal residents data fetched successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Non-principal residents data error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Error getting non-principal residents data";
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
