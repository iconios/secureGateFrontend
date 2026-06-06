"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardManagerService from "@shared/services/manager/dashboard.manager.service";

export const useDashboardData = (authToken: string) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("Missing apiBaseUrl environment variable");
  }

  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: () =>
      DashboardManagerService(authToken, {
        baseUrl: apiBaseUrl,
      }),
  });
};
