// Fetch Non-Principal Residents By Estate API

import { NextRequest, NextResponse } from "next/server";
import { getAllNonPrincipalsByEstate } from "@shared/services/resident";
import { webStorage } from "../../../../lib/server-storage";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const page = searchParams.get("page") ?? "";
    const pageSize = searchParams.get("pageSize") ?? "";
    const searchTerm = searchParams.get("searchTerm") ?? undefined;
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
    const result = await getAllNonPrincipalsByEstate(
      token,
      apiUrl,
      estateId,
      page,
      pageSize,
      searchTerm,
    );

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message ?? "Error fetching residents data",
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
        message: result.message ?? "Residents data fetched successfully",
        data: result.data,
        error: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Residents data error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Error fetching residents data";
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
