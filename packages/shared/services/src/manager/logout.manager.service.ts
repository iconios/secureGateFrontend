"server only";

// Logout Manager Service
/*
#Plan:
1. Get and validate the necessary data
2. Clear the cookie
3. Send response to the client
*/

import { ActionContext, ServerLogoutResponse } from "./manager.types";

const LogoutManagerService = async (
  context: ActionContext,
): Promise<ServerLogoutResponse> => {
  try {
    // Step 2. Clear the cookie
    await context.storage.delete("auth_token");

    // Step 3. Send response to the client
    return {
      success: true,
      message: "User successfully logged out",
      data: {},
      error: {},
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Unknown error logging out user",
      data: {},
      error: {
        name: error?.name,
        message: error?.message ?? "Unknown error logging out user",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};

export default LogoutManagerService;
