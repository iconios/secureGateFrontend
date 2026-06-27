// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { webStorage } from "../../../../lib/server-storage"; // Adjust file path accurately
import FetchUserInfoService from "@shared/services/manager/fetch.user.info";

export const GET = async (request: NextRequest) => {
  try {
    const token = await webStorage.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 401 },
      );
    }

    const apiUrl = process.env.API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: "API URL configuration missing" },
        { status: 500 },
      );
    }

    // Call shared service to fetch the fresh manager profile data
    const result = await FetchUserInfoService(token, apiUrl);

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 401 },
      );
    }

    // Safely send the user data back to the client-side browser context
    return NextResponse.json(
      {
        success: true,
        message: "Manager data fetched successfully",
        data: result.data, // Assumes result.data contains user object and role
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Session route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error checking session" },
      { status: 500 },
    );
  }
};
