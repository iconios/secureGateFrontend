// Fetch Block Or Street API

import { NextRequest, NextResponse } from "next/server";
import { FetchBlockOrStreetOptions } from "@shared/services/estate";
import { webStorage } from "../../../../lib/server-storage";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const estateId = searchParams.get("estateId");
    const token = await webStorage.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found", data: null },
        { status: 401 },
      );
    }

    if (!estateId) {
      return NextResponse.json(
        { success: false, message: "No estate id found", data: null },
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
        },
        { status: 500 },
      );
    }

    // 1. Run the service fully on the server
    const result = await FetchBlockOrStreetOptions(token, apiUrl, estateId);

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message ?? "Error fetching data",
          data: null,
        },
        { status: 400 },
      );
    }

    // 2. Return the data back to your client-side useMutation
    return NextResponse.json(
      {
        success: true,
        message: result.message ?? "Estate block or street options found",
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Estate block or street options error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Error fetching estate block or street options";
    return NextResponse.json(
      {
        success: false,
        message: errMessage,
        data: null,
      },
      { status: 500 },
    );
  }
};
