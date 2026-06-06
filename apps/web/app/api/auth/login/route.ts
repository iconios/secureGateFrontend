import { NextResponse } from "next/server";
import { webStorage } from "../../../../lib/server-storage";
import { LoginManagerService } from "@shared/services/manager";

export const POST = async (request: Request) => {
  try {
    const credentials = await request.json();

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing NEXT_PUBLIC_API_BASE_URL configuration",
          data: null,
        },
        { status: 500 },
      );
    }

    // 1. Run the service fully on the server
    // We pass webStorage safely here because Route Handlers run inside Node.js
    const otherUserData = await LoginManagerService(
      { storage: webStorage },
      credentials,
      { baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL },
    );

    if (!otherUserData) {
      return NextResponse.json(
        {
          success: false,
          message: "Login service did not return necessary user data",
          data: null,
        },
        { status: 400 },
      );
    }

    // 2. Return the data back to your client-side useMutation
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: otherUserData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Login route error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Failed to authenticate manager";
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
