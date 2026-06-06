"server only";

import { webStorage } from "../../../../lib/server-storage";
import LogoutManagerService from "@shared/services/manager/logout.manager.service";
import { NextResponse } from "next/server";

export const POST = async (_request: Request) => {
  try {
    // 1. Run the service fully on the server
    // We pass webStorage safely here because Route Handlers run inside Node.js
    const result = await LogoutManagerService({ storage: webStorage });

    // 2. Return the data back to your client-side useMutation
    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Logout route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during logout",
      },
      { status: 500 },
    );
  }
};
