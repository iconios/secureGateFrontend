// Fetch Non-Principal Residents By Estate API

import { NextRequest, NextResponse } from "next/server";
import { swapPrincipalResident } from "@shared/services/resident";
import { webStorage } from "../../../../lib/server-storage";

export const PATCH = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const householdId = searchParams.get("householdId");
    const oldPrincipalId = searchParams.get("oldPrincipalId");
    const newPrincipalId = searchParams.get("newPrincipalId");
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

    if (!estateId || !householdId || !oldPrincipalId || !newPrincipalId) {
      return NextResponse.json(
        {
          success: false,
          message: "Required identities not found",
          data: null,
          error: {
            code: "REQUIRED_IDENTITIES_MISSING",
            details: "Required identities not found",
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
    const result = await swapPrincipalResident(
      token,
      apiUrl,
      estateId,
      householdId,
      oldPrincipalId,
      newPrincipalId,
    );

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message ?? "Error swapping principal resident",
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
        message: result.message ?? "Principal resident changed successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Swap principal data error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Error swapping principal resident";
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
