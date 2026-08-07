// Update Household And Principal API

import { NextRequest, NextResponse } from "next/server";
import { UpdateHouseholdAndPrincipal } from "@shared/services/household";
import type { UpdateHouseholdAndPrincipalType } from "@shared/services/household";
import { webStorage } from "../../../../lib/server-storage";

export const PATCH = async (req: NextRequest) => {
  try {
    const token = await webStorage.get("auth_token");
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const householdId = searchParams.get("householdId");
    const principalResidentId = searchParams.get("principalResidentId");
    const updateData = (await req.json()) as UpdateHouseholdAndPrincipalType;

    if (!estateId || !householdId || !principalResidentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid identity data",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!updateData || typeof updateData !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid update data",
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
    const result = await UpdateHouseholdAndPrincipal(
      token,
      apiUrl,
      estateId,
      householdId,
      principalResidentId,
      updateData,
    );

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ?? "Error updating household and principal data",
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
          result.message ?? "Household and principal data updated successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Household and principal data update error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Error updating household and principal data";
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
