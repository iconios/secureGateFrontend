import { NextRequest, NextResponse } from "next/server";
import { GetEstatePaymentDatabaseStatus } from "@shared/services/payment";
import { webStorage } from "../../../../lib/server-storage";

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get("reference");
    const token = await webStorage.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found", data: null },
        { status: 401 },
      );
    }

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "No reference found", data: null },
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
        },
        { status: 500 },
      );
    }

    // 1. Run the service fully on the server
    const result = await GetEstatePaymentDatabaseStatus(
      token,
      reference,
      apiUrl,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message ?? "Error fetching data",
          data: null,
        },
        { status: 400 },
      );
    }

    // 2. Return the data back to your client-side useMutation
    return NextResponse.json(
      {
        success: true,
        message: result.message ?? "Estate payment data found",
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Payment estate status route error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Error fetching payment estate status data";
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
