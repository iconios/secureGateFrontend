// Dashboard Manager Service
/**
 *
 */

import { ActionContext } from "./manager.types";

/*
#Plan:
1. Get and validate the necessary data
2. Pass the data to the API
3. Get the server response and send to the client
*/

const DashboardManagerService = async (
  context: ActionContext,
  config: { baseUrl: string },
) => {
  const API_BASE_URL = config.baseUrl;
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  try {
    const token = await context.storage.get("auth_token");
    if (!token) throw new Error("Unauthorized");
  } catch {}
};

export default DashboardManagerService;
