"use client";

/*
#Plan:
1. Import React Query and the dashboard service used to fetch manager dashboard data.
*/

/*
Workflow Step 1:
1. Import React Query and the dashboard service used to fetch manager dashboard data.
2. Create a dashboard data hook that receives the current authentication token.
3. Read the public API base URL from the Next.js environment variables.
4. Fetch dashboard data only when both apiBaseUrl and authToken are available.
5. Protect the query function from running with missing configuration.
6. Call the dashboard service and return its result to React Query.
7. 
*/
import { useQuery } from "@tanstack/react-query";
import DashboardManagerService from "@shared/services/manager/dashboard.manager.service";
import { ServerManagerDashboardResponse } from "@shared/services/manager";

/*
Workflow Step 2:
Create a dashboard data hook that receives the current authentication token.
*/
export const useDashboardData = (authToken?: string | null) => {
  /*
  Workflow Step 3:
  Read the public API base URL from the Next.js environment variables.
  */
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  /*
  Workflow Step 4:
  Fetch dashboard data only when both apiBaseUrl and authToken are available.
  The authToken is also included in the query key so React Query refetches when it changes.
  */
  return useQuery<ServerManagerDashboardResponse>({
    queryKey: ["dashboardData", authToken],
    enabled: Boolean(apiBaseUrl && authToken),
    retry: false,
    queryFn: async () => {
      /*
      Workflow Step 5:
      Protect the query function from running with missing configuration.
      */
      if (!apiBaseUrl) {
        throw new Error(
          "Missing NEXT_PUBLIC_API_BASE_URL environment variable",
        );
      }

      if (!authToken) {
        throw new Error("Missing authentication token");
      }

      /*
      Workflow Step 6:
      Call the dashboard service and return its result to React Query.
      */
      return await DashboardManagerService(authToken, {
        baseUrl: apiBaseUrl,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};
