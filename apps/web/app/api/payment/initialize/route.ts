// Initialize payment route
/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

import { InitializePayment } from "@shared/services/payment";
import { NextResponse } from "next/server";
import { webStorage } from "../../../../lib/server-storage";

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    // 1. Get and validate the necessary data
    const estateData = await req.json();
    if (!estateData || typeof estateData !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid estate data",
          data: null,
        },
        { status: 400 },
      );
    }

    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing base url configuration",
          data: null,
        },
        { status: 500 },
      );
    }

    const token = await webStorage.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found", data: null },
        { status: 401 },
      );
    }

    // 2. Pass the data to the API
    const result = await InitializePayment(estateData, baseUrl, token);

    // 3. Get the server response and send to the client
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          data: null,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Initialize payment route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error initializing payment",
        data: null,
      },
      { status: 500 },
    );
  }
};
